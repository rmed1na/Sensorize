using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sensorize.Repository.Context
{
    public class SensorizeContext : DbContext, ISensorizeContext
    {
        public DbSet<DeviceType> DeviceTypes => Set<DeviceType>();

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
