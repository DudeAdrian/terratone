// backend/models/User.js - User Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'viewer'],
      default: 'member',
    },
    regionId: {
      type: String,
      default: 'default',
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
    },
    settings: {
      theme: { type: String, default: 'dark' },
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
    },
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
