using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
    public class Device : BaseModel
    {
        public int DeviceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public GlobalStatusCode StatusCode { get; set; }
        public MeasureTypeCode MeasureTypeCode { get; set; }
        public string? Topic { get; set; }
        public string? Channel { get; set; }
        public bool HasAlert { get; set; }
        public double? AlertMinRatio { get; set; }
        public double? AlertMaxRatio { get; set; }
        public string? AlertOn { get; set; }
        public int? NotificationGroupId { get; set; }
        public int? StateNotificationFrequency { get; set; }

        public virtual ICollection<DeviceMeasureProperty>? MeasureProperties { get; set; }
        public virtual NotificationGroup? NotificationGroup { get; set; }

        public DeviceMeasureProperty? GetMeasureProperty(string name)
        {
            if (MeasureProperties != null && MeasureProperties.Any())
                return MeasureProperties.FirstOrDefault(x => x.PropertyCode.ToLower() == name.ToLower());

            return null;
        }
    }
}