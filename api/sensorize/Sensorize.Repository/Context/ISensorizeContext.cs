using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;

namespace Sensorize.Repository.Context
{
    public interface ISensorizeContext
    {
        DbSet<DeviceType> DeviceTypes { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        int SaveChanges();
    }
}