using Microsoft.Extensions.Caching.Memory;
using MQTTnet;
using MQTTnet.Client;

namespace AssetControl.Api.EventListeners
{
    public class DeviceStatusListener
    {
        private readonly MqttFactory _mqttFactory;
        private readonly IMqttClient _mqttClient;
        private readonly IMemoryCache _cache;

        public DeviceStatusListener(IServiceProvider serviceProvider)
        {
            _mqttFactory = new MqttFactory();
            _mqttClient = _mqttFactory.CreateMqttClient();
            _cache = serviceProvider.GetRequiredService<IMemoryCache>();
        }

        public async Task ListenAsync()
        {
            await _mqttClient.ConnectAsync(BuildMqttClient("localhost"), CancellationToken.None);
            _mqttClient.ApplicationMessageReceivedAsync += e =>
            {
                const string Key = "mqtt-stream";
                var message = e.ApplicationMessage.ConvertPayloadToString();
                Console.WriteLine($"{DateTime.Now} - MQTT message: \n{message}");

                _cache.Set($"{Key}.{e.ApplicationMessage.Topic}", message);
                //var data = _cache.Get<List<string>>(Key) ?? new List<string>();
                //data.Add(message);
                //_cache.Set(Key, data, DateTime.Now.AddMinutes(5));
                //
                //Console.WriteLine($"{DateTime.Now} - queue size: {data.Count}");

                return Task.CompletedTask;
            };

            //4dcb7421-6e6f-411a-a56b-7fdcd655086b
            //cde376af-8072-4edc-811b-f02ca86e88a1
            //await SubscribeToTopicAsync("test_Data");
            await SubscribeToTopicAsync("4dcb7421-6e6f-411a-a56b-7fdcd655086b/data"); // door 1
            await SubscribeToTopicAsync("22ddaecc-780c-45fa-8fea-12e12821f3f6/data"); // door 2
            await SubscribeToTopicAsync("cde376af-8072-4edc-811b-f02ca86e88a1/data"); // A/C 1
            await SubscribeToTopicAsync("c4e14e7a-8da4-4c5c-81fb-6c9dcbc827bc/data"); // A/C 2
            await SubscribeToTopicAsync("741c8960-c20f-4f23-837d-80f453aab884/data"); // A/C 3
        }

        #region Helpers
        private MqttClientOptions? BuildMqttClient(string server)
            => new MqttClientOptionsBuilder()
                .WithTcpServer(server)
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
