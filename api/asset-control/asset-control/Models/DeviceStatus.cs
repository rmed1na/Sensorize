﻿namespace AssetControl.Api.Models
{
    public class DeviceStatus
    {
        public Guid DeviceId { get; set; }
        public bool IsOnAlert { get; set; }
        public double Measure { get; set; }
        public string? Description { get; set; }
        public string? IconClass { get; set; }
    }
}
