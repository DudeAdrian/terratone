// backend/models/Crop.js - Food Production Model
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['vegetable', 'herb', 'fruit', 'microgreen', 'lettuce'],
      required: true,
    },
    stage: {
      type: String,
      enum: ['seedling', 'vegetative', 'flowering', 'fruiting', 'ready'],
      default: 'seedling',
    },
    zone: String,
    quantity: { type: Number, default: 1 },
    health: { type: Number, min: 0, max: 100, default: 100 },
    daysToHarvest: Number,
    nutrientRequirements: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      ph: Number,
    },
    plantedAt: {
      type: Date,
      default: Date.now,
    },
    expectedHarvest: Date,
    actualHarvest: Date,
    yield: Number,
    notes: String,
  },
  { timestamps: true }
);

cropSchema.index({ regionId: 1, stage: 1 });
cropSchema.index({ regionId: 1, expectedHarvest: 1 });

module.exports = mongoose.model('Crop', cropSchema);
