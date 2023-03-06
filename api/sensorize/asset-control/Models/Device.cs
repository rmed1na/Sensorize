using Sensorize.Domain.Enums;

namespace AssetControl.Api.Models
{
    public class Device
    {
        public Guid DeviceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DeviceTypeCode Type { get; set; }
        public string? Channel { get; set; }
        public DeviceStatus? Status { get; set; }
        public string Topic => $"{DeviceId}/data";
    }
}
