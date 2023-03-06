namespace Sensorize.Domain.Models
{
    public class DeviceType
    {
        public int DeviceTypeId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}