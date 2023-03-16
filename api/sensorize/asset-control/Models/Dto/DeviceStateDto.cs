using Humanizer;
using Sensorize.Domain.Models;
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

		public DeviceStateDto(DeviceState state)
		{
			Device = new DeviceDto(state.Device!);
			Measurement = state.Measurement;
			Description = state.Description;
			LastUpdate = state.UpdatedDate ?? state.CreatedDate;
			TimeSpanDescription = (DateTime.Now - LastUpdate).Humanize(culture: new CultureInfo("es"));
		}
	}
}
