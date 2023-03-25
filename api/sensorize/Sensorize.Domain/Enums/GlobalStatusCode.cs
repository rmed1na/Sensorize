using System.ComponentModel.DataAnnotations;

namespace Sensorize.Domain.Enums
{
    public enum GlobalStatusCode
    {
        Unknown,

        [Display(Name = "Activo")]
        Active,

        [Display(Name = "Inactivo")]
        Inactive
    }
}