using Sensorize.Api.Helpers.Email;
using Sensorize.Api.Models.Dto;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;

namespace Sensorize.Api.Services
{
    public class DeviceStateNotificationService : BackgroundService
    {
        private const int MAX_MINUTES_WAIT_TO_ALERT = 5;
        private const int MINUTES_CYCLE_INTERVAL = 1;
        private readonly ILogger _logger;
        private readonly IServiceProvider _serviceProvider;
        private IDeviceRepository? _deviceRepository;
        private IEmailClient? _emailClient;

        public DeviceStateNotificationService(IServiceProvider serviceProvider, ILogger<DeviceStateNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //TODO: There seems to be a memory leak around here. Fix later
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    await Task
                        .Delay(TimeSpan.FromSeconds(MINUTES_CYCLE_INTERVAL), stoppingToken)
                        .ConfigureAwait(false);

                    using var scope = _serviceProvider.CreateScope();
                    _deviceRepository = scope.ServiceProvider.GetRequiredService<IDeviceRepository>();
                    _emailClient = scope.ServiceProvider.GetRequiredService<IEmailClient>();

                    var states = await _deviceRepository
                        .GetStatesAsync()
                        .ConfigureAwait(false);

                    foreach (var state in states)
                        await HandleNotificationsAsync(state);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error on {nameof(DeviceStateNotificationService)}.{nameof(this.ExecuteAsync)}");
                throw;
            }
        }

        private async Task HandleNotificationsAsync(DeviceState state)
        {
            var dto = new DeviceStateDto(state);

            await HandleAlertNotificationAsync(dto, state);
            await HandleStateNotificationAsync(state);
        }

        private async Task HandleAlertNotificationAsync(DeviceStateDto dto, DeviceState state)
        {
            ArgumentNullException.ThrowIfNull(_deviceRepository);
            ArgumentNullException.ThrowIfNull(_emailClient);

            if (dto.IsOnAlert && !state.AlertStateBegin.HasValue)
            {
                state.AlertStateBegin = DateTime.Now;
                state.AlertStateEnd = null;
                await _deviceRepository.SaveAsync(state, false);
            }
            else if (!dto.IsOnAlert && state.AlertStateBegin.HasValue)
            {
                state.AlertStateBegin = null;
                state.IsNotified = false;
                await _deviceRepository.SaveAsync(state, false);
            }
            else if (dto.IsOnAlert && state.AlertStateBegin.HasValue)
            {
                var timeSpan = DateTime.Now - state.AlertStateBegin.Value;
                if (timeSpan.Minutes < MAX_MINUTES_WAIT_TO_ALERT)
                    return;

                if (!state.IsNotified)
                {
                    var deviceName = state.Device?.Name;
                    var recipients = state.Device?.NotificationGroup?.Recipients?.Where(r => r.StatusCode == GlobalStatusCode.Active);
                    foreach (var recipient in recipients ?? Enumerable.Empty<NotificationRecipient>())
                    {
                        await _emailClient
                            .SendAsync(new EmailRequest
                            {
                                To = recipient?.Email,
                                Subject = $"Alerta de dispositivo {deviceName}",
                                BodyText =
                                    $"El dispositivo {deviceName} ha estado en un estado de alerta por más de 5 minutos.\n\n" +
                                    $"Detalles:\n" +
                                    $"Dispositivo: {deviceName}\n" +
                                    $"Medida: {state.Description}\n" +
                                    $"Desde: {state.AlertStateBegin}\n" +
                                    $"Última actualización hace: {dto.TimeSpanDescription}\n"
                            }).ConfigureAwait(false);
                    }

                    state.AlertStateEnd = DateTime.Now;
                    state.IsNotified = true;
                    await _deviceRepository.SaveAsync(state, false);
                }
            }
        }

        private async Task HandleStateNotificationAsync(DeviceState state)
        {
            ArgumentNullException.ThrowIfNull(state.Device);
            ArgumentNullException.ThrowIfNull(_emailClient);
            ArgumentNullException.ThrowIfNull(_deviceRepository);

            if (!state.Device.StateNotificationFrequency.HasValue)
                return;

            var lastTime = state.LastStateNotification ?? DateTime.Now.AddMinutes(state.Device.StateNotificationFrequency.Value * -1);
            var nextTime = lastTime.AddMinutes(state.Device.StateNotificationFrequency.Value);

            if (nextTime < DateTime.Now)
            {
                var recipients = state.Device.NotificationGroup?.Recipients?.Where(r => r.StatusCode == GlobalStatusCode.Active);

                foreach (var recipient in recipients ?? Enumerable.Empty<NotificationRecipient>())
                {
                    await _emailClient.SendAsync(new EmailRequest
                    {
                        To = recipient?.Email,
                        Subject = $"Estado del dispositivo {state.Device.Name}",
                        BodyText = $"Notificación del estado del dispositivo {state.Device.Name}.\n\n" +
                                   $"Detalles:\n" + 
                                   $"Dispositivo: {state.Device.Name}\n" + 
                                   $"Estado: {state.Description}\n" + 
                                   $"Última actualización: {state.UpdatedDate}"
                    }).ConfigureAwait(false);
                }

                state.LastStateNotification = DateTime.Now;
                await _deviceRepository.SaveAsync(state);
            }
        }
    }
}
