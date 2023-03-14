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

        public virtual ICollection<DeviceMeasureProperty>? MeasureProperties { get; set; }
    }
}