using Sensorize.Domain.Models;

namespace Sensorize.Repository.Repository
{
    public interface ISensorTypeRepository
    {
        Task AddAsync(SensorType sensorType);
        Task<ICollection<SensorType>> GetAllAsync();
    }
}
