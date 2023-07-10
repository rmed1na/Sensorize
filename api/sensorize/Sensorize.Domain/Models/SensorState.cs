using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
	public class SensorState : BaseModel
	{
		public int SensorStateId { get; set; }
		public int SensorId { get; set; }
		public double? Measurement { get; set; }
		public string? Description { get; set; }
		public bool IsNotified { get; set; }
		public DateTime? AlertStateBegin { get; set; }
		public DateTime? AlertStateEnd { get; set; }
		public DateTime? LastStateNotification { get; set; }
		public DateTime? NextStateNotification { get; set; }


        public virtual Sensor? Sensor { get; set; }
	}
}