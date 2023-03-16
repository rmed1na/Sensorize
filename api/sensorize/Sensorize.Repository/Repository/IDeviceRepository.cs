using Sensorize.Domain.Models;
using Sensorize.Repository.Context;

namespace Sensorize.Repository.Repository
{
    public interface IDeviceRepository
    {
        public ISensorizeContext Context { get; }

        Task AddAsync(Device device);
        Task<Device?> GetAsync(int id);
        Task<Device?> GetAsync(string topic);
        Task<ICollection<Device>> GetAllAsync(bool onlyActive = true);
        Task<ICollection<DeviceState>> GetStatesAsync(bool onlyActive = true);
        Task UpsertState(DeviceState state);
        Task SaveAsync(Device device);
    }
}
