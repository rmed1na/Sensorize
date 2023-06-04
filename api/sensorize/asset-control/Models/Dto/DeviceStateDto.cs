using Humanizer;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Constants;
using System.Globalization;

namespace Sensorize.Api.Models.Dto
{
	public class DeviceStateDto
	{
		public DeviceDto Device { get; set; }
		public double? Measurement { get; set; }
		public string? Description { get; set; }
		public DateTime LastUpdate { get; set; }
		public string? TimeSpanDescription { get; set; }
		public bool IsOnAlert { get; }

		public DeviceStateDto(DeviceState state)
		{
            ArgumentNullException.ThrowIfNull(state.Device);

            Device = new DeviceDto(state.Device);
			Measurement = state.Measurement;
			Description = state.Description;
			LastUpdate = state.UpdatedDate ?? state.CreatedDate;
			TimeSpanDescription = (DateTime.Now - LastUpdate).Humanize(culture: new CultureInfo("es"));

			if (state.Device.HasAlert)
			{
				switch (state.Device.MeasureTypeCode)
				{
					case MeasureTypeCode.Volume:
						if (double.TryParse(state.Device.GetMeasureProperty(MeasurePropertyCode.VolumeMaxCapacity)?.PropertyValue, out double maxCap))
						{
							var currentRatio = state.Measurement / maxCap;
							if (currentRatio <= state.Device.AlertMinRatio)
								IsOnAlert = true;
						}
						break;
					case MeasureTypeCode.Binary:
						var value = state.Measurement == 1d;
						
						if (bool.TryParse(state.Device.AlertOn, out bool trigger) && value == trigger)
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
