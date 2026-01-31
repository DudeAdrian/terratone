// backend/models/IoTDevice.js - IoT Device Registry
const mongoose = require('mongoose');

const iotDeviceSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    type: {
      type: String,
      enum: ['temperature', 'humidity', 'ph', 'water_level', 'light', 'co2', 'camera', 'other'],
      required: true,
    },
    location: String,
    status: {
      type: String,
      enum: ['online', 'offline', 'error'],
      default: 'online',
    },
    battery: Number,
    lastUpdate: Date,
    lastMaintenance: Date,
    specifications: mongoose.Schema.Types.Mixed,
    readings: [
      {
        value: Number,
        unit: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

iotDeviceSchema.index({ regionId: 1, type: 1 });

module.exports = mongoose.model('IoTDevice', iotDeviceSchema);
