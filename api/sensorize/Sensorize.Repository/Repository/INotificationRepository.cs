using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Meta;

namespace Sensorize.Repository.Repository
{
    public interface INotificationRepository
    {
        Task AddGroupAsync(NotificationGroup group);
        Task<NotificationGroup?> GetGroupAsync(string name);
        Task<NotificationGroup?> GetGroupAsync(int groupId);
        Task<ICollection<NotificationGroup>> GetGroupsAsync();

        Task AddRecipientAsync(NotificationRecipient recipient);
        Task<ICollection<NotificationRecipient>> GetRecipientsAsync();
        Task<NotificationRecipient?> GetRecipientAsync(int recipientId);

        Task SaveAsync(BaseModel model);
    }
}
