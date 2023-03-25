using Sensorize.Domain.Enums;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Domain.Models
{
    public class NotificationGroup : BaseModel
    {
        public int NotificationGroupId { get; set; }
        public string Name { get; set; } = string.Empty;
        public GlobalStatusCode StatusCode { get; set; }

        public NotificationGroup()
        {
            StatusCode = GlobalStatusCode.Active;
        }
    }
}
