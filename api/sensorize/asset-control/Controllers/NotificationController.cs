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

        #region Group
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
        #endregion

        #region Recipient
        [HttpPost]
        [Route("recipient")]
        public async Task<IActionResult> AddRecipientAsync(NotificationRecipientDto request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email must be provided");

            var group = await _notificationRepo.GetGroupAsync(request.GroupId);
            if (group == null)
                return NotFound("Invalid group");

            var recipient = new NotificationRecipient
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                GroupId = group.NotificationGroupId,
                StatusCode = GlobalStatusCode.Active
            };

            await _notificationRepo.AddRecipientAsync(recipient);
            return Ok(new NotificationRecipientDto(recipient));
        }

        [HttpGet]
        [Route("recipient")]
        public async Task<IActionResult> GetRecipientsAsync()
        {
            var recipients = await _notificationRepo.GetRecipientsAsync();
            return Ok(recipients
                .Select(r => new NotificationRecipientDto(r))
                .OrderByDescending(r => r.IsActive)
                .ThenBy(r => r.CreatedDate)
                .ToList());
        }

        [HttpPut]
        [Route("recipient/{recipientId:int}")]
        public async Task<IActionResult> UpdateRecipientAsync(int recipientId, NotificationRecipientDto request)
        {
            var recipient = await _notificationRepo.GetRecipientAsync(recipientId);
            if (recipient == null)
                return NotFound("Recipient not found");

            var group = await _notificationRepo.GetGroupAsync(request.GroupId);
            if (group == null)
                return NotFound("Group not found");

            recipient.FirstName = request.FirstName;
            recipient.LastName = request.LastName;
            recipient.Email = request.Email;
            recipient.GroupId = request.GroupId;

            await _notificationRepo.SaveAsync(recipient);

            return Ok(recipient);
        }

        [HttpDelete]
        [Route("recipient/{recipientId:int}")]
        public async Task<IActionResult> DeleteRecipientAsync(int recipientId)
        {
            var recipient = await _notificationRepo.GetRecipientAsync(recipientId);
            if (recipient == null)
                return NotFound("Recipient not found");

            recipient.StatusCode = GlobalStatusCode.Inactive;
            await _notificationRepo.SaveAsync(recipient);
            return Ok(recipient);
        }
        #endregion
    }
}
