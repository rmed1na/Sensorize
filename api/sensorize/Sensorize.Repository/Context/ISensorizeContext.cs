using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;

namespace Sensorize.Repository.Context
{
    public interface ISensorizeContext
    {
        DbSet<Sensor> Sensors { get; }
        DbSet<SensorType> SensorTypes { get; }
        DbSet<SensorMeasureProperty> SensorMeasureProperties { get; }
        DbSet<SensorState> SensorStates { get; }
        DbSet<NotificationGroup> NotificationGroups { get; }
        DbSet<NotificationRecipient> NotificationRecipients { get; }

        Task ReloadAsync<T>(T entity);
		Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        int SaveChanges();
    }
}