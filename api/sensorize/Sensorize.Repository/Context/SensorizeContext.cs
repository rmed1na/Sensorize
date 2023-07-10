using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;

namespace Sensorize.Repository.Context
{
	public class SensorizeContext : DbContext, ISensorizeContext
	{
		public DbSet<Sensor> Sensors => Set<Sensor>();
		public DbSet<SensorType> SensorTypes => Set<SensorType>();
		public DbSet<SensorMeasureProperty> SensorMeasureProperties => Set<SensorMeasureProperty>();
		public DbSet<SensorState> SensorStates => Set<SensorState>();
		public DbSet<NotificationGroup> NotificationGroups => Set<NotificationGroup>();
		public DbSet<NotificationRecipient> NotificationRecipients => Set<NotificationRecipient>();

		public SensorizeContext(DbContextOptions<SensorizeContext> options) : base(options) { }

		public async Task ReloadAsync<T>(T entity)
		{
			if (entity == null)
				throw new ArgumentNullException(nameof(entity));

			await Entry(entity).ReloadAsync();
		}

		public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
			=> await base.SaveChangesAsync(cancellationToken);

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			ModelConfiguration.Apply(modelBuilder);
		}
	}
}
