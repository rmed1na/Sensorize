using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Meta;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public class SensorRepository : ISensorRepository
    {
        private readonly ISensorizeContext _ctx;

        public ISensorizeContext Context => _ctx;

        public SensorRepository(ISensorizeContext ctx) => _ctx = ctx;

        public async Task AddAsync(Sensor sensor)
        {
            await _ctx.Sensors.AddAsync(sensor);
            await _ctx.SaveChangesAsync();
        }

        public async Task<Sensor?> GetAsync(int id)
            => await _ctx.Sensors
                .Include(x => x.MeasureProperties)
                .FirstOrDefaultAsync(d => d.SensorId == id);

        public async Task<Sensor?> GetAsync(string topic)
            => await _ctx.Sensors
                .Include(x => x.MeasureProperties)
                .FirstOrDefaultAsync(x => x.Topic != null && x.Topic.ToLower() == topic.ToLower());

        public async Task<ICollection<Sensor>> GetAllAsync(bool onlyActive = true)
        {
            return await _ctx.Sensors
                .Include(x => x.MeasureProperties)
                .Where(x => !onlyActive || (onlyActive && x.StatusCode == GlobalStatusCode.Active))
                .ToListAsync();
        }

        public async Task<ICollection<SensorState>> GetStatesAsync(bool onlyActive = true)
        {
            return await _ctx.SensorStates
                .Include(x => x.Sensor!.MeasureProperties)
                .Include(x => x.Sensor!.NotificationGroup.Recipients)
                .Where(x => x.Sensor!.StatusCode == GlobalStatusCode.Active)
                .ToListAsync();
        }

		public async Task UpsertState(SensorState state)
        {
            var oldState = await _ctx.SensorStates.FirstOrDefaultAsync(x => x.SensorId == state.SensorId);
            if (oldState != null)
            {
                oldState.Measurement = state.Measurement;
                oldState.Description = state.Description;
                oldState.SetUpdated();
                await _ctx.SaveChangesAsync();
                return;
            }

            await _ctx.SensorStates.AddAsync(state);
            await _ctx.SaveChangesAsync();
        }

        public async Task SaveAsync(BaseModel sensor, bool setUpdateTime = true)
        {
            if (setUpdateTime)
                sensor.SetUpdated();
            await _ctx.SaveChangesAsync();
        }
    }
}
