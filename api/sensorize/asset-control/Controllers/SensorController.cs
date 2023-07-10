using AssetControl.Api.EventListeners;
using Microsoft.AspNetCore.Mvc;
using MQTTnet;
using MQTTnet.Client;
using Sensorize.Api.Models.Dto;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;
using System.Text.Json;

namespace AssetControl.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private readonly ISensorRepository _sensorRepository;
        private readonly MqttFactory _mqttFactory;
        private readonly IMqttClient _mqttClient;

        public SensorController(ISensorRepository sensorRepository, IServiceProvider serviceProvider)
        {
            _sensorRepository = sensorRepository;
            _mqttFactory = serviceProvider.GetRequiredService<MqttFactory>();
            _mqttClient = serviceProvider.GetRequiredService<IMqttClient>();
        }

        [HttpPost]
        public async Task<IActionResult> AddAsync(SensorDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest("Name can't be null or empty");
            if (request.MeasureTypeCode == MeasureTypeCode.Unknown)
                return BadRequest("Measure code must be defined");
            if (string.IsNullOrWhiteSpace(request.Topic))
                return BadRequest("Topic is required");

            var topicSensor = await _sensorRepository.GetAsync(request.Topic);
            if (topicSensor != null)
                return Conflict($"Sensor with topic {request.Topic} already exists");

            var sensor = new Sensor
            {
                Name = request.Name,
                MeasureTypeCode = request.MeasureTypeCode,
                StatusCode = GlobalStatusCode.Active,
                Topic = request.Topic,
                Channel = request.Channel,
                HasAlert = request.HasAlert,
                NotificationGroupId = request.NotificationGroupId,
                StateNotificationFrequency = request.StateNotificationFrequency
            };

            if (request.HasAlert)
            {
                sensor.AlertMinRatio = request.AlertMinLevel / 100;
                sensor.AlertMaxRatio = request.AlertMaxLevel / 100;
                sensor.AlertOn = request.AlertOn;
            }

            if (request.MeasureProperties != null && request.MeasureProperties.Any())
            {
                sensor.MeasureProperties = new List<SensorMeasureProperty>();
                foreach (var prop in request.MeasureProperties)
                    sensor.MeasureProperties.Add(new SensorMeasureProperty(sensor, prop.Code, prop.Value));
            }

            await _sensorRepository.AddAsync(sensor);
            await SensorStatusListener.SubscribeToTopicAsync(_mqttFactory, _mqttClient, sensor.Topic);
            return Ok(new SensorDto(sensor));
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var sensors = await _sensorRepository.GetAllAsync();
            return Ok(sensors.Select(x => new SensorDto(x)));
        }

        [HttpPut]
        [Route("{sensorId:int}")]
        public async Task<IActionResult> UpdateAsync(int sensorId, SensorDto request)
        {
            var sensor = await _sensorRepository.GetAsync(sensorId);
            if (sensor == null)
                return NotFound($"Sensor with id {sensorId} not found");

            sensor.Name = request.Name ?? sensor.Name;
            sensor.Topic = request.Topic;
            sensor.Channel = request.Channel;
            sensor.MeasureTypeCode = request.MeasureTypeCode;
            sensor.NotificationGroupId = request.NotificationGroupId;
            sensor.StateNotificationFrequency = request.StateNotificationFrequency;

            if (request.MeasureProperties != null && request.MeasureProperties.Any())
            {
                sensor.MeasureProperties ??= new List<SensorMeasureProperty>();
                foreach (var property in request.MeasureProperties)
                {
                    var existing = sensor.MeasureProperties.FirstOrDefault(p => p.PropertyCode == property.Code);
                    if (existing != null)
                    {
                        existing.PropertyValue = property.Value;
                        existing.SetUpdated();
                    }
                    else
                        sensor.MeasureProperties.Add(new SensorMeasureProperty(sensor, property.Code, property.Value));
                }
            }

            if (request.HasAlert)
            {
                sensor.HasAlert = true;
                sensor.AlertMinRatio = request.AlertMinLevel / 100;
                sensor.AlertMaxRatio = request.AlertMaxLevel / 100;
                sensor.AlertOn = request.AlertOn;
            }
            else
            {
                sensor.HasAlert = false;
                sensor.AlertMinRatio = null;
                sensor.AlertMaxRatio = null;
                sensor.AlertOn = null;
            }

            await _sensorRepository.SaveAsync(sensor);
            return Ok(new SensorDto(sensor));
        }

        [HttpGet]
        [Route("states")]
        public async Task StreamSensorStatesAsync()
        {
            var cycles = 0;
            var response = Response;
            response.Headers.Add("Content-Type", "text/event-stream");

            var sensorStates = await _sensorRepository.GetStatesAsync();
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            while (cycles <= 1_000)
            {
                foreach (var state in sensorStates)
                {
                    await _sensorRepository.Context.ReloadAsync(state);
                    var dto = new SensorStateDto(state);

                    await response.WriteAsync($"data: {JsonSerializer.Serialize(dto, jsonOptions)}\n\n");
                    await response.Body.FlushAsync();
                }
                cycles++;
                await Task.Delay(5_000);
            }
        }
    }
}