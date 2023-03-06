using Sensorize.Repository.Context;

namespace Sensorize.Api
{
    public static class DependencyInjection
    {
        public static void Configure(IServiceCollection services)
        {
            #region Scoped
            services.AddScoped<ISensorizeContext, SensorizeContext>();
            #endregion
        }
    }
}
