using Microsoft.AspNetCore.Mvc;
using Sensorize.Api.Models.Dto;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Repository.Repository;

namespace Sensorize.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepo;

        public NotificationController(INotificationRepository notificationRepo)
        {
            _notificationRepo = notificationRepo;
        }

        [HttpPost]
        [Route("group")]
        public async Task<IActionResult> AddGroupAsync([FromBody] string name)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                return BadRequest("Group name must have a value");

            var existing = await _notificationRepo.GetGroupAsync(name);
            if (existing != null)
                return Conflict($"Group with name {name} already exists");

            var group = new NotificationGroup
            {
                Name = name
            };
            await _notificationRepo.AddGroupAsync(group);

            return Ok(new NotificationGroupDto(group));
        }

        [HttpGet]
        [Route("group")]
        public async Task<IActionResult> GetGroupsAsync()
        {
            var groups = await _notificationRepo.GetGroupsAsync();
            return Ok(groups
                .Select(g => new NotificationGroupDto(g))
                .OrderByDescending(g => g.IsActive)
                .ThenBy(g => g.CreatedDate)
                .ToList());
        }

        [HttpPut]
        [Route("group/{groupId:int}")]
        public async Task<IActionResult> UpdateGroupAsync(int groupId, [FromBody] string name)
        {
            if (string.IsNullOrEmpty(name))
                return BadRequest("Name must have a value");

            var group = await _notificationRepo.GetGroupAsync(groupId);
            if (group == null)
                return NotFound("Notification group not found");

            group.Name = name;
            await _notificationRepo.SaveAsync(group);
            return Ok(group);
        }

        [HttpDelete]
        [Route("group/{groupId:int}")]
        public async Task<IActionResult> DeleteGroupAsync(int groupId)
        {
            var group = await _notificationRepo.GetGroupAsync(groupId);
            if (group == null)
                return NotFound("Notification group not found");

            group.StatusCode = GlobalStatusCode.Inactive;
            await _notificationRepo.SaveAsync(group);
            return Ok(group);
        }
    }
}
