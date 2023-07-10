using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Utility.Extensions;

namespace Sensorize.Api.Models.Dto
{
    public class SensorDto
    {
		public int SensorId { get; set; }
		public string? Name { get; set; }
		public DateTime CreatedDate { get; set; }
		public DateTime? UpdatedDate { get; set; }
		public MeasureTypeCode MeasureTypeCode { get; set; }
		public string? MeasureType { get; set; }
		public bool IsActive { get; set; }
		public string? Topic { get; set; }
		public string? Channel { get; set; }
		public bool HasAlert { get; set; }
		public double? AlertMinLevel { get; set; }
		public double? AlertMaxLevel { get; set; }
		public string? AlertOn { get; set; }
		public int? NotificationGroupId { get; set; }
		public int? StateNotificationFrequency { get; set; }
		public ICollection<MeasurePropertyDto> MeasureProperties { get; set; } = new List<MeasurePropertyDto>();

		public SensorDto() { }

		public SensorDto(Sensor sensor)
		{
			SensorId = sensor.SensorId;
			Name = sensor.Name;
			CreatedDate = sensor.CreatedDate;
			UpdatedDate = sensor.UpdatedDate;
			MeasureTypeCode = sensor.MeasureTypeCode;
			MeasureType = sensor.MeasureTypeCode.GetDisplayName();
			IsActive = sensor.StatusCode == GlobalStatusCode.Active;
			Topic = sensor.Topic;
			Channel = sensor.Channel;
			NotificationGroupId = sensor.NotificationGroupId;
			StateNotificationFrequency = sensor.StateNotificationFrequency;

			if (sensor.MeasureProperties != null && sensor.MeasureProperties.Any())
			{
				MeasureProperties = new List<MeasurePropertyDto>();
				foreach (var mprop in sensor.MeasureProperties)
					MeasureProperties.Add(new MeasurePropertyDto(mprop));
			}

			if (sensor.HasAlert)
			{
				HasAlert = sensor.HasAlert;
				AlertMinLevel = sensor.AlertMinRatio * 100;
				AlertMaxLevel = sensor.AlertMaxRatio * 100;
				AlertOn = sensor.AlertOn;
			}
		}
	}
}