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
    public class DeviceStatusListener
    {
        private readonly MqttFactory _mqttFactory;
        private readonly IMqttClient _mqttClient;
        private readonly IMemoryCache _cache;
        private readonly IDeviceRepository _deviceRepository;
        private readonly ApiSettings _settings;

        public static string StreamKey => "sensorize_device_status";

        public DeviceStatusListener(IServiceProvider serviceProvider)
        {
            var scope = serviceProvider.CreateScope();

            _mqttFactory = serviceProvider.GetRequiredService<MqttFactory>();
            _mqttClient = serviceProvider.GetRequiredService<IMqttClient>();
            _cache = serviceProvider.GetRequiredService<IMemoryCache>();
            _settings = serviceProvider.GetRequiredService<ApiSettings>();
            _deviceRepository = scope.ServiceProvider.GetRequiredService<IDeviceRepository>();
        }

        public async Task ListenAsync()
        {
            await _mqttClient.ConnectAsync(BuildMqttClient(_settings.MqttServer.Ip, _settings.MqttServer.Port), CancellationToken.None);
            _mqttClient.ApplicationMessageReceivedAsync += async e =>
            {
                Console.WriteLine($"New message received on topic: {e.ApplicationMessage.Topic} at {DateTime.Now}");
                var device = await _deviceRepository.GetAsync(e.ApplicationMessage.Topic);

                if (device != null)
                {
                    var data = JsonSerializer.Deserialize<Dictionary<string, object>>(e.ApplicationMessage.ConvertPayloadToString());
                    if (data == null || !data.Any())
                        return;

                    data.TryGetValue(device.Channel!, out object? measurementObj);
                    if (measurementObj == null)
                        return;

                    var measurementStr = measurementObj.ToString();
                    var isDouble = double.TryParse(measurementStr, out double measurementDouble);
                    var isBool = bool.TryParse(measurementStr, out bool measurementBool);
                    if (!string.IsNullOrEmpty(measurementStr))
                    {
                        DeviceState? state = null;

                        if (isBool)
                            state = DeviceStateHandler.ComputeMeasurement(device, measurementBool);
                        if (isDouble)
                            state = DeviceStateHandler.ComputeMeasurement(device, measurementDouble);

                        ArgumentNullException.ThrowIfNull(state);
                        await _deviceRepository.UpsertState(state);
                    }
                }
            };

            var devices = await _deviceRepository.GetAllAsync();
            if (devices == null || !devices.Any())
            {
                Console.WriteLine("No devices to subscribe to");
                return;
            }

            foreach (var topic in devices.Where(d => d.Topic != null).Select(d => d.Topic))
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
