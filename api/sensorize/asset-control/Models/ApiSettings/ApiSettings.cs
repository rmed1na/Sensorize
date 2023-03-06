namespace Sensorize.Api.Models.AppSettings
{
    public class ApiSettings
    {
        public DataSource DataSource { get; set; }
        public string? AllowedOrigins { get; set; }

        public ApiSettings()
        {
            DataSource = new DataSource();
        }
    }
}
