using AssetControl.Api.EventListeners;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Sensorize.Api;
using Sensorize.Api.Models.AppSettings;
using Sensorize.Api.Services;
using Sensorize.Repository.Context;
using System.Net;
using System.Net.Mail;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var appSettings = builder.Configuration
    .GetSection("Application")
    .Get<ApiSettings>();

#region Services
// Add services to the container.
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
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton(appSettings);

// Database
builder.Services.AddDbContext<SensorizeContext>(options =>
{
    options.UseMySQL(appSettings.DataSource.BuildMySqlConnectionString());
}, ServiceLifetime.Transient);

// Email
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

// DI
DependencyInjection.Configure(builder.Services);

// Custom services
builder.Services.AddHostedService<DeviceStateNotificationService>();
#endregion

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
        } else
            x.AllowAnyMethod();

        x.AllowAnyHeader();
        x.SetIsOriginAllowed(o => true);
        x.AllowCredentials();
    });
//}

await new DeviceStatusListener(app.Services).ListenAsync();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();