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
            });

            builder.Entity<DeviceType>(e =>
            {
                e.ToTable("device_types");
                e.HasKey(x => x.DeviceTypeId);
                e.Property(x => x.DeviceTypeId).UseMySQLAutoIncrementColumn("int");
            });
        }
    }
}