using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using Sensorize.Domain.Models;

namespace Sensorize.Repository
{
    public static class ModelConfiguration
    {
        public static void Apply(ModelBuilder builder)
        {
            builder.Entity<Device>(e =>
            {
                e.ToTable("devices");
                e.HasKey(x => x.DeviceId);
                e.Property(x => x.DeviceId).UseMySQLAutoIncrementColumn("int");
                e.HasMany(x => x.MeasureProperties).WithOne(x => x.Device);
            });

            builder.Entity<DeviceType>(e =>
            {
                e.ToTable("device_types");
                e.HasKey(x => x.DeviceTypeId);
                e.Property(x => x.DeviceTypeId).UseMySQLAutoIncrementColumn("int");
            });

            builder.Entity<DeviceMeasureProperty>(e =>
            {
                e.ToTable("device_measure_properties");
                e.HasKey(x => x.DeviceMeasurePropertyId);
                e.Property(x => x.DeviceMeasurePropertyId).UseMySQLAutoIncrementColumn("int");
                e.HasOne(x => x.Device).WithMany(x => x.MeasureProperties).HasForeignKey(x => x.DeviceId);
            });
        }
    }
}