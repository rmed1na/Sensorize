using AssetControl.Api.EventListeners;
using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

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