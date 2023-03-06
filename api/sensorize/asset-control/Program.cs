using AssetControl.Api.EventListeners;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Sensorize.Api;
using Sensorize.Api.Models.AppSettings;
using Sensorize.Repository.Context;

var builder = WebApplication.CreateBuilder(args);
var appSettings = builder.Configuration
    .GetSection("Application")
    .Get<ApiSettings>();

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

// Database
builder.Services.AddDbContext<SensorizeContext>(options =>
{
    options.UseMySQL(appSettings.DataSource.BuildMySqlConnectionString());
}, ServiceLifetime.Transient);

DependencyInjection.Configure(builder.Services);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(x =>
    {
        x.AllowAnyMethod();
        x.AllowAnyHeader();
        x.SetIsOriginAllowed(o => true);
        x.AllowCredentials();
    });
}

await new DeviceStatusListener(app.Services).ListenAsync();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();