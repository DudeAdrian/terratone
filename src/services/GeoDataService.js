/**
 * GeoDataService - Standard GeoJSON-based geographic data
 * Uses Johan's world.geo.json (public domain)
 * Enhanced with continent grouping for regional maps
 * 
 * Data source: https://raw.githubusercontent.com/johan/world.geo.json
 * Standard: GeoJSON (RFC 7946)
 */

const CONTINENT_MAPPING = {
  'United States of America': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'Belize': 'North America',
  'Costa Rica': 'North America',
  'El Salvador': 'North America',
  'Guatemala': 'North America',
  'Honduras': 'North America',
  'Jamaica': 'North America',
  'Cuba': 'North America',
  'Dominican Republic': 'North America',
  
  'Brazil': 'South America',
  'Argentina': 'South America',
  'Chile': 'South America',
  'Colombia': 'South America',
  'Ecuador': 'South America',
  'Guyana': 'South America',
  'Paraguay': 'South America',
  'Peru': 'South America',
  'Suriname': 'South America',
  'Uruguay': 'South America',
  'Venezuela': 'South America',
  
  'United Kingdom': 'Europe',
  'Ireland': 'Europe',
  'Spain': 'Europe',
  'Portugal': 'Europe',
  'France': 'Europe',
  'Germany': 'Europe',
  'Italy': 'Europe',
  'Greece': 'Europe',
  'Poland': 'Europe',
  'Sweden': 'Europe',
  'Norway': 'Europe',
  'Russia': 'Europe',
  
  'Egypt': 'Africa',
  'Nigeria': 'Africa',
  'South Africa': 'Africa',
  'Ethiopia': 'Africa',
  'Kenya': 'Africa',
  'Morocco': 'Africa',
  'Algeria': 'Africa',
  'Sudan': 'Africa',
  'Libya': 'Africa',
  'Senegal': 'Africa',
  
  'China': 'Asia',
  'Japan': 'Asia',
  'India': 'Asia',
  'South Korea': 'Asia',
  'Vietnam': 'Asia',
  'Thailand': 'Asia',
  'Indonesia': 'Asia',
  'Malaysia': 'Asia',
  'Philippines': 'Asia',
  'Singapore': 'Asia',
  'Pakistan': 'Asia',
  'Bangladesh': 'Asia',
  'Myanmar': 'Asia',
  
  'Australia': 'Oceania',
  'New Zealand': 'Oceania',
  'Fiji': 'Oceania',
  'Vanuatu': 'Oceania'
};

const GeoDataService = {
  status: 'idle',
  worldFeatures: [],  // Loaded GeoJSON features

  initialize() {
    this.status = 'ready';
    console.log('[GeoDataService] Initialized with GeoJSON world data');
  },

  /**
   * Load countries from a GeoJSON FeatureCollection
   * Used internally by InteractiveMap
   */
  loadFeatures(featureCollection) {
    if (featureCollection && featureCollection.features) {
      this.worldFeatures = featureCollection.features.map(feature => ({
        ...feature,
        continent: CONTINENT_MAPPING[feature.properties.name] || 'Other'
      }));
      console.log(`[GeoDataService] Loaded ${this.worldFeatures.length} countries`);
    }
  },

  /**
   * Get all features (countries) optionally filtered by continent
   */
  getFeatures(continent = null) {
    if (!continent) {
      return this.worldFeatures;
    }
    return this.worldFeatures.filter(f => f.continent === continent);
  },

  /**
   * Get unique continent list
   */
  getContinents() {
    const continents = new Set(this.worldFeatures.map(f => f.continent));
    return Array.from(continents).sort();
  },

  /**
   * Get feature by country name
   */
  getFeatureByName(name) {
    return this.worldFeatures.find(f => f.properties.name === name);
  },

  /**
   * Get feature by ID (country ISO code)
   */
  getFeatureById(id) {
    return this.worldFeatures.find(f => f.id === id);
  },

  /**
   * Calculate bounding box for a feature or feature set
   */
  getBounds(features) {
    const featureArray = Array.isArray(features) ? features : [features];
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

    featureArray.forEach(feature => {
      const coords = this.getCoordinates(feature);
      coords.forEach(([lng, lat]) => {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    });

    return { minLat, maxLat, minLng, maxLng };
  },

  /**
   * Flatten coordinates from any geometry type
   */
  getCoordinates(feature) {
    const coords = [];
    const geometry = feature.geometry;

    const extract = (coord) => {
      if (typeof coord[0] === 'number') {
        coords.push(coord);
      } else {
        coord.forEach(extract);
      }
    };

    if (geometry.coordinates) {
      geometry.coordinates.forEach(extract);
    }

    return coords;
  }
};

export default GeoDataService;
