// backend/models/Trade.js - Community Trade Model
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['produce', 'seeds', 'equipment', 'knowledge'],
      default: 'produce',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'cancelled'],
      default: 'pending',
    },
    completedAt: Date,
  },
  { timestamps: true }
);

tradeSchema.index({ regionId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Trade', tradeSchema);
