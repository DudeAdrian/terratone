/**
 * sofie-map-system Bridge — Spatial Layer Integration
 * 
 * Connects terratone to sofie-map-system for:
 * - Regional data (Pillar 3)
 * - Strategic zones (Pillar 4)
 * - Cross-regional links (Pillar 8)
 */

const SOFIE_MAP_URL = process.env.SOFIE_MAP_URL || 'http://localhost:8002';

class SofieMapClient {
  constructor() {
    this.apiUrl = SOFIE_MAP_URL;
    this.connected = false;
  }

  async connect() {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      this.connected = response.ok;
      console.log('[SofieMapClient] Connected to Spatial Layer');
      return this.connected;
    } catch (error) {
      console.error('[SofieMapClient] Connection failed:', error);
      return false;
    }
  }

  async getContinents() {
    if (!this.connected) return [];
    
    const response = await fetch(`${this.apiUrl}/p3/geo/continents`);
    const data = await response.json();
    return data.data || [];
  }

  async getRegionalMetrics(regionId) {
    if (!this.connected) return null;
    
    const response = await fetch(`${this.apiUrl}/p3/metrics/${regionId}`);
    return response.json();
  }

  async getGovernanceZones() {
    if (!this.connected) return [];
    
    const response = await fetch(`${this.apiUrl}/p4/strategy/zones`);
    const data = await response.json();
    return data.zones || [];
  }

  async optimizeResources(regionId, priority) {
    if (!this.connected) return null;
    
    const response = await fetch(`${this.apiUrl}/p4/strategy/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionId, priority })
    });
    
    return response.json();
  }

  async getConnections() {
    if (!this.connected) return [];
    
    const response = await fetch(`${this.apiUrl}/p8/connections`);
    const data = await response.json();
    return data.connections || [];
  }

  async getNetworkGraph() {
    if (!this.connected) return null;
    
    const response = await fetch(`${this.apiUrl}/p8/network/graph`);
    return response.json();
  }
}

module.exports = new SofieMapClient();
