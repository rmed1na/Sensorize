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
        private readonly IServiceProvider _serviceProvider;
        private IDeviceRepository? _deviceRepository;
        private IEmailSender? _emailSender;

        public DeviceStateNotificationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
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
                    _emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();

                    var states = await _deviceRepository
                        .GetStatesAsync()
                        .ConfigureAwait(false);

                    foreach (var state in states)
                        await HandleStateNotificationAsync(state);
                }
            }
            catch (Exception ex)
            {
                _ = ex;
                throw;
            }
        }

        private async Task HandleStateNotificationAsync(DeviceState state)
        {
            ArgumentNullException.ThrowIfNull(_deviceRepository);
            ArgumentNullException.ThrowIfNull(_emailSender);

            var dto = new DeviceStateDto(state);
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
                        await _emailSender
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
                            });
                    }

                    state.AlertStateEnd = DateTime.Now;
                    state.IsNotified = true;
                    await _deviceRepository.SaveAsync(state, false);
                }
            }
        }
    }
}
