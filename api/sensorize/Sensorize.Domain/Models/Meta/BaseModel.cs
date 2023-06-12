namespace Sensorize.Domain.Models.Meta
{
    public class BaseModel
    {
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public BaseModel()
        {
            CreatedDate = DateTime.Now;
        }

        public void SetUpdated() => UpdatedDate = DateTime.Now;
    }
}