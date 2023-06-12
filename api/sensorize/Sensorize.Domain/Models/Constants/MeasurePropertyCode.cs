namespace Sensorize.Domain.Models.Constants
{
	public static class MeasurePropertyCode
	{
        #region Volume
        public static string VolumeMaxCapacity => "VOL.MAXCAP";
		public static string VolumeMinValue => "VOL.MINVALUE";
		public static string VolumeMaxValue => "VOL.MAXVALUE";
        #endregion

        #region Binary
        public static string BinaryTrueLabel => "BIN.TRUEVALUE";
        public static string BinaryFalseLabel => "BIN.FALSEVALUE";
        #endregion
    }
}