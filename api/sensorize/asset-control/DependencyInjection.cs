using Sensorize.Repository.Context;
using Sensorize.Repository.Repository;

namespace Sensorize.Api
{
    public static class DependencyInjection
    {
        public static void Configure(IServiceCollection services)
        {
            #region Scoped
            services.AddScoped<ISensorizeContext, SensorizeContext>();
            services.AddScoped<IDeviceRepository, DeviceRepository>();
            services.AddScoped<IDeviceTypeRepository, DeviceTypeRepository>();
            #endregion
        }
    }
}
