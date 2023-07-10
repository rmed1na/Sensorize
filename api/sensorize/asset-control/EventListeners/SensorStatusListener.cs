using Microsoft.Extensions.Caching.Memory;
using MQTTnet;
using MQTTnet.Client;
using Sensorize.Api.Controllers.Handlers;
using Sensorize.Api.Models.AppSettings;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;
using System.Text.Json;

namespace AssetControl.Api.EventListeners
{
    public class SensorStatusListener
    {
        private readonly MqttFactory _mqttFactory;
        private readonly IMqttClient _mqttClient;
        private readonly IMemoryCache _cache;
        private readonly ISensorRepository _sensorRepository;
        private readonly ApiSettings _settings;

        public static string StreamKey => "sensorize_sensor_status";

        public SensorStatusListener(IServiceProvider serviceProvider)
        {
            var scope = serviceProvider.CreateScope();

            _mqttFactory = serviceProvider.GetRequiredService<MqttFactory>();
            _mqttClient = serviceProvider.GetRequiredService<IMqttClient>();
            _cache = serviceProvider.GetRequiredService<IMemoryCache>();
            _settings = serviceProvider.GetRequiredService<ApiSettings>();
            _sensorRepository = scope.ServiceProvider.GetRequiredService<ISensorRepository>();
        }

        public async Task ListenAsync()
        {
            await _mqttClient.ConnectAsync(BuildMqttClient(_settings.MqttServer.Ip, _settings.MqttServer.Port), CancellationToken.None);
            _mqttClient.ApplicationMessageReceivedAsync += async e =>
            {
                Console.WriteLine($"New message received on topic: {e.ApplicationMessage.Topic} at {DateTime.Now}");
                var sensor = await _sensorRepository.GetAsync(e.ApplicationMessage.Topic);

                if (sensor != null)
                {
                    var data = JsonSerializer.Deserialize<Dictionary<string, object>>(e.ApplicationMessage.ConvertPayloadToString());
                    if (data == null || !data.Any())
                        return;

                    data.TryGetValue(sensor.Channel!, out object? measurementObj);
                    if (measurementObj == null)
                        return;

                    var measurementStr = measurementObj.ToString();
                    var isDouble = double.TryParse(measurementStr, out double measurementDouble);
                    var isBool = bool.TryParse(measurementStr, out bool measurementBool);
                    if (!string.IsNullOrEmpty(measurementStr))
                    {
                        SensorState? state = null;

                        if (isBool)
                            state = SensorStateHandler.ComputeMeasurement(sensor, measurementBool);
                        if (isDouble)
                            state = SensorStateHandler.ComputeMeasurement(sensor, measurementDouble);

                        ArgumentNullException.ThrowIfNull(state);
                        await _sensorRepository.UpsertState(state);
                    }
                }
            };

            var sensors = await _sensorRepository.GetAllAsync();
            if (sensors == null || !sensors.Any())
            {
                Console.WriteLine("No sensors to subscribe to");
                return;
            }

            foreach (var topic in sensors.Where(d => d.Topic != null).Select(d => d.Topic))
                await SubscribeToTopicAsync(_mqttFactory, _mqttClient, topic!);
        }

        public static async Task SubscribeToTopicAsync(MqttFactory factory, IMqttClient client, string topic)
        {
            var options = factory
                .CreateSubscribeOptionsBuilder()
                .WithTopicFilter(f => f.WithTopic(topic))
                .Build();

            await client.SubscribeAsync(options, CancellationToken.None);
        }

        #region Helpers
        private static MqttClientOptions? BuildMqttClient(string? server, int? port = null)
            => new MqttClientOptionsBuilder()
                .WithTcpServer(server, port)
                .Build();
        #endregion
    }
}
