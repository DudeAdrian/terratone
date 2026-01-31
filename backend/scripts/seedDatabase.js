// backend/scripts/seedDatabase.js - Initialize Database with Seed Data
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Region = require('../models/Region');
const WaterMetric = require('../models/WaterMetric');
const EnergyMetric = require('../models/EnergyMetric');
const Crop = require('../models/Crop');
const ClimateMetric = require('../models/ClimateMetric');
const Trade = require('../models/Trade');
const AutomationRule = require('../models/AutomationRule');
const Alert = require('../models/Alert');
const Listing = require('../models/Listing');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sofie-systems';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Region.deleteMany({}),
      WaterMetric.deleteMany({}),
      EnergyMetric.deleteMany({}),
      Crop.deleteMany({}),
      ClimateMetric.deleteMany({}),
      Trade.deleteMany({}),
      AutomationRule.deleteMany({}),
      Alert.deleteMany({}),
      Listing.deleteMany({}),
    ]);
    
    // Create sample users
    console.log('👥 Creating sample users...');
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@sofie.com',
        password: 'hashed_password_here',
        role: 'admin',
        profile: { firstName: 'System', lastName: 'Admin' },
      },
      {
        username: 'farmer1',
        email: 'farmer1@example.com',
        password: 'hashed_password_here',
        role: 'member',
        profile: { firstName: 'John', lastName: 'Farmer' },
      },
      {
        username: 'farmer2',
        email: 'farmer2@example.com',
        password: 'hashed_password_here',
        role: 'member',
        profile: { firstName: 'Jane', lastName: 'Grower' },
      },
    ]);
    
    // Create sample region
    console.log('🌍 Creating sample region...');
    const region = await Region.create({
      name: 'Demo Region',
      description: 'Demo aquaponics system',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
      },
      adminId: users[0]._id,
      members: [users[0]._id, users[1]._id, users[2]._id],
      settings: {
        capacity: 5000,
        growingZones: ['main-tank', 'grow-beds-1', 'grow-beds-2'],
      },
    });
    
    // Create water metrics
    console.log('💧 Creating water metrics...');
    await WaterMetric.insertMany([
      {
        regionId: 'default',
        zoneId: 'main-tank',
        metrics: {
          totalCapacity: 5000,
          currentLevel: 3750,
          qualityScore: 92,
          phLevel: 7.2,
          temperature: 22.5,
          dissolvedOxygen: 8.5,
          turbidity: 2.1,
          ammonia: 0.02,
          nitrite: 0.01,
          nitrate: 15.5,
        },
        status: 'optimal',
      },
    ]);
    
    // Create energy metrics
    console.log('⚡ Creating energy metrics...');
    await EnergyMetric.insertMany([
      {
        regionId: 'default',
        production: {
          solar: 2850,
          wind: 850,
          hydro: 500,
          total: 4200,
        },
        consumption: {
          climate: 620,
          water: 410,
          lighting: 380,
          iot: 240,
          total: 1650,
        },
        storage: {
          capacity: 5000,
          currentLevel: 3900,
          chargeRate: 250,
          dischargeRate: 180,
          health: 95,
        },
        efficiency: 92,
        carbonOffset: 450,
        gridBalance: 1200,
      },
    ]);
    
    // Create crops
    console.log('🌱 Creating crops...');
    await Crop.insertMany([
      {
        regionId: 'default',
        name: 'Tomato',
        type: 'vegetable',
        stage: 'flowering',
        zone: 'grow-beds-1',
        quantity: 50,
        health: 95,
        daysToHarvest: 14,
        plantedAt: new Date(Date.now() - 30 * 86400000),
      },
      {
        regionId: 'default',
        name: 'Lettuce',
        type: 'lettuce',
        stage: 'ready',
        zone: 'grow-beds-2',
        quantity: 100,
        health: 92,
        daysToHarvest: 0,
        plantedAt: new Date(Date.now() - 45 * 86400000),
      },
      {
        regionId: 'default',
        name: 'Basil',
        type: 'herb',
        stage: 'vegetative',
        zone: 'grow-beds-1',
        quantity: 75,
        health: 89,
        daysToHarvest: 21,
        plantedAt: new Date(Date.now() - 20 * 86400000),
      },
    ]);
    
    // Create climate metrics
    console.log('🌤️  Creating climate metrics...');
    await ClimateMetric.insertMany([
      {
        regionId: 'default',
        zoneId: 'main-greenhouse',
        indoor: {
          temperature: 23.5,
          humidity: 68,
          co2: 420,
          airQuality: 95,
          lightIntensity: 450,
        },
        outdoor: {
          temperature: 18.3,
          humidity: 72,
          windSpeed: 12,
          precipitation: 0,
          uvIndex: 6,
        },
        targets: {
          temperature: 22,
          humidity: 65,
          co2: 400,
        },
        hvacStatus: 'active',
        status: 'optimal',
      },
    ]);
    
    // Create automation rules
    console.log('🤖 Creating automation rules...');
    await AutomationRule.insertMany([
      {
        regionId: 'default',
        name: 'Auto-Irrigation',
        trigger: 'soil_moisture < 30%',
        action: 'start_irrigation',
        status: 'active',
        priority: 8,
      },
      {
        regionId: 'default',
        name: 'Climate Control',
        trigger: 'temperature > 25°C',
        action: 'increase_ventilation',
        status: 'active',
        priority: 7,
      },
      {
        regionId: 'default',
        name: 'Energy Optimization',
        trigger: 'battery_level > 90%',
        action: 'export_to_grid',
        status: 'active',
        priority: 5,
      },
    ]);
    
    // Create alerts
    console.log('🔔 Creating alerts...');
    await Alert.insertMany([
      {
        regionId: 'default',
        userId: users[1]._id,
        type: 'warning',
        title: 'pH Level Approaching Threshold',
        message: 'Water pH is trending toward lower threshold',
        domain: 'water',
        severity: 'medium',
        isRead: false,
      },
      {
        regionId: 'default',
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled in 48 hours',
        domain: 'system',
        severity: 'low',
        isRead: true,
      },
    ]);
    
    // Create trades
    console.log('🛒 Creating trades...');
    await Trade.insertMany([
      {
        regionId: 'default',
        buyerId: users[1]._id,
        sellerId: users[2]._id,
        item: 'Tomatoes',
        quantity: 50,
        price: 3.5,
        category: 'produce',
        status: 'completed',
        completedAt: new Date(Date.now() - 7 * 86400000),
      },
      {
        regionId: 'default',
        buyerId: users[2]._id,
        sellerId: users[1]._id,
        item: 'Basil Seeds',
        quantity: 200,
        price: 0.25,
        category: 'seeds',
        status: 'pending',
      },
    ]);
    
    // Create listings
    console.log('📦 Creating marketplace listings...');
    await Listing.insertMany([
      {
        regionId: 'default',
        sellerId: users[1]._id,
        item: 'Fresh Tomatoes',
        quantity: 50,
        price: 3.5,
        category: 'produce',
        description: 'Organic aquaponic tomatoes, ready for harvest',
        status: 'active',
      },
      {
        regionId: 'default',
        sellerId: users[2]._id,
        item: 'Basil Seeds',
        quantity: 500,
        price: 0.5,
        category: 'seeds',
        description: 'High-quality basil seeds for aquaponics',
        status: 'active',
      },
    ]);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${1} region`);
    console.log(`   - 1 water metric`);
    console.log(`   - 1 energy metric`);
    console.log(`   - 3 crops`);
    console.log(`   - 1 climate metric`);
    console.log(`   - 3 automation rules`);
    console.log(`   - 2 alerts`);
    console.log(`   - 2 trades`);
    console.log(`   - 2 listings\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
