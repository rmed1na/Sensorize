using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Utility.Extensions;

namespace Sensorize.Api.Models.Dto
{
    public class DeviceDto
    {
		public int DeviceId { get; set; }
		public string? Name { get; set; }
		public DateTime CreatedDate { get; set; }
		public DateTime? UpdatedDate { get; set; }
		public MeasureTypeCode MeasureTypeCode { get; set; }
		public string? MeasureType { get; set; }
		public bool IsActive { get; set; }
		public string? Topic { get; set; }
		public string? Channel { get; set; }
		public ICollection<MeasurePropertyDto> MeasureProperties { get; set; } = new List<MeasurePropertyDto>();

		public DeviceDto() { }

		public DeviceDto(Device device)
		{
			DeviceId = device.DeviceId;
			Name = device.Name;
			CreatedDate = device.CreatedDate;
			UpdatedDate = device.UpdatedDate;
			MeasureTypeCode = device.MeasureTypeCode;
			MeasureType = device.MeasureTypeCode.GetDisplayName();
			IsActive = device.StatusCode == GlobalStatusCode.Active;
			Topic = device.Topic;
			Channel = device.Channel;

			if (device.MeasureProperties != null && device.MeasureProperties.Any())
			{
				MeasureProperties = new List<MeasurePropertyDto>();
				foreach (var mprop in device.MeasureProperties)
					MeasureProperties.Add(new MeasurePropertyDto(mprop));
			}
		}
	}
}