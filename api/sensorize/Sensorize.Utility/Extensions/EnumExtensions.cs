using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Sensorize.Utility.Extensions
{
    public static class EnumExtensions
    {
        /// <summary>
        /// Gives the name attribute of an enum value
        /// </summary>
        /// <param name="value">Enum value</param>
        /// <returns></returns>
        public static string GetDisplayName(this Enum value)
        {
            var original = value.ToString();
            var type = value.GetType();
            if (type == null)
                return original;

            var member = type.GetMember(value.ToString()).FirstOrDefault();
            if (member == null)
                return original;

            var attribute = member.GetCustomAttribute<DisplayAttribute>();
            if (attribute == null)
                return original;

            return attribute.GetName() ?? original;
        }
    }
}
