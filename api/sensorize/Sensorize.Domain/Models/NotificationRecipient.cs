using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
    public class NotificationRecipient : BaseModel
    {
        public int NotificationRecipientId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public GlobalStatusCode StatusCode { get; set; }

        public virtual NotificationGroup? Group { get; set; }
    }
}
