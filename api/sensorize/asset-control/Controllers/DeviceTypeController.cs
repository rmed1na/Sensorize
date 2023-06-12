using Microsoft.AspNetCore.Mvc;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;

namespace Sensorize.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly IDeviceTypeRepository _deviceTypeRepository;

        public DeviceTypeController(IDeviceTypeRepository deviceTypeRepository)
        {
            _deviceTypeRepository = deviceTypeRepository;
        }

        [HttpGet]
        [Route("all")]
        public async Task<ICollection<DeviceType>> GetAllAsync()
            => await _deviceTypeRepository.GetAllAsync();

        [HttpPost]
        [Route("new")]
        public async Task<IActionResult> AddAsync(string name, MeasureTypeCode measureCode)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Name can't be null or empty");
            if (measureCode == MeasureTypeCode.Unknown)
                return BadRequest("Measure code can't be unknown (cero)");

            var deviceType = new DeviceType
            {
                Name = name,
                MeasureTypeCode = measureCode
            };

            await _deviceTypeRepository.AddAsync(deviceType);
            return Ok(deviceType);
        }
    }
}