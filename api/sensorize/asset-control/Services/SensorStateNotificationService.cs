using Sensorize.Api.Helpers.Email;
using Sensorize.Api.Models.Dto;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;

namespace Sensorize.Api.Services
{
    public class SensorStateNotificationService : BackgroundService
    {
        private const int MAX_MINUTES_WAIT_TO_ALERT = 5;
        private const int MINUTES_CYCLE_INTERVAL = 1;
        private readonly ILogger _logger;
        private readonly IServiceProvider _serviceProvider;
        private ISensorRepository? _sensorRepository;
        private IEmailClient? _emailClient;

        public SensorStateNotificationService(IServiceProvider serviceProvider, ILogger<SensorStateNotificationService> logger)
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
                    _sensorRepository = scope.ServiceProvider.GetRequiredService<ISensorRepository>();
                    _emailClient = scope.ServiceProvider.GetRequiredService<IEmailClient>();

                    var states = await _sensorRepository
                        .GetStatesAsync()
                        .ConfigureAwait(false);

                    foreach (var state in states)
                        await HandleNotificationsAsync(state);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error on {nameof(SensorStateNotificationService)}.{nameof(this.ExecuteAsync)}");
                throw;
            }
        }

        private async Task HandleNotificationsAsync(SensorState state)
        {
            var dto = new SensorStateDto(state);

            await HandleAlertNotificationAsync(dto, state);
            await HandleStateNotificationAsync(state);
        }

        private async Task HandleAlertNotificationAsync(SensorStateDto dto, SensorState state)
        {
            ArgumentNullException.ThrowIfNull(_sensorRepository);
            ArgumentNullException.ThrowIfNull(_emailClient);

            if (dto.IsOnAlert && !state.AlertStateBegin.HasValue)
            {
                state.AlertStateBegin = DateTime.Now;
                state.AlertStateEnd = null;
                await _sensorRepository.SaveAsync(state, false);
            }
            else if (!dto.IsOnAlert && state.AlertStateBegin.HasValue)
            {
                state.AlertStateBegin = null;
                state.IsNotified = false;
                await _sensorRepository.SaveAsync(state, false);
            }
            else if (dto.IsOnAlert && state.AlertStateBegin.HasValue)
            {
                var timeSpan = DateTime.Now - state.AlertStateBegin.Value;
                if (timeSpan.Minutes < MAX_MINUTES_WAIT_TO_ALERT)
                    return;

                if (!state.IsNotified)
                {
                    var name = state.Sensor?.Name;
                    var recipients = state.Sensor?.NotificationGroup?.Recipients?.Where(r => r.StatusCode == GlobalStatusCode.Active);
                    foreach (var recipient in recipients ?? Enumerable.Empty<NotificationRecipient>())
                    {
                        await _emailClient
                            .SendAsync(new EmailRequest
                            {
                                To = recipient?.Email,
                                Subject = $"Alerta de dispositivo {name}",
                                BodyText =
                                    $"El dispositivo {name} ha estado en un estado de alerta por más de 5 minutos.\n\n" +
                                    $"Detalles:\n" +
                                    $"Dispositivo: {name}\n" +
                                    $"Medida: {state.Description}\n" +
                                    $"Desde: {state.AlertStateBegin}\n" +
                                    $"Última actualización hace: {dto.TimeSpanDescription}\n"
                            }).ConfigureAwait(false);
                    }

                    state.AlertStateEnd = DateTime.Now;
                    state.IsNotified = true;
                    await _sensorRepository.SaveAsync(state, false);
                }
            }
        }

        private async Task HandleStateNotificationAsync(SensorState state)
        {
            ArgumentNullException.ThrowIfNull(state.Sensor);
            ArgumentNullException.ThrowIfNull(_emailClient);
            ArgumentNullException.ThrowIfNull(_sensorRepository);

            if (!state.Sensor.StateNotificationFrequency.HasValue)
            {
                if (state.NextStateNotification.HasValue)
                {
                    state.NextStateNotification = null;
                    await _sensorRepository.SaveAsync(state);
                }

                return;
            }

            var nextTime = state.NextStateNotification ?? DateTime.Now.AddSeconds(-1);
            if (nextTime <= DateTime.Now)
            {
                var recipients = state.Sensor.NotificationGroup?.Recipients?.Where(r => r.StatusCode == GlobalStatusCode.Active);

                foreach (var recipient in recipients ?? Enumerable.Empty<NotificationRecipient>())
                {
                    await _emailClient.SendAsync(new EmailRequest
                    {
                        To = recipient?.Email,
                        Subject = $"Estado del dispositivo {state.Sensor.Name}",
                        BodyText = $"Notificación del estado del dispositivo {state.Sensor.Name}.\n\n" +
                                   $"Detalles:\n" + 
                                   $"Dispositivo: {state.Sensor.Name}\n" + 
                                   $"Estado: {state.Description}\n" + 
                                   $"Última actualización: {state.UpdatedDate}"
                    }).ConfigureAwait(false);
                }

                state.LastStateNotification = DateTime.Now;
                state.NextStateNotification = DateTime.Now.AddMinutes(state.Sensor.StateNotificationFrequency.Value);
                await _sensorRepository.SaveAsync(state, false);
            }
        }
    }
}
