using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;
using Sensorize.Domain.Models;

namespace Sensorize.Repository
{
    public static class ModelConfiguration
    {
        public static void Apply(ModelBuilder builder)
        {
            builder.Entity<Sensor>(e =>
            {
                e.ToTable("sensors");
                e.HasKey(x => x.SensorId);
                e.Property(x => x.SensorId).UseMySQLAutoIncrementColumn("int");
                e.HasMany(x => x.MeasureProperties).WithOne(x => x.Sensor);
                e.HasOne(x => x.NotificationGroup).WithMany().HasForeignKey(x => x.NotificationGroupId);
            });

            builder.Entity<SensorType>(e =>
            {
                e.ToTable("sensor_types");
                e.HasKey(x => x.SensorTypeId);
                e.Property(x => x.SensorTypeId).UseMySQLAutoIncrementColumn("int");
            });

            builder.Entity<SensorMeasureProperty>(e =>
            {
                e.ToTable("sensor_measure_properties");
                e.HasKey(x => x.SensorMeasurePropertyId);
                e.Property(x => x.SensorMeasurePropertyId).UseMySQLAutoIncrementColumn("int");
                e.HasOne(x => x.Sensor).WithMany(x => x.MeasureProperties).HasForeignKey(x => x.SensorId);
            });

            builder.Entity<SensorState>(e =>
            {
                e.ToTable("sensor_states");
                e.HasKey(x => x.SensorStateId);
                e.Property(x => x.SensorStateId).UseMySQLAutoIncrementColumn("int");
                e.HasOne(x => x.Sensor).WithMany().HasForeignKey(x => x.SensorId);
            });

            builder.Entity<NotificationGroup>(e =>
            {
                e.ToTable("notification_groups");
                e.HasKey(x => x.NotificationGroupId);
                e.Property(x => x.NotificationGroupId).UseMySQLAutoIncrementColumn("int");
            });

            builder.Entity<NotificationRecipient>(e =>
            {
                e.ToTable("notification_recipients");
                e.HasKey(x => x.NotificationRecipientId);
                e.Property(x => x.NotificationRecipientId).UseMySQLAutoIncrementColumn("int");
                e.HasOne(x => x.Group).WithMany(x => x.Recipients).HasForeignKey(x => x.GroupId);
            });
        }
    }
}