using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Meta;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public interface ISensorRepository
    {
        public ISensorizeContext Context { get; }

        Task AddAsync(Sensor sensor);
        Task<Sensor?> GetAsync(int id);
        Task<Sensor?> GetAsync(string topic);
        Task<ICollection<Sensor>> GetAllAsync(bool onlyActive = true);
        Task<ICollection<SensorState>> GetStatesAsync(bool onlyActive = true);
        Task UpsertState(SensorState state);
        Task SaveAsync(BaseModel sensor, bool setUpdateTime = true);
    }
}
