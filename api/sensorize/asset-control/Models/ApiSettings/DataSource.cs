using System.Text;

namespace Sensorize.Api.Models.AppSettings
{
    public class DataSource
    {
        public string? Server { get; set; }
        public string? Database { get; set; }
        public uint Port { get; set; }
        public string? User { get; set; }
        public string? Password { get; set; }

        public string BuildMySqlConnectionString()        
            => $"Server={Server};Port={Port};Database={Database};Uid={User};Pwd={Password};";
    }
}
