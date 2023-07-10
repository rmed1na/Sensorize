using Sensorize.Api.Helpers.Email;
using Sensorize.Repository.Context;
using Sensorize.Repository.Repository;

namespace Sensorize.Api
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDependencyInjection(this IServiceCollection services)
        {
            #region Scoped
            services.AddScoped<IEmailClient, EmailClient>();
            services.AddScoped<ISensorizeContext, SensorizeContext>();
            services.AddScoped<ISensorRepository, SensorRepository>();
            services.AddScoped<ISensorTypeRepository, SensorTypeRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            #endregion

            return services;
        }
    }
}
