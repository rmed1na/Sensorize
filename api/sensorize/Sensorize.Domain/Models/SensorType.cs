using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
    public class SensorType : BaseModel
    {
        public int SensorTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public MeasureTypeCode MeasureTypeCode { get; set; }
    }
}