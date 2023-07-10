using Humanizer;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Constants;
using System.Globalization;

namespace Sensorize.Api.Models.Dto
{
	public class SensorStateDto
	{
		public SensorDto Sensor { get; set; }
		public double? Measurement { get; set; }
		public string? Description { get; set; }
		public DateTime LastUpdate { get; set; }
		public string? TimeSpanDescription { get; set; }
		public bool IsOnAlert { get; }

		public SensorStateDto(SensorState state)
		{
            ArgumentNullException.ThrowIfNull(state.Sensor);

            Sensor = new SensorDto(state.Sensor);
			Measurement = state.Measurement;
			Description = state.Description;
			LastUpdate = state.UpdatedDate ?? state.CreatedDate;
			TimeSpanDescription = (DateTime.Now - LastUpdate).Humanize(culture: new CultureInfo("es"));

			if (state.Sensor.HasAlert)
			{
				switch (state.Sensor.MeasureTypeCode)
				{
					case MeasureTypeCode.Volume:
						if (double.TryParse(state.Sensor.GetMeasureProperty(MeasurePropertyCode.VolumeMaxCapacity)?.PropertyValue, out double maxCap))
						{
							var currentRatio = state.Measurement / maxCap;
							if (currentRatio <= state.Sensor.AlertMinRatio)
								IsOnAlert = true;
						}
						break;
					case MeasureTypeCode.Binary:
						var value = state.Measurement == 1d;
						
						if (bool.TryParse(state.Sensor.AlertOn, out bool trigger) && value == trigger)
						{
							IsOnAlert = true;
						}
						break;
					default:
						break;
				}
			}
		}
	}
}
