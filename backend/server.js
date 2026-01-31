// backend/server.js - SOFIE Systems Backend Server
// API-first architecture matching frontend hooks and services

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB, isConnected } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// ===== ROUTES =====

// Import route modules
const waterRoutes = require('./routes/water');
const energyRoutes = require('./routes/energy');
const foodRoutes = require('./routes/food');
const climateRoutes = require('./routes/climate');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin');
const systemRoutes = require('./routes/system');
const wellnessRoutes = require('./routes/wellness');
const automationRoutes = require('./routes/automation');
const herbalRoutes = require('./routes/herbal');
const marketplaceRoutes = require('./routes/marketplace');

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: isConnected() ? 'connected' : 'disconnected',
  });
});

// Mount API routes
app.use('/api/water', waterRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/herbal', herbalRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Integration route for forwarding events
const integrationRoutes = require('./routes/integration');
app.use('/api/integration', integrationRoutes);

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
});

// ===== SERVER STARTUP =====

app.listen(PORT, async () => {
  console.log(`\n🚀 SOFIE Systems Backend Server`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Connect to database
  await connectDB();
  
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
