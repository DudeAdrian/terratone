// backend/utils/dbHelper.js - Database Helper Functions
const { isConnected } = require('../config/database');

/**
 * Check if using mock data
 */
function useMockData() {
  return !isConnected() || process.env.USE_MOCK_DATA === 'true';
}

/**
 * Safely handle database operations with fallback to mock
 */
async function dbOperation(dbQuery, mockData, options = {}) {
  if (useMockData()) {
    // Simulate async delay for mock data
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockData;
  }

  try {
    const result = await dbQuery();
    return result;
  } catch (error) {
    console.error('Database error, falling back to mock data:', error.message);
    return mockData;
  }
}

/**
 * Safely save to database
 */
async function dbSave(model, data) {
  if (useMockData()) {
    // Return data with mock ID
    return { ...data, _id: Math.random().toString(36).substr(2, 9) };
  }

  try {
    const doc = new model(data);
    return await doc.save();
  } catch (error) {
    console.error('Database save error:', error.message);
    return { ...data, _id: Math.random().toString(36).substr(2, 9) };
  }
}

/**
 * Safely find from database
 */
async function dbFindOne(model, query, mockData) {
  if (useMockData()) {
    await new Promise(resolve => setTimeout(resolve, 30));
    return mockData;
  }

  try {
    return await model.findOne(query).lean();
  } catch (error) {
    console.error('Database find error:', error.message);
    return mockData;
  }
}

/**
 * Safely find many from database
 */
async function dbFind(model, query, mockData) {
  if (useMockData()) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return Array.isArray(mockData) ? mockData : [mockData];
  }

  try {
    return await model.find(query).lean();
  } catch (error) {
    console.error('Database find error:', error.message);
    return Array.isArray(mockData) ? mockData : [mockData];
  }
}

/**
 * Safely update database
 */
async function dbUpdate(model, query, update, mockData) {
  if (useMockData()) {
    await new Promise(resolve => setTimeout(resolve, 30));
    return { ...mockData, ...update };
  }

  try {
    return await model.findOneAndUpdate(query, update, { new: true }).lean();
  } catch (error) {
    console.error('Database update error:', error.message);
    return { ...mockData, ...update };
  }
}

module.exports = {
  useMockData,
  dbOperation,
  dbSave,
  dbFindOne,
  dbFind,
  dbUpdate,
};
