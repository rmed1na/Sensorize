using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Meta;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly ISensorizeContext _ctx;

        public ISensorizeContext Context => _ctx;

        public DeviceRepository(ISensorizeContext ctx) => _ctx = ctx;

        public async Task AddAsync(Device device)
        {
            await _ctx.Devices.AddAsync(device);
            await _ctx.SaveChangesAsync();
        }

        public async Task<Device?> GetAsync(int id)
            => await _ctx.Devices
                .Include(x => x.MeasureProperties)
                .FirstOrDefaultAsync(d => d.DeviceId == id);

        public async Task<Device?> GetAsync(string topic)
            => await _ctx.Devices
                .Include(x => x.MeasureProperties)
                .FirstOrDefaultAsync(x => x.Topic != null && x.Topic.ToLower() == topic.ToLower());

        public async Task<ICollection<Device>> GetAllAsync(bool onlyActive = true)
        {
            return await _ctx.Devices
                .Include(x => x.MeasureProperties)
                .Where(x => !onlyActive || (onlyActive && x.StatusCode == GlobalStatusCode.Active))
                .ToListAsync();
        }

        public async Task<ICollection<DeviceState>> GetStatesAsync(bool onlyActive = true)
        {
            return await _ctx.DeviceStates
                .Include(x => x.Device!.MeasureProperties)
                .Include(x => x.Device!.NotificationGroup.Recipients)
                .Where(x => x.Device!.StatusCode == GlobalStatusCode.Active)
                .ToListAsync();
        }

		public async Task UpsertState(DeviceState state)
        {
            var oldState = await _ctx.DeviceStates.FirstOrDefaultAsync(x => x.DeviceId == state.DeviceId);
            if (oldState != null)
            {
                oldState.Measurement = state.Measurement;
                oldState.Description = state.Description;
                oldState.SetUpdated();
                await _ctx.SaveChangesAsync();
                return;
            }

            await _ctx.DeviceStates.AddAsync(state);
            await _ctx.SaveChangesAsync();
        }

        public async Task SaveAsync(BaseModel device, bool setUpdateTime = true)
        {
            if (setUpdateTime)
                device.SetUpdated();
            await _ctx.SaveChangesAsync();
        }
    }
}
