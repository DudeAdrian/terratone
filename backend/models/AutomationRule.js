// backend/models/AutomationRule.js - Automation Rules Model
const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema(
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
    description: String,
    trigger: {
      type: String,
      required: true,
    },
    conditions: mongoose.Schema.Types.Mixed,
    action: {
      type: String,
      required: true,
    },
    actionParams: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['active', 'inactive', 'error'],
      default: 'active',
    },
    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    lastTriggered: Date,
    executionCount: {
      type: Number,
      default: 0,
    },
    lastError: String,
  },
  { timestamps: true }
);

automationRuleSchema.index({ regionId: 1, status: 1 });

module.exports = mongoose.model('AutomationRule', automationRuleSchema);
