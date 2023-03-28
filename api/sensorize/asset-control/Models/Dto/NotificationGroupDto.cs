using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;

namespace Sensorize.Api.Models.Dto
{
    public class NotificationGroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public NotificationGroupDto() { }
        public NotificationGroupDto(NotificationGroup group)
        {
            Id = group.NotificationGroupId;
            Name = group.Name;
            IsActive = group.StatusCode == GlobalStatusCode.Active;
            CreatedDate = group.CreatedDate;
            UpdatedDate = group.UpdatedDate;
        }
    }
}
