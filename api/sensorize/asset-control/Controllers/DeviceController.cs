using AssetControl.Api.EventListeners;
using AssetControl.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Sensorize.Api.Controllers.Handlers;
using Sensorize.Api.Models.Dto;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Context;
using Sensorize.Repository.Repository;
using System.Text.Json;

namespace AssetControl.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IMemoryCache _cache;
        private readonly List<DeviceOld> _tempDevices = new()
        {
            new DeviceOld { DeviceId = Guid.Parse("4dcb7421-6e6f-411a-a56b-7fdcd655086b"), Name = "Puerta 1", Type = DeviceTypeCode.Binary, Channel = "do1" },
            new DeviceOld { DeviceId = Guid.Parse("22ddaecc-780c-45fa-8fea-12e12821f3f6"), Name = "Puerta 2", Type = DeviceTypeCode.Binary, Channel = "do2" },
            new DeviceOld { DeviceId = Guid.Parse("cde376af-8072-4edc-811b-f02ca86e88a1"), Name = "A/C 1", Type = DeviceTypeCode.Temperature, Channel = "ai1" },
            new DeviceOld { DeviceId = Guid.Parse("c4e14e7a-8da4-4c5c-81fb-6c9dcbc827bc"), Name = "A/C 2", Type = DeviceTypeCode.Temperature, Channel = "ai2" },
            new DeviceOld { DeviceId = Guid.Parse("741c8960-c20f-4f23-837d-80f453aab884"), Name = "A/C 3", Type = DeviceTypeCode.Temperature, Channel = "ai3" }
        };

        public DeviceController(
            IDeviceRepository deviceRepository,
            IMemoryCache cache)
        {
            _deviceRepository = deviceRepository;
            _cache = cache;
        }

        [HttpPost]
        public async Task<IActionResult> AddAsync(DeviceDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Name can't be null or empty");
            if (request.MeasureTypeCode == MeasureTypeCode.Unknown)
                return BadRequest("Measure code must be defined");
            if (string.IsNullOrWhiteSpace(request.Topic))
                return BadRequest("Topic is required");

            var topicDevice = await _deviceRepository.GetAsync(request.Topic);
            if (topicDevice != null)
                return Conflict($"Device with topic {request.Topic} already exists");

            var device = new Device
            {
                Name = request.Name,
                MeasureTypeCode = request.MeasureTypeCode,
                StatusCode = GlobalStatusCode.Active,
                Topic = request.Topic,
                Channel = request.Channel,
                HasAlert = request.HasAlert
            };

            if (request.HasAlert)
            {
                device.AlertMinRatio = request.AlertMinLevel / 100;
                device.AlertMaxRatio = request.AlertMaxLevel / 100;
            }

            if (request.MeasureProperties != null && request.MeasureProperties.Any())
            {
                device.MeasureProperties = new List<DeviceMeasureProperty>();
                foreach (var prop in request.MeasureProperties)
                    device.MeasureProperties.Add(new DeviceMeasureProperty(device, prop.Code, prop.Value));
            }

            await _deviceRepository.AddAsync(device);
            return Ok(new DeviceDto(device));
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var devices = await _deviceRepository.GetAllAsync();
            return Ok(devices.Select(x => new DeviceDto(x)));
        }

        [HttpPut]
        [Route("{deviceId:int}")]
        public async Task<IActionResult> UpdateAsync(int deviceId, DeviceDto request)
        {
            var device = await _deviceRepository.GetAsync(deviceId);
            if (device == null)
                return NotFound($"Device with id {deviceId} not found");

            device.Name = request.Name ?? device.Name;
            device.Topic = request.Topic;
            device.Channel = request.Channel;
            device.MeasureTypeCode = request.MeasureTypeCode;

            if (request.MeasureProperties != null && request.MeasureProperties.Any())
            {
                device.MeasureProperties ??= new List<DeviceMeasureProperty>();
                foreach (var property in request.MeasureProperties)
                {
                    var existing = device.MeasureProperties.FirstOrDefault(p => p.PropertyCode == property.Code);
                    if (existing != null)
                    {
                        existing.PropertyValue = property.Value;
                        existing.SetUpdated();
                    }
                    else
                        device.MeasureProperties.Add(new DeviceMeasureProperty(device, property.Code, property.Value));
                }
            }

            if (request.HasAlert)
            {
                device.HasAlert = true;
                device.AlertMinRatio = request.AlertMinLevel / 100;
                device.AlertMaxRatio = request.AlertMaxLevel / 100;
            }
            else
            {
                device.HasAlert = false;
				device.AlertMinRatio = null;
				device.AlertMaxRatio = null;
            }

            await _deviceRepository.SaveAsync(device);
            return Ok(new DeviceDto(device));
        }

        [HttpGet]
        [Route("states")]
        public async Task StreamDeviceStatesAsync()
        {
            var cycles = 0;
            var response = Response;
            response.Headers.Add("Content-Type", "text/event-stream");

			var deviceStates = await _deviceRepository.GetStatesAsync();
			var jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            while (cycles <= 1_000)
            {
                foreach (var state in deviceStates)
                {
                    await _deviceRepository.Context.ReloadAsync(state);
					await response.WriteAsync($"data: {JsonSerializer.Serialize(new DeviceStateDto(state), jsonOptions)}\n\n");
					await response.Body.FlushAsync();
				}
                cycles++;
				await Task.Delay(5_000);
			}
        }

        [HttpGet]
        [Route("stream/statuses")]
        public async Task GetDeviceStatusesStreamAsync()
        {
            /*
            var response = Response;
            response.Headers.Add("Content-Type", "text/event-stream");

            var jsonOpt = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            foreach (var device in _tempDevices)
            {
                var status = GetDeviceStatusInternal(device);
                if (status == null)
                    continue;

                var data = $"data: {JsonSerializer.Serialize(status, jsonOpt)}\n\n";
                await response.WriteAsync(data);
                await response.Body.FlushAsync();
            }*/
            //const string Key = "mqtt-stream";
            //var items = _cache.Get<List<string>>(Key) ?? new List<string>();
            //_cache.Remove(Key);

            //foreach (var item in items)
            //{
            //    var status = JsonSerializer.Deserialize<DeviceStatus>(item, jsonOpt);
            //    var device = _tempDevices.FirstOrDefault(d => d.DeviceId == status?.DeviceId);
            //    if (status != null && device != null)
            //    {
            //        switch (device.Type)
            //        {
            //            case DeviceTypeCode.Binary:
            //                if (status.Measure == 1)
            //                {
            //                    status.IsOnAlert = true;
            //                    status.Description = "Abierta";
            //                    status.IconClass = "fa-solid fa-door-open";
            //                }
            //                else if (status.Measure == 0)
            //                {
            //                    status.IsOnAlert = false;
            //                    status.Description = "Cerrada";
            //                    status.IconClass = "fa-solid fa-door-closed";
            //                }
            //                break;
            //            case DeviceTypeCode.Temperature:
            //                status.Description = status.Measure.ToString();
            //                if (status.Measure >= 100)
            //                {
            //                    status.IsOnAlert = true;
            //                    status.IconClass = "fa-solid fa-temperature-arrow-up";
            //                }
            //                else
            //                {
            //                    status.IsOnAlert = false;
            //                    status.IconClass = "fa-solid fa-temperature-arrow-down";
            //                }
            //                break;
            //            default:
            //                break;
            //        }

            //        var data = $"data: {JsonSerializer.Serialize(status, jsonOpt)}\n\n";
            //        await response.WriteAsync(data);
            //        await response.Body.FlushAsync();
            //        await Task.Delay(500);
            //    }
            //}
        }
    }
}
