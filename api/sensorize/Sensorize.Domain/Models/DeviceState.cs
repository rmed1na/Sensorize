using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
	public class DeviceState : BaseModel
	{
		public int DeviceStateId { get; set; }
		public int DeviceId { get; set; }
		public double? Measurement { get; set; }
		public string? Description { get; set; }

		public virtual Device? Device { get; set; }
	}
}