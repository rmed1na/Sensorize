using Microsoft.OpenApi.Extensions;
using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Constants;

namespace Sensorize.Api.Controllers.Handlers
{
    public static class DeviceStateHandler
    {
        public static DeviceState ComputeMeasurement(Device device, double measurement)
        {
            var state = new DeviceState
            {
                DeviceId = device.DeviceId
            };

            switch (device.MeasureTypeCode)
            {
                case MeasureTypeCode.Volume:
                    if (device.MeasureProperties != null && device.MeasureProperties.Any())
                    {
                        var maxCap = Convert.ToDouble(device.MeasureProperties.First(p => p.PropertyCode == MeasurePropertyCode.VolumeMaxCapacity).PropertyValue);
                        var maxVal = Convert.ToDouble(device.MeasureProperties.First(p => p.PropertyCode == MeasurePropertyCode.VolumeMaxValue).PropertyValue);
                        var minVal = Convert.ToDouble(device.MeasureProperties.First(p => p.PropertyCode == MeasurePropertyCode.VolumeMinValue).PropertyValue);
                        var ratio = measurement / maxVal;
                        var currentCap = maxCap * ratio;

                        state.Description = $"{ratio * 100}% ({currentCap}L/{maxCap}L)";
                        state.Measurement = currentCap;
                    }
                    break;
                default:
                    throw new NotImplementedException();
            }

            return state;
        }

        public static DeviceState ComputeMeasurement(Device device, bool value)
        {
            switch (device.MeasureTypeCode)
            {
                case MeasureTypeCode.Binary:
                    var state = new DeviceState
                    {
                        DeviceId = device.DeviceId,
                        Measurement = value ? 1 : 0,
                        Description = value 
                            ? device.MeasureProperties?.First(p => p.PropertyCode == MeasurePropertyCode.BinaryTrueLabel).PropertyValue
                            : device.MeasureProperties?.First(p => p.PropertyCode == MeasurePropertyCode.BinaryFalseLabel).PropertyValue
                    };

                    return state;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}