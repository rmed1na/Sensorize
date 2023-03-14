using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
	public class DeviceMeasureProperty : BaseModel
	{
		public int DeviceMeasurePropertyId { get; set; }
		public int DeviceId { get; set; }
		public string PropertyCode { get; set; }
		public string? PropertyValue { get; set; }
		public GlobalStatusCode StatusCode { get; set; }

		public virtual Device Device { get; set; }

		public DeviceMeasureProperty()
		{
			StatusCode = GlobalStatusCode.Active;
			PropertyCode = string.Empty;
			Device ??= new Device();
		}

		public DeviceMeasureProperty(Device device, string code, string? value)
		{
			StatusCode = GlobalStatusCode.Active;
			Device = device;
			PropertyCode = code;
			PropertyValue = value;
		}
	}
}