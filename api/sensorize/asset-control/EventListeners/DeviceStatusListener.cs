using Microsoft.Extensions.Caching.Memory;
using MQTTnet;
using MQTTnet.Client;
using Sensorize.Api.Controllers.Handlers;
using Sensorize.Api.Helpers.Email;
using Sensorize.Api.Models.AppSettings;
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

            _mqttFactory = new MqttFactory();
            _mqttClient = _mqttFactory.CreateMqttClient();
            _cache = serviceProvider.GetRequiredService<IMemoryCache>();
            _settings = serviceProvider.GetRequiredService<ApiSettings>();
            _deviceRepository = scope.ServiceProvider.GetRequiredService<IDeviceRepository>();
        }

        public async Task ListenAsync()
        {
            var devices = await _deviceRepository.GetAllAsync();
            if (devices == null || !devices.Any())
            {
                Console.WriteLine("No devices to subscribe to");
                return;
            }

            await _mqttClient.ConnectAsync(BuildMqttClient(_settings.MqttServer.Ip, _settings.MqttServer.Port), CancellationToken.None);
            _mqttClient.ApplicationMessageReceivedAsync += async e =>
            {
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
                    if (!string.IsNullOrEmpty(measurementStr) && double.TryParse(measurementStr, out double measurement))
                    {
                        var state = DeviceStateHandler.ComputeMeasurement(device, measurement);
                        await _deviceRepository.UpsertState(state);
                    }
                }
            };

            // TODO: Handle new subscriptions that may come in after startup (new added device)
            foreach (var topic in devices.Where(d => d.Topic != null).Select(d => d.Topic))
                await SubscribeToTopicAsync(topic!);
        }

        #region Helpers
        private static MqttClientOptions? BuildMqttClient(string? server, int? port = null)
            => new MqttClientOptionsBuilder()
                .WithTcpServer(server, port)
                .Build();

        private async Task SubscribeToTopicAsync(string topic)
        {
            var mqttSubscriberOptions = _mqttFactory.CreateSubscribeOptionsBuilder()
                .WithTopicFilter(f =>
                {
                    f.WithTopic(topic);
                }).Build();

            await _mqttClient.SubscribeAsync(mqttSubscriberOptions, CancellationToken.None);
        }
        #endregion
    }
}
