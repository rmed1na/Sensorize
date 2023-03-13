using System.ComponentModel.DataAnnotations;

namespace Sensorize.Domain.Enums
{
    public enum MeasureTypeCode
    {
        Unknown = 0,

        [Display(Name = "Volumen")]
        Volume,

        [Display(Name = "Temperatura")]
        Temperature
    }
}
