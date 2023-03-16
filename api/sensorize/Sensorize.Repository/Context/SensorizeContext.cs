using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;

namespace Sensorize.Repository.Context
{
	public class SensorizeContext : DbContext, ISensorizeContext
	{
		public DbSet<Device> Devices => Set<Device>();
		public DbSet<DeviceType> DeviceTypes => Set<DeviceType>();
		public DbSet<DeviceMeasureProperty> DeviceMeasureProperties => Set<DeviceMeasureProperty>();
		public DbSet<DeviceState> DeviceStates => Set<DeviceState>();

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
