using Microsoft.AspNetCore.Mvc;

namespace Sensorize.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Ping()
        {
            return Ok(new
            {
                Result = "Pong",
                Timestamp = DateTime.Now
            });
        }
    }
}
