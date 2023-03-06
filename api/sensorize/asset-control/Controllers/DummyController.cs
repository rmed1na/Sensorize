using Microsoft.AspNetCore.Mvc;

namespace AssetControl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DummyController : ControllerBase
    {
        [HttpGet]
        [Route("message")]
        public async Task<string> SendMessageAsync()
        {
            var numbers = new[] { 1, 2, 3, 4, 5, 6, 7, 9, 10 };

            Response.ContentType = "text/event-stream";

            foreach (var num in numbers)
            {
                var data = $"data: {num} iteration\n\n";

                Thread.Sleep(3000);
                await HttpContext.Response.WriteAsync(data);
                await HttpContext.Response.Body.FlushAsync();
            }

            Response.Body.Close();

            return "Done";
        }
    }
}
