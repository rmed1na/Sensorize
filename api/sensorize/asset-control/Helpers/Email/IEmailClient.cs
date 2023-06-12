namespace Sensorize.Api.Helpers.Email
{
    public interface IEmailClient
    {
        public Task<bool> SendAsync(EmailRequest request);
    }
}
