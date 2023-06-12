using Sensorize.Api.Models.ApiSettings;

namespace Sensorize.Api.Models.AppSettings
{
    public class ApiSettings
    {
        public DataSource DataSource { get; set; }
        public SystemEmail SystemEmail { get; set; }
        public MqttServer MqttServer { get; set; }
        public string? AllowedOrigins { get; set; }

        public ApiSettings()
        {
            DataSource = new DataSource();
            SystemEmail = new SystemEmail();
            MqttServer = new MqttServer();
        }
    }
}
