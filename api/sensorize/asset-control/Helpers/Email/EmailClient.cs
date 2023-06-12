using FluentEmail.Core;

namespace Sensorize.Api.Helpers.Email
{
    public class EmailClient : IEmailClient
    {
        private readonly IFluentEmail _email;

        public EmailClient(IFluentEmail email) => _email = email;

        public async Task<bool> SendAsync(EmailRequest request)
        {
            try
            {
                _email.Data.ToAddresses.Clear();
                
                var email = _email
                    .To(request.To)
                    .Subject(request.Subject)
                    .Body(request.BodyText);

                var response = await email.SendAsync();
                return response.Successful;
            }
            catch (Exception ex)
            {
                _ = ex;
                return false;
            }
        }
    }
}
