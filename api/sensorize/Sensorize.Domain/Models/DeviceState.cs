using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
	public class DeviceState : BaseModel
	{
		public int DeviceStateId { get; set; }
		public int DeviceId { get; set; }
		public double? Measurement { get; set; }
		public string? Description { get; set; }
		public bool IsNotified { get; set; }
		public DateTime? AlertStateBegin { get; set; }
		public DateTime? AlertStateEnd { get; set; }

		public virtual Device? Device { get; set; }
	}
}