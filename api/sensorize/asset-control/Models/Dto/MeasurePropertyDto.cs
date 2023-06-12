using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;

namespace Sensorize.Api.Models.Dto
{
	public class MeasurePropertyDto
	{
		public int MeasurePropertyId { get; set; }
		public string Code { get; set; } = string.Empty;
		public string? Value { get; set; }
		public bool IsActive { get; private set; }

		public MeasurePropertyDto() { }

		public MeasurePropertyDto(DeviceMeasureProperty measureProp)
		{
			Code = measureProp.PropertyCode;
			Value = measureProp.PropertyValue;
			IsActive = measureProp.StatusCode == GlobalStatusCode.Active;
		}
	}
}
