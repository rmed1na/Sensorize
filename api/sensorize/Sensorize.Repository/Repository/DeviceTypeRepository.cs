using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public class DeviceTypeRepository : IDeviceTypeRepository
    {
        private readonly ISensorizeContext _ctx;

        public DeviceTypeRepository(ISensorizeContext ctx) => _ctx = ctx;

        public async Task AddAsync(DeviceType deviceType)
        {
            await _ctx.DeviceTypes.AddAsync(deviceType);
            await _ctx.SaveChangesAsync();
        }

        public async Task<ICollection<DeviceType>> GetAllAsync()
            => await _ctx.DeviceTypes.ToListAsync();
    }
}