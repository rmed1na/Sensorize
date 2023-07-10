using Sensorize.Domain.Enums;
using Sensorize.Domain.Models;
using Sensorize.Domain.Models.Constants;

namespace Sensorize.Api.Controllers.Handlers
{
    public static class SensorStateHandler
    {
        public static SensorState ComputeMeasurement(Sensor sensor, double measurement)
        {
            var state = new SensorState
            {
                SensorId = sensor.SensorId
            };

            switch (sensor.MeasureTypeCode)
            {
                case MeasureTypeCode.Volume:
                    if (sensor.MeasureProperties != null && sensor.MeasureProperties.Any())
                    {
                        var maxCap = Convert.ToDouble(sensor.MeasureProperties.First(p => p.PropertyCode == MeasurePropertyCode.VolumeMaxCapacity).PropertyValue);
                        var maxVal = Convert.ToDouble(sensor.MeasureProperties.First(p => p.PropertyCode == MeasurePropertyCode.VolumeMaxValue).PropertyValue);
                        var minVal = Convert.ToDouble(sensor.MeasureProperties.First(p => p.PropertyCode == MeasurePropertyCode.VolumeMinValue).PropertyValue);
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

        public static SensorState ComputeMeasurement(Sensor sensor, bool value)
        {
            switch (sensor.MeasureTypeCode)
            {
                case MeasureTypeCode.Binary:
                    var state = new SensorState
                    {
                        SensorId = sensor.SensorId,
                        Measurement = value ? 1 : 0,
                        Description = value
                            ? sensor.MeasureProperties?.First(p => p.PropertyCode == MeasurePropertyCode.BinaryTrueLabel).PropertyValue
                            : sensor.MeasureProperties?.First(p => p.PropertyCode == MeasurePropertyCode.BinaryFalseLabel).PropertyValue
                    };

                    return state;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}