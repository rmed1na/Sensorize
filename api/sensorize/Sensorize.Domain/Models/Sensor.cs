using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
    public class Sensor : BaseModel
    {
        public int SensorId { get; set; }
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

        public virtual ICollection<SensorMeasureProperty>? MeasureProperties { get; set; }
        public virtual NotificationGroup? NotificationGroup { get; set; }

        public SensorMeasureProperty? GetMeasureProperty(string name)
        {
            if (MeasureProperties != null && MeasureProperties.Any())
                return MeasureProperties.FirstOrDefault(x => x.PropertyCode.ToLower() == name.ToLower());

            return null;
        }
    }
}