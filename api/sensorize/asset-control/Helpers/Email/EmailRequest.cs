namespace Sensorize.Api.Helpers.Email
{
    public class EmailRequest
    {
        public string? To { get; set; }
        public string? DisplayName { get; set; }
        public string? Subject { get; set; }
        public string? BodyText { get; set; }
    }
}
