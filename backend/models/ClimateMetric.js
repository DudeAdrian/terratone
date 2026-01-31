// backend/models/ClimateMetric.js - Climate Control Model
const mongoose = require('mongoose');

const climateMetricSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    zoneId: String,
    indoor: {
      temperature: Number,
      humidity: Number,
      co2: Number,
      airQuality: Number,
      lightIntensity: Number,
    },
    outdoor: {
      temperature: Number,
      humidity: Number,
      windSpeed: Number,
      precipitation: Number,
      uvIndex: Number,
    },
    targets: {
      temperature: Number,
      humidity: Number,
      co2: Number,
    },
    hvacStatus: String,
    status: {
      type: String,
      enum: ['optimal', 'good', 'warning', 'critical'],
      default: 'optimal',
    },
  },
  { timestamps: true }
);

climateMetricSchema.index({ regionId: 1, zoneId: 1, createdAt: -1 });

module.exports = mongoose.model('ClimateMetric', climateMetricSchema);
