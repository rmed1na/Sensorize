﻿using Microsoft.AspNetCore.Mvc;
using Sensorize.Api.Helpers.Email;
using Sensorize.Api.Models.Dto;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;
using Sensorize.Utility.Extensions;
using System.Text.Json;

namespace AssetControl.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private const int MAX_MINUTES_WAIT_TO_ALERT = 5;
        private readonly IDeviceRepository _deviceRepository;
        private readonly IEmailSender _emailSender;

        public DeviceController(
            IDeviceRepository deviceRepository,
            IEmailSender emailSender)
        {
            _deviceRepository = deviceRepository;
            _emailSender = emailSender;
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
                HasAlert = request.HasAlert,
                NotificationGroupId = request.NotificationGroupId,
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
            device.NotificationGroupId = request.NotificationGroupId;

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
                    var dto = new DeviceStateDto(state);

                    await response.WriteAsync($"data: {JsonSerializer.Serialize(dto, jsonOptions)}\n\n");
                    await response.Body.FlushAsync();
                }
                cycles++;
                await Task.Delay(5_000);
            }
        }
    }
}