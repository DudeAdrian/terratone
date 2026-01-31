// backend/models/WaterMetric.js - Water Domain Model
const mongoose = require('mongoose');

const waterMetricSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    zoneId: String,
    metrics: {
      totalCapacity: Number,
      currentLevel: Number,
      qualityScore: Number,
      phLevel: { type: Number, min: 0, max: 14 },
      temperature: Number,
      dissolvedOxygen: Number,
      turbidity: Number,
      ammonia: Number,
      nitrite: Number,
      nitrate: Number,
    },
    status: {
      type: String,
      enum: ['optimal', 'warning', 'critical'],
      default: 'optimal',
    },
    alerts: [
      {
        type: String,
        timestamp: Date,
        severity: String,
      },
    ],
  },
  { timestamps: true }
);

// Create index for time-series queries
waterMetricSchema.index({ regionId: 1, createdAt: -1 });

module.exports = mongoose.model('WaterMetric', waterMetricSchema);
