using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;

namespace Sensorize.Repository.Context
{
    public class SensorizeContext : DbContext, ISensorizeContext
    {
        public DbSet<Device> Devices => Set<Device>();
        public DbSet<DeviceType> DeviceTypes => Set<DeviceType>();
        public DbSet<DeviceMeasureProperty> DeviceMeasureProperties => Set<DeviceMeasureProperty>();

        public SensorizeContext(DbContextOptions<SensorizeContext> options) : base(options) { }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            => await base.SaveChangesAsync(cancellationToken);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            ModelConfiguration.Apply(modelBuilder);
        }
    }
}
