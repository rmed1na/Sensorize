using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public class SensorTypeRepository : ISensorTypeRepository
    {
        private readonly ISensorizeContext _ctx;

        public SensorTypeRepository(ISensorizeContext ctx) => _ctx = ctx;

        public async Task AddAsync(SensorType sensorType)
        {
            await _ctx.SensorTypes.AddAsync(sensorType);
            await _ctx.SaveChangesAsync();
        }

        public async Task<ICollection<SensorType>> GetAllAsync()
            => await _ctx.SensorTypes.ToListAsync();
    }
}