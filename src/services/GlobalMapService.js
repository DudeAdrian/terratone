// src/services/GlobalMapService.js
// Hierarchical global map data service for continent -> country -> community navigation

class GlobalMapService {
  constructor() {
    this.status = "idle";
    this.continents = {};
    this.communities = [];
    this.layers = ["energy", "food", "water", "health", "trade", "governance"];
  }

  initialize() {
    this.status = "ready";
    this.loadContinentData();
    console.log("[GlobalMapService] Initialized with", Object.keys(this.continents).length, "continents");
  }

  loadContinentData() {
    // 5 continental groups with hierarchical structure
    this.continents = {
      "North America": {
        id: "north-america",
        displayName: "North America",
        emoji: "🌎",
        coordinates: { lat: 45, lng: -100 },
        bounds: { north: 83, south: 15, east: -53, west: -170 },
        countries: ["USA", "Canada"],
        population: 580000,
        communities: 12,
        metrics: {
          energy: 84,
          food: 78,
          water: 71,
          health: 76,
          trade: 68,
          governance: 72
        },
        herbalTraditions: ["Native American", "European"],
        description: "North American communities focused on renewable energy and local food systems"
      },
      "Oceania": {
        id: "oceania",
        displayName: "Oceania",
        emoji: "🌏",
        coordinates: { lat: -25, lng: 135 },
        bounds: { north: -10, south: -47, east: 180, west: 110 },
        countries: ["Australia", "New Zealand"],
        population: 280000,
        communities: 8,
        metrics: {
          energy: 89,
          food: 82,
          water: 65,
          health: 79,
          trade: 72,
          governance: 75
        },
        herbalTraditions: ["Aboriginal Australian", "European"],
        description: "Oceanic communities pioneering solar technology and aquatic ecosystems"
      },
      "South America": {
        id: "south-america",
        displayName: "South America",
        emoji: "🌎",
        coordinates: { lat: -15, lng: -60 },
        bounds: { north: 13, south: -56, east: -34, west: -82 },
        countries: ["Brazil", "Peru", "Colombia"],
        population: 420000,
        communities: 10,
        metrics: {
          energy: 76,
          food: 88,
          water: 78,
          health: 72,
          trade: 65,
          governance: 68
        },
        herbalTraditions: ["Amazonian", "Indigenous South American"],
        description: "South American communities stewarding rainforest resources and biodiversity"
      },
      "Europe": {
        id: "europe",
        displayName: "Europe & UK",
        emoji: "🌍",
        coordinates: { lat: 50, lng: 10 },
        bounds: { north: 71, south: 35, east: 40, west: -10 },
        countries: ["UK", "Germany", "France", "Italy", "Spain"],
        population: 650000,
        communities: 15,
        metrics: {
          energy: 82,
          food: 75,
          water: 76,
          health: 81,
          trade: 79,
          governance: 78
        },
        herbalTraditions: ["European", "Mediterranean"],
        description: "European communities integrating traditional herbalism with modern sustainability"
      },
      "Asia": {
        id: "asia",
        displayName: "Asia",
        emoji: "🌏",
        coordinates: { lat: 20, lng: 100 },
        bounds: { north: 55, south: -10, east: 150, west: 60 },
        countries: ["India"],
        population: 350000,
        communities: 9,
        metrics: {
          energy: 71,
          food: 84,
          water: 68,
          health: 75,
          trade: 62,
          governance: 70
        },
        herbalTraditions: ["Ayurveda", "Traditional Chinese Medicine"],
        description: "Asian communities preserving ancient herbal wisdom and sustainable agriculture"
      }
    };

    // Load communities from this service and distribute across continents
    this.loadCommunities();
  }

  loadCommunities() {
    // Sample communities distributed across continents
    const communityData = [
      // North America (12)
      { id: "comm-na-001", name: "Harmony Valley", continent: "North America", country: "USA", region: "California", lat: 37.7749, lng: -122.4194, population: 450, tier: "hub", energy: 98, food: 85, water: 71, health: 84, trade: 75 },
      { id: "comm-na-002", name: "Green Leaf Collective", continent: "North America", country: "USA", region: "Vermont", lat: 44.2672, lng: -72.5754, population: 180, tier: "regional", energy: 92, food: 88, water: 69, health: 81, trade: 72 },
      { id: "comm-na-003", name: "Solar Haven", continent: "North America", country: "USA", region: "Arizona", lat: 33.3157, lng: -111.8910, population: 220, tier: "regional", energy: 95, food: 72, water: 65, health: 78, trade: 68 },
      { id: "comm-na-004", name: "Great Plains Hub", continent: "North America", country: "USA", region: "Kansas", lat: 38.5266, lng: -97.5347, population: 310, tier: "hub", energy: 88, food: 92, water: 68, health: 79, trade: 71 },
      { id: "comm-na-005", name: "Pacific Northwest", continent: "North America", country: "USA", region: "Washington", lat: 47.7511, lng: -122.3570, population: 280, tier: "regional", energy: 91, food: 86, water: 82, health: 83, trade: 73 },
      { id: "comm-na-006", name: "Maple Sustainable", continent: "North America", country: "Canada", region: "British Columbia", lat: 49.2827, lng: -123.1207, population: 195, tier: "regional", energy: 89, food: 84, water: 78, health: 81, trade: 70 },
      { id: "comm-na-007", name: "Eco Toronto", continent: "North America", country: "Canada", region: "Ontario", lat: 43.6532, lng: -79.3832, population: 340, tier: "hub", energy: 86, food: 81, water: 75, health: 80, trade: 72 },
      { id: "comm-na-008", name: "Prairie Harmony", continent: "North America", country: "Canada", region: "Alberta", lat: 51.5074, lng: -114.1371, population: 225, tier: "regional", energy: 90, food: 87, water: 70, health: 79, trade: 69 },
      { id: "comm-na-009", name: "Florida Wetlands", continent: "North America", country: "USA", region: "Florida", lat: 25.7617, lng: -80.1918, population: 265, tier: "regional", energy: 82, food: 76, water: 58, health: 74, trade: 65 },
      { id: "comm-na-010", name: "Rocky Mountain Alliance", continent: "North America", country: "USA", region: "Colorado", lat: 39.7392, lng: -104.9903, population: 190, tier: "local", energy: 87, food: 83, water: 72, health: 78, trade: 68 },
      { id: "comm-na-011", name: "Midwest Resilience", continent: "North America", country: "USA", region: "Illinois", lat: 41.8781, lng: -87.6298, population: 320, tier: "hub", energy: 84, food: 89, water: 70, health: 80, trade: 72 },
      { id: "comm-na-012", name: "Quebec Organic", continent: "North America", country: "Canada", region: "Quebec", lat: 45.5017, lng: -73.5673, population: 210, tier: "regional", energy: 85, food: 85, water: 76, health: 81, trade: 71 },

      // Oceania (8)
      { id: "comm-oc-001", name: "Outback Solar Hub", continent: "Oceania", country: "Australia", region: "New South Wales", lat: -33.8688, lng: 151.2093, population: 380, tier: "hub", energy: 96, food: 81, water: 68, health: 82, trade: 76 },
      { id: "comm-oc-002", name: "Melbourne Green", continent: "Oceania", country: "Australia", region: "Victoria", lat: -37.8136, lng: 144.9631, population: 290, tier: "regional", energy: 91, food: 84, water: 72, health: 83, trade: 74 },
      { id: "comm-oc-003", name: "Aboriginal Knowledge", continent: "Oceania", country: "Australia", region: "Northern Territory", lat: -12.4634, lng: 130.8456, population: 150, tier: "local", energy: 78, food: 88, water: 65, health: 76, trade: 62 },
      { id: "comm-oc-004", name: "Perth Solar", continent: "Oceania", country: "Australia", region: "Western Australia", lat: -31.9505, lng: 115.8605, population: 210, tier: "regional", energy: 94, food: 77, water: 58, health: 79, trade: 68 },
      { id: "comm-oc-005", name: "Auckland Eco", continent: "Oceania", country: "New Zealand", region: "Auckland", lat: -37.0082, lng: 174.7850, population: 320, tier: "hub", energy: 88, food: 86, water: 80, health: 84, trade: 75 },
      { id: "comm-oc-006", name: "Wellington Green", continent: "Oceania", country: "New Zealand", region: "Wellington", lat: -41.2865, lng: 174.7762, population: 185, tier: "regional", energy: 86, food: 83, water: 78, health: 81, trade: 72 },
      { id: "comm-oc-007", name: "Christchurch Sustainable", continent: "Oceania", country: "New Zealand", region: "Canterbury", lat: -43.5321, lng: 172.6362, population: 160, tier: "regional", energy: 84, food: 85, water: 76, health: 80, trade: 70 },
      { id: "comm-oc-008", name: "Rotorua Geothermal", continent: "Oceania", country: "New Zealand", region: "Bay of Plenty", lat: -38.1368, lng: 176.2497, population: 145, tier: "local", energy: 92, food: 81, water: 82, health: 78, trade: 65 },

      // South America (10)
      { id: "comm-sa-001", name: "Amazon Guardian", continent: "South America", country: "Brazil", region: "Amazonas", lat: -3.1190, lng: -60.0217, population: 280, tier: "regional", energy: 72, food: 91, water: 85, health: 75, trade: 58 },
      { id: "comm-sa-002", name: "São Paulo Hub", continent: "South America", country: "Brazil", region: "São Paulo", lat: -23.5505, lng: -46.6333, population: 450, tier: "hub", energy: 78, food: 84, water: 72, health: 78, trade: 72 },
      { id: "comm-sa-003", name: "Bahia Organic", continent: "South America", country: "Brazil", region: "Bahia", lat: -13.0044, lng: -38.9693, population: 195, tier: "regional", energy: 74, food: 89, water: 68, health: 74, trade: 62 },
      { id: "comm-sa-004", name: "Lima Sustainable", continent: "South America", country: "Peru", region: "Lima", lat: -12.0464, lng: -77.0428, population: 320, tier: "hub", energy: 76, food: 86, water: 64, health: 72, trade: 68 },
      { id: "comm-sa-005", name: "Andean Resilience", continent: "South America", country: "Peru", region: "Cusco", lat: -13.5319, lng: -71.9753, population: 160, tier: "regional", energy: 68, food: 88, water: 76, health: 70, trade: 58 },
      { id: "comm-sa-006", name: "Bogotá Green", continent: "South America", country: "Colombia", region: "Cundinamarca", lat: 4.7110, lng: -74.0055, population: 380, tier: "hub", energy: 79, food: 87, water: 74, health: 76, trade: 71 },
      { id: "comm-sa-007", name: "Medellín Innovation", continent: "South America", country: "Colombia", region: "Antioquia", lat: 6.2442, lng: -75.5898, population: 290, tier: "regional", energy: 81, food: 85, water: 72, health: 77, trade: 70 },
      { id: "comm-sa-008", name: "Caribbean Blend", continent: "South America", country: "Colombia", region: "Bolívar", lat: 10.3997, lng: -75.5144, population: 175, tier: "local", energy: 75, food: 83, water: 68, health: 72, trade: 60 },
      { id: "comm-sa-009", name: "Rainforest Research", continent: "South America", country: "Brazil", region: "Rondônia", lat: -8.7619, lng: -63.9039, population: 145, tier: "local", energy: 70, food: 92, water: 84, health: 71, trade: 55 },
      { id: "comm-sa-010", name: "Amazon Network", continent: "South America", country: "Peru", region: "Loreto", lat: -3.7490, lng: -73.2834, population: 120, tier: "local", energy: 65, food: 89, water: 82, health: 68, trade: 50 },

      // Europe (15)
      { id: "comm-eu-001", name: "London Green", continent: "Europe", country: "UK", region: "London", lat: 51.5074, lng: -0.1278, population: 420, tier: "hub", energy: 85, food: 78, water: 81, health: 84, trade: 81 },
      { id: "comm-eu-002", name: "Berlin Sustainable", continent: "Europe", country: "Germany", region: "Berlin", lat: 52.5200, lng: 13.4050, population: 380, tier: "hub", energy: 88, food: 76, water: 79, health: 83, trade: 80 },
      { id: "comm-eu-003", name: "Paris Harmony", continent: "Europe", country: "France", region: "Île-de-France", lat: 48.8566, lng: 2.3522, population: 340, tier: "hub", energy: 83, food: 74, water: 77, health: 82, trade: 78 },
      { id: "comm-eu-004", name: "Amsterdam Canal", continent: "Europe", country: "Germany", region: "North Rhine", lat: 52.3676, lng: 4.9041, population: 290, tier: "regional", energy: 90, food: 75, water: 85, health: 85, trade: 79 },
      { id: "comm-eu-005", name: "Barcelona Green", continent: "Europe", country: "France", region: "Catalonia", lat: 41.3851, lng: 2.1734, population: 310, tier: "regional", energy: 84, food: 76, water: 78, health: 81, trade: 77 },
      { id: "comm-eu-006", name: "Rome Heritage", continent: "Europe", country: "Italy", region: "Lazio", lat: 41.9028, lng: 12.4964, population: 320, tier: "regional", energy: 81, food: 77, water: 75, health: 80, trade: 75 },
      { id: "comm-eu-007", name: "Milan Innovation", continent: "Europe", country: "Italy", region: "Lombardy", lat: 45.4642, lng: 9.1900, population: 340, tier: "hub", energy: 86, food: 78, water: 76, health: 82, trade: 78 },
      { id: "comm-eu-008", name: "Madrid Eco", continent: "Europe", country: "France", region: "Madrid", lat: 40.4168, lng: -3.7038, population: 380, tier: "hub", energy: 82, food: 75, water: 70, health: 79, trade: 76 },
      { id: "comm-eu-009", name: "Edinburgh Nature", continent: "Europe", country: "UK", region: "Scotland", lat: 55.9533, lng: -3.1883, population: 210, tier: "regional", energy: 82, food: 76, water: 82, health: 81, trade: 74 },
      { id: "comm-eu-010", name: "Vienna Gardens", continent: "Europe", country: "Germany", region: "Austria", lat: 48.2082, lng: 16.3738, population: 270, tier: "regional", energy: 84, food: 77, water: 78, health: 82, trade: 76 },
      { id: "comm-eu-011", name: "Prague Heritage", continent: "Europe", country: "Germany", region: "Czech Republic", lat: 50.0755, lng: 14.4378, population: 240, tier: "regional", energy: 80, food: 74, water: 76, health: 79, trade: 72 },
      { id: "comm-eu-012", name: "Copenhagen Wind", continent: "Europe", country: "Germany", region: "Denmark", lat: 55.6761, lng: 12.5683, population: 300, tier: "hub", energy: 92, food: 73, water: 80, health: 84, trade: 78 },
      { id: "comm-eu-013", name: "Stockholm Green", continent: "Europe", country: "Germany", region: "Sweden", lat: 59.3293, lng: 18.0686, population: 280, tier: "regional", energy: 89, food: 72, water: 81, health: 83, trade: 77 },
      { id: "comm-eu-014", name: "Warsaw Rising", continent: "Europe", country: "Germany", region: "Poland", lat: 52.2297, lng: 21.0122, population: 290, tier: "regional", energy: 78, food: 73, water: 74, health: 77, trade: 70 },
      { id: "comm-eu-015", name: "Lisbon Coast", continent: "Europe", country: "France", region: "Portugal", lat: 38.7223, lng: -9.1393, population: 240, tier: "regional", energy: 79, food: 75, water: 72, health: 78, trade: 71 },

      // Asia (9)
      { id: "comm-as-001", name: "Delhi Hub", continent: "Asia", country: "India", region: "Delhi", lat: 28.6139, lng: 77.2090, population: 520, tier: "hub", energy: 72, food: 86, water: 65, health: 75, trade: 62 },
      { id: "comm-as-002", name: "Mumbai Commerce", continent: "Asia", country: "India", region: "Maharashtra", lat: 19.0760, lng: 72.8777, population: 480, tier: "hub", energy: 70, food: 83, water: 62, health: 73, trade: 64 },
      { id: "comm-as-003", name: "Bangalore Tech", continent: "Asia", country: "India", region: "Karnataka", lat: 12.9716, lng: 77.5946, population: 420, tier: "hub", energy: 74, food: 84, water: 68, health: 76, trade: 66 },
      { id: "comm-as-004", name: "Kerala Ayurveda", continent: "Asia", country: "India", region: "Kerala", lat: 8.5241, lng: 76.9366, population: 280, tier: "regional", energy: 68, food: 88, water: 74, health: 78, trade: 58 },
      { id: "comm-as-005", name: "Rajasthan Solar", continent: "Asia", country: "India", region: "Rajasthan", lat: 26.9124, lng: 75.7873, population: 200, tier: "regional", energy: 76, food: 82, water: 58, health: 72, trade: 55 },
      { id: "comm-as-006", name: "Goa Organic", continent: "Asia", country: "India", region: "Goa", lat: 15.2993, lng: 73.8243, population: 160, tier: "local", energy: 70, food: 85, water: 70, health: 75, trade: 58 },
      { id: "comm-as-007", name: "Tamil Nadu Garden", continent: "Asia", country: "India", region: "Tamil Nadu", lat: 13.0827, lng: 80.2707, population: 220, tier: "regional", energy: 69, food: 87, water: 68, health: 74, trade: 59 },
      { id: "comm-as-008", name: "Punjab Farm", continent: "Asia", country: "India", region: "Punjab", lat: 31.5497, lng: 74.3436, population: 240, tier: "regional", energy: 71, food: 89, water: 66, health: 73, trade: 60 },
      { id: "comm-as-009", name: "Himalayan Herbs", continent: "Asia", country: "India", region: "Himachal Pradesh", lat: 31.7335, lng: 77.1998, population: 130, tier: "local", energy: 65, food: 84, water: 76, health: 77, trade: 52 }
    ];

    this.communities = communityData;
  }

  // Get all continents
  getContinents() {
    return Object.values(this.continents);
  }

  // Get all communities
  getCommunities() {
    return this.communities;
  }

  // Get specific continent
  getContinent(continentName) {
    return this.continents[continentName];
  }

  // Get communities for a continent
  getCommunitiesByContinent(continentName) {
    return this.communities.filter(c => c.continent === continentName);
  }

  // Get communities for a country
  getCommunitiesByCountry(country) {
    return this.communities.filter(c => c.country === country);
  }

  // Get specific community
  getCommunity(communityId) {
    return this.communities.find(c => c.id === communityId);
  }

  // Get all countries in a continent
  getCountriesByContinent(continentName) {
    const continent = this.continents[continentName];
    return continent ? continent.countries : [];
  }

  // Calculate metrics for continent
  getContinentMetrics(continentName) {
    const communities = this.getCommunitiesByContinent(continentName);
    if (communities.length === 0) return {};

    const metrics = {};
    const layers = this.layers;

    layers.forEach(layer => {
      const values = communities.map(c => c[layer]).filter(v => v !== undefined);
      metrics[layer] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    });

    return metrics;
  }

  // Calculate metrics for country
  getCountryMetrics(country) {
    const communities = this.getCommunitiesByCountry(country);
    if (communities.length === 0) return {};

    const metrics = {};
    const layers = this.layers;

    layers.forEach(layer => {
      const values = communities.map(c => c[layer]).filter(v => v !== undefined);
      metrics[layer] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    });

    return metrics;
  }

  // Get color for metric value
  getMetricColor(value, layer = "energy") {
    if (value >= 85) return "from-green-400 to-emerald-500"; // Excellent
    if (value >= 75) return "from-blue-400 to-cyan-500"; // Good
    if (value >= 60) return "from-yellow-400 to-amber-500"; // Needs attention
    return "from-red-400 to-orange-500"; // Critical
  }

  // Get metric indicator (for pins)
  getMetricIndicator(value) {
    if (value >= 85) return "🟢";
    if (value >= 75) return "🔵";
    if (value >= 60) return "🟡";
    return "🔴";
  }

  // Get all available layers
  getLayers() {
    return this.layers;
  }

  // Get layer description
  getLayerDescription(layer) {
    const descriptions = {
      energy: "Energy self-sufficiency ⚡",
      food: "Food production & security 🌾",
      water: "Water systems & recycling 💧",
      health: "Community wellness & resilience ❤️",
      trade: "Marketplace & economic activity 🏪",
      governance: "Community decision-making 🗳️"
    };
    return descriptions[layer] || layer;
  }
}

export default new GlobalMapService();
