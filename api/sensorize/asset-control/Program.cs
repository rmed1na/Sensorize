using AssetControl.Api.EventListeners;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MQTTnet;
using Sensorize.Api;
using Sensorize.Api.Models.AppSettings;
using Sensorize.Api.Services;
using Sensorize.Repository.Context;
using Serilog;
using Serilog.Events;
using System.Net;
using System.Net.Mail;
using System.Text.Json.Serialization;

const long LOG_SIZE_BYTES_LIMIT = 1024 * 1024 * 50; // 50MB

var directory = AppDomain.CurrentDomain.BaseDirectory;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
    .WriteTo.Console()
    .WriteTo.File(
        path: directory + "\\logs\\info.log",
        restrictedToMinimumLevel: LogEventLevel.Information,
        rollingInterval: RollingInterval.Day,
        fileSizeLimitBytes: LOG_SIZE_BYTES_LIMIT)
    .WriteTo.File(
        path: directory + "\\logs\\error.log",
        restrictedToMinimumLevel: LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        fileSizeLimitBytes: LOG_SIZE_BYTES_LIMIT)
    .CreateLogger();

try
{
    Log.Information("Starting api...");
    var builder = WebApplication.CreateBuilder(args);
    var appSettings = builder.Configuration
        .GetSection("Application")
        .Get<ApiSettings>();

    ArgumentNullException.ThrowIfNull(appSettings);
    var mqttFactory = new MqttFactory();

    #region Services
    // Add services to the container.
    Log.Information("Starting api services...");
    builder.Logging
        .ClearProviders()
        .AddSerilog();

    builder.Services.AddSignalR();
    builder.Services
        .AddControllers()
        .AddJsonOptions(opt =>
        {
            opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

            if (builder.Environment.IsDevelopment())
                opt.JsonSerializerOptions.WriteIndented = true;
        });
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

    builder.Services
        .AddEndpointsApiExplorer()
        .AddSwaggerGen()
        .AddMemoryCache()
        .AddSingleton(appSettings)
        .AddSingleton(mqttFactory)
        .AddSingleton(mqttFactory.CreateMqttClient())
        .AddDbContext<SensorizeContext>(options =>
        {
            options.UseMySQL(appSettings.DataSource.BuildMySqlConnectionString());
        }, ServiceLifetime.Transient);

    builder.Services
        .AddFluentEmail(appSettings.SystemEmail.Address, appSettings.SystemEmail.DisplayName)
        .AddSmtpSender(new SmtpClient
        {
            Host = appSettings.SystemEmail.Host ?? string.Empty,
            Port = appSettings.SystemEmail.Port,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Credentials = new NetworkCredential(appSettings.SystemEmail.Address, appSettings.SystemEmail.Password)
        });

    builder.Services
        .AddDependencyInjection()
        .AddHostedService<SensorStateNotificationService>();
    #endregion

    Log.Information("Setting up app...");
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    //if (app.Environment.IsDevelopment())
    //{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(x =>
    {
        if (appSettings.AllowedOrigins != null)
        {
            x.AllowAnyMethod().WithOrigins(appSettings.AllowedOrigins.Split(','));
        }
        else
            x.AllowAnyMethod();

        x.AllowAnyHeader();
        x.SetIsOriginAllowed(o => true);
        x.AllowCredentials();
    });
    //}

    await new SensorStatusListener(app.Services).ListenAsync();
    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Exception on api startup");
}
finally
{
    Log.CloseAndFlush();
}