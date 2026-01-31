// backend/models/Region.js - Region Model
const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    location: {
      latitude: Number,
      longitude: Number,
      timezone: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    settings: {
      capacity: Number,
      growingZones: [String],
      primaryCrops: [String],
    },
    statistics: {
      totalProduction: { type: Number, default: 0 },
      totalMembers: { type: Number, default: 0 },
      carbonOffset: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Region', regionSchema);
