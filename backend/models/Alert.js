// backend/models/Alert.js - System Alert Model
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['error', 'warning', 'info', 'success'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      enum: ['water', 'energy', 'food', 'climate', 'community', 'system'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    isAcknowledged: {
      type: Boolean,
      default: false,
    },
    acknowledgedAt: Date,
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actionRequired: Boolean,
    actionUrl: String,
  },
  { timestamps: true }
);

alertSchema.index({ regionId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
