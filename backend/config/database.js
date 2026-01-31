// backend/config/database.js - MongoDB Connection Configuration
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sofie-systems';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB Connected');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🔌 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    
    // Attempt to use mock data instead
    console.warn('⚠️  Falling back to mock data mode');
    process.env.USE_MOCK_DATA = 'true';
    
    return null;
  }
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB Disconnection Error:', error.message);
  }
}

/**
 * Check connection status
 */
function isConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  disconnectDB,
  isConnected,
  mongoose,
};
