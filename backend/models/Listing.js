// backend/models/Listing.js - Marketplace Listing Model
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    regionId: {
      type: String,
      required: true,
      index: true,
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
      required: true,
    },
    description: String,
    images: [String],
    status: {
      type: String,
      enum: ['active', 'sold', 'inactive'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

listingSchema.index({ regionId: 1, category: 1, status: 1 });
listingSchema.index({ sellerId: 1, status: 1 });

module.exports = mongoose.model('Listing', listingSchema);
