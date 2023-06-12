using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
    public class DeviceType : BaseModel
    {
        public int DeviceTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public MeasureTypeCode MeasureTypeCode { get; set; }
    }
}