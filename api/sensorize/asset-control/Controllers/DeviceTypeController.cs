using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sensorize.Domain.Models;
using Sensorize.Repository.Context;

namespace Sensorize.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly ISensorizeContext _context;

        public DeviceTypeController(ISensorizeContext context) => _context = context;

        [HttpGet]
        [Route("all")]
        public async Task<ICollection<DeviceType>> GetAllAsync()
        {
            var result = await _context.DeviceTypes.ToListAsync();
            return result;
        }
    }
}