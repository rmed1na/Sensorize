using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly ISensorizeContext _ctx;

        public DeviceRepository(ISensorizeContext ctx) => _ctx = ctx;

        public async Task AddAsync(Device device)
        {
            await _ctx.Devices.AddAsync(device);
            await _ctx.SaveChangesAsync();
        }

        public async Task<Device?> GetAsync(int id)
            => await _ctx.Devices.FirstOrDefaultAsync(d => d.DeviceId == id);

        public async Task<ICollection<Device>> GetAllAsync()
        {
            return await _ctx.Devices.ToListAsync();
        }

        public async Task SaveAsync(Device device)
        {
            device.SetUpdated();
            await _ctx.SaveChangesAsync();
        }
    }
}
