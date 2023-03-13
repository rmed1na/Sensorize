using Sensorize.Domain.Models;

namespace Sensorize.Repository.Repository
{
    public interface IDeviceTypeRepository
    {
        Task AddAsync(DeviceType deviceType);
        Task<ICollection<DeviceType>> GetAllAsync();
    }
}
