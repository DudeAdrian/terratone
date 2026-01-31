// Application configuration
const appConfig = {
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000', 10),
  },
  logger: {
    level: process.env.REACT_APP_LOG_LEVEL || 'debug',
  },
  features: {
    analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    debugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  },
  services: {
    energy: process.env.REACT_APP_ENERGY_API_ENDPOINT || '/api/energy',
    community: process.env.REACT_APP_COMMUNITY_API_ENDPOINT || '/api/community',
    food: process.env.REACT_APP_FOOD_API_ENDPOINT || '/api/food',
    water: process.env.REACT_APP_WATER_API_ENDPOINT || '/api/water',
    housing: process.env.REACT_APP_HOUSING_API_ENDPOINT || '/api/housing',
    sustainability: process.env.REACT_APP_SUSTAINABILITY_API_ENDPOINT || '/api/sustainability',
  },
};

export default appConfig;
