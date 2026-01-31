// backend/models/EnergyMetric.js - Energy Domain Model
const mongoose = require('mongoose');

const energyMetricSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    production: {
      solar: { type: Number, default: 0 },
      wind: { type: Number, default: 0 },
      hydro: { type: Number, default: 0 },
      geothermal: {
        capacityKW: { type: Number, default: 0 },
        outputKW: { type: Number, default: 0 },
        status: { type: String, default: 'inactive' },
        temperatureC: { type: Number, default: 0 },
        lastService: { type: Date },
      },
      total: { type: Number, default: 0 },
    },
    consumption: {
      climate: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      lighting: { type: Number, default: 0 },
      iot: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    storage: {
      capacity: Number,
      currentLevel: Number,
      chargeRate: Number,
      dischargeRate: Number,
      health: Number,
    },
    efficiency: Number,
    carbonOffset: Number,
    gridBalance: Number,
  },
  { timestamps: true }
);

energyMetricSchema.index({ regionId: 1, createdAt: -1 });

module.exports = mongoose.model('EnergyMetric', energyMetricSchema);
