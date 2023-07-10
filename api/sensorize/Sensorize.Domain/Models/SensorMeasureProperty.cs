using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
	public class SensorMeasureProperty : BaseModel
	{
		public int SensorMeasurePropertyId { get; set; }
		public int SensorId { get; set; }
		public string PropertyCode { get; set; }
		public string? PropertyValue { get; set; }
		public GlobalStatusCode StatusCode { get; set; }

		public virtual Sensor Sensor { get; set; }

		public SensorMeasureProperty()
		{
			StatusCode = GlobalStatusCode.Active;
			PropertyCode = string.Empty;
			Sensor ??= new Sensor();
		}

		public SensorMeasureProperty(Sensor sensor, string code, string? value)
		{
			StatusCode = GlobalStatusCode.Active;
			Sensor = sensor;
			PropertyCode = code;
			PropertyValue = value;
		}
	}
}