using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Meta;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        public readonly ISensorizeContext _ctx;

        public NotificationRepository(ISensorizeContext ctx) => _ctx = ctx;

        public async Task AddGroupAsync(NotificationGroup group)
        {
            await _ctx.NotificationGroups.AddAsync(group);
            await _ctx.SaveChangesAsync();
        }

        public async Task<NotificationGroup?> GetGroupAsync(string name)
            => await _ctx.NotificationGroups.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());

        public async Task<NotificationGroup?> GetGroupAsync(int groupId)
            => await _ctx.NotificationGroups.FirstOrDefaultAsync(x => x.NotificationGroupId == groupId);

        public async Task<ICollection<NotificationGroup>> GetGroupsAsync()
            => await _ctx.NotificationGroups.ToListAsync();

        public async Task SaveAsync(BaseModel model)
        {
            model.SetUpdated();
            await _ctx.SaveChangesAsync();
        }
    }
}
