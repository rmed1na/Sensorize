using Microsoft.AspNetCore.Mvc;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;

namespace Sensorize.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorTypeController : ControllerBase
    {
        private readonly ISensorTypeRepository _sensorTypeRepository;

        public SensorTypeController(ISensorTypeRepository sensorTypeRepository)
        {
            _sensorTypeRepository = sensorTypeRepository;
        }

        [HttpGet]
        [Route("all")]
        public async Task<ICollection<SensorType>> GetAllAsync()
            => await _sensorTypeRepository.GetAllAsync();

        [HttpPost]
        [Route("new")]
        public async Task<IActionResult> AddAsync(string name, MeasureTypeCode measureCode)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Name can't be null or empty");
            if (measureCode == MeasureTypeCode.Unknown)
                return BadRequest("Measure code can't be unknown (cero)");

            var type = new SensorType
            {
                Name = name,
                MeasureTypeCode = measureCode
            };

            await _sensorTypeRepository.AddAsync(type);
            return Ok(type);
        }
    }
}