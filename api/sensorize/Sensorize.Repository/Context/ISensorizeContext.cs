using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;

namespace Sensorize.Repository.Context
{
    public interface ISensorizeContext
    {
        DbSet<Device> Devices { get; }
        DbSet<DeviceType> DeviceTypes { get; }
        DbSet<DeviceMeasureProperty> DeviceMeasureProperties { get; }
        DbSet<DeviceState> DeviceStates { get; }
        DbSet<NotificationGroup> NotificationGroups { get; }

        Task ReloadAsync<T>(T entity);
		Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        int SaveChanges();
    }
}