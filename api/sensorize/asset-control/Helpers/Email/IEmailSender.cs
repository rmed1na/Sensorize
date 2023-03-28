namespace Sensorize.Api.Helpers.Email
{
    public interface IEmailSender
    {
        public Task<bool> SendAsync(EmailRequest request);
    }
}
