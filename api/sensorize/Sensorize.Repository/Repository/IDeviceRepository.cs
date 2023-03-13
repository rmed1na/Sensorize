using Sensorize.Domain.Models;

namespace Sensorize.Repository.Repository
{
    public interface IDeviceRepository
    {
        Task AddAsync(Device device);
        Task<Device?> GetAsync(int id);
        Task<ICollection<Device>> GetAllAsync();
        Task SaveAsync(Device device);
    }
}
