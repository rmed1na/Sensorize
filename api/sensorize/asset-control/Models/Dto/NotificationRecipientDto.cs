using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;

namespace Sensorize.Api.Models.Dto
{
    public class NotificationRecipientDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; private set; }
        public string? GroupName { get; private set; }

        public NotificationRecipientDto() { }
        public NotificationRecipientDto(NotificationRecipient recipient)
        {
            Id = recipient.NotificationRecipientId;
            FirstName = recipient.FirstName;
            LastName = recipient.LastName;
            Email = recipient.Email;
            GroupId = recipient.GroupId;
            CreatedDate = recipient.CreatedDate;
            UpdatedDate = recipient.UpdatedDate;
            IsActive = recipient.StatusCode == GlobalStatusCode.Active;
            GroupName = recipient.Group?.Name;
        }
    }
}
