/**
 * API Service Layer
 * Central hub for all backend API calls
 * Handles configuration, requests, error handling, and response formatting
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      requiresAuth = false,
      ...restOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers: defaultHeaders,
      ...restOptions,
    };

    if (body) {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await Promise.race([
        fetch(url, config),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        ),
      ]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.error || `HTTP ${response.status}`,
          data: errorData,
        };
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Health Check
   */
  async health() {
    return this.request('/health');
  }

  // ============ WATER MANAGEMENT ============

  async getWaterRecycling(regionId = 'default') {
    return this.request(`/api/water/recycling?regionId=${regionId}`);
  }

  async updateWaterRecycling(id, data) {
    return this.request(`/api/water/recycling/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async getWaterQuality(regionId = 'default') {
    return this.request(`/api/water/quality?regionId=${regionId}`);
  }

  async recordWaterQualityTest(data) {
    return this.request('/api/water/quality', {
      method: 'POST',
      body: data,
    });
  }

  async getWaterUsage(regionId = 'default') {
    return this.request(`/api/water/usage?regionId=${regionId}`);
  }

  async getWaterUsageStatistics(regionId = 'default') {
    return this.request(`/api/water/usage/statistics?regionId=${regionId}`);
  }

  async recordWaterUsage(data) {
    return this.request('/api/water/usage/record', {
      method: 'POST',
      body: data,
    });
  }

  async getWaterLeaks(regionId = 'default') {
    return this.request(`/api/water/leaks?regionId=${regionId}`);
  }

  async detectWaterLeak(data) {
    return this.request('/api/water/leaks/detect', {
      method: 'POST',
      body: data,
    });
  }

  async getIrrigationZones(regionId = 'default') {
    return this.request(`/api/water/irrigation?regionId=${regionId}`);
  }

  async createIrrigationZone(data) {
    return this.request('/api/water/irrigation/zones', {
      method: 'POST',
      body: data,
    });
  }

  // ============ ENERGY MANAGEMENT ============

  async getSolarSystems(regionId = 'default') {
    return this.request(`/api/energy/solar?regionId=${regionId}`);
  }

  async updateSolarSystem(id, data) {
    return this.request(`/api/energy/solar/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async getBatterySystems(regionId = 'default') {
    return this.request(`/api/energy/battery?regionId=${regionId}`);
  }

  async getBatteryStatus(id) {
    return this.request(`/api/energy/battery/${id}/status`);
  }

  async chargeBattery(id, data) {
    return this.request(`/api/energy/battery/${id}/charge`, {
      method: 'POST',
      body: data,
    });
  }

  async getGridConnection(regionId = 'default') {
    return this.request(`/api/energy/grid?regionId=${regionId}`);
  }

  async getEnergyConsumption(regionId = 'default', timeRange = 'month') {
    return this.request(`/api/energy/consumption?regionId=${regionId}&timeRange=${timeRange}`);
  }

  async getEnergyMetrics(regionId = 'default') {
    return this.request(`/api/energy/metrics?regionId=${regionId}`);
  }

  // ============ CLIMATE MANAGEMENT ============

  async getClimateZones(regionId = 'default') {
    return this.request(`/api/climate/zones?regionId=${regionId}`);
  }

  async createClimateZone(data) {
    return this.request('/api/climate/zones', {
      method: 'POST',
      body: data,
    });
  }

  async updateClimateZone(id, data) {
    return this.request(`/api/climate/zones/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async getEnvironmentalMonitoring(regionId = 'default') {
    return this.request(`/api/climate/monitoring?regionId=${regionId}`);
  }

  async recordEnvironmentalData(data) {
    return this.request('/api/climate/monitoring/record', {
      method: 'POST',
      body: data,
    });
  }

  async getWeatherForecast(regionId = 'default', days = 7) {
    return this.request(`/api/climate/weather?regionId=${regionId}&days=${days}`);
  }

  async getHVACStatus(regionId = 'default') {
    return this.request(`/api/climate/hvac?regionId=${regionId}`);
  }

  // ============ FOOD PRODUCTION ============

  async getGardens(regionId = 'default') {
    return this.request(`/api/food/gardens?regionId=${regionId}`);
  }

  async createGarden(data) {
    return this.request('/api/food/gardens', {
      method: 'POST',
      body: data,
    });
  }

  async getCropPlans(regionId = 'default') {
    return this.request(`/api/food/crops?regionId=${regionId}`);
  }

  async recordCropPlanting(data) {
    return this.request('/api/food/crops/plant', {
      method: 'POST',
      body: data,
    });
  }

  async recordCropHarvest(id, data) {
    return this.request(`/api/food/crops/${id}/harvest`, {
      method: 'POST',
      body: data,
    });
  }

  async getStorageLocations(regionId = 'default') {
    return this.request(`/api/food/storage?regionId=${regionId}`);
  }

  async getStorageInventory(id) {
    return this.request(`/api/food/storage/${id}/inventory`);
  }

  async recordStorageEntry(data) {
    return this.request('/api/food/storage/record', {
      method: 'POST',
      body: data,
    });
  }

  async getPestManagement(regionId = 'default') {
    return this.request(`/api/food/pests?regionId=${regionId}`);
  }

  async reportPestIssue(data) {
    return this.request('/api/food/pests/report', {
      method: 'POST',
      body: data,
    });
  }

  // ============ COMMUNITY & HEARTWARE ============

  async getCommunityResources(regionId = 'default') {
    return this.request(`/api/heartware/resources?regionId=${regionId}`);
  }

  async createCommunityResource(data) {
    return this.request('/api/heartware/resources', {
      method: 'POST',
      body: data,
    });
  }

  async shareResource(id, data) {
    return this.request(`/api/heartware/resources/${id}/share`, {
      method: 'POST',
      body: data,
    });
  }

  async getSkillsMarketplace(regionId = 'default') {
    return this.request(`/api/heartware/skills?regionId=${regionId}`);
  }

  async listSkill(data) {
    return this.request('/api/heartware/skills', {
      method: 'POST',
      body: data,
    });
  }

  async getCommunityEvents(regionId = 'default') {
    return this.request(`/api/heartware/events?regionId=${regionId}`);
  }

  async createEvent(data) {
    return this.request('/api/heartware/events', {
      method: 'POST',
      body: data,
    });
  }

  async getWellnessTracking(regionId = 'default') {
    return this.request(`/api/heartware/wellness?regionId=${regionId}`);
    }

  async recordWellnessData(data) {
    return this.request('/api/heartware/wellness/record', {
      method: 'POST',
      body: data,
    });
  }

  // ============ SYSTEM MANAGEMENT ============

  async getExpansionPlans(regionId = 'default') {
    return this.request(`/api/system/expansions?regionId=${regionId}`);
  }

  async createExpansionPlan(data) {
    return this.request('/api/system/expansions', {
      method: 'POST',
      body: data,
    });
  }

  async getAssetInventory(regionId = 'default') {
    return this.request(`/api/system/assets?regionId=${regionId}`);
  }

  async recordAsset(data) {
    return this.request('/api/system/assets', {
      method: 'POST',
      body: data,
    });
  }

  async getIoTDevices(regionId = 'default') {
    return this.request(`/api/system/iot?regionId=${regionId}`);
  }

  async registerIoTDevice(data) {
    return this.request('/api/system/iot', {
      method: 'POST',
      body: data,
    });
  }

  async getSystemConfiguration(regionId = 'default') {
    return this.request(`/api/system/config?regionId=${regionId}`);
  }

  async updateSystemConfiguration(data) {
    return this.request('/api/system/config', {
      method: 'PATCH',
      body: data,
    });
  }

  async getSystemMetrics(regionId = 'default') {
    return this.request(`/api/system/metrics?regionId=${regionId}`);
  }

  // ============ REGIONS (Existing) ============

  async getRegions() {
    return this.request('/api/regions');
  }

  async getRegionDetails(regionId) {
    return this.request(`/api/regions/${regionId}`);
  }

  async getRegionalMetrics(regionId, metricType = null, year = null) {
    let query = `?regionId=${regionId}`;
    if (metricType) query += `&metricType=${metricType}`;
    if (year) query += `&year=${year}`;
    return this.request(`/api/regions/${regionId}/metrics${query}`);
  }

  async getRegionalBenchmarks(regionId) {
    return this.request(`/api/regions/${regionId}/benchmarks`);
  }

  // ============ LIBRARIES & KNOWLEDGE ============

  async getHerbalLibrary(regionId = 'default') {
    return this.request(`/api/herbal-library?regionId=${regionId}`);
  }

  async getHerbalRemedy(id) {
    return this.request(`/api/herbal-library/${id}`);
  }

  async getSeedBank(regionId = 'default') {
    return this.request(`/api/seed-bank?regionId=${regionId}`);
  }

  async getSeedVarieties(regionId = 'default') {
    return this.request(`/api/seed-bank/items?regionId=${regionId}`);
  }

  async getKnowledgeBase(regionId = 'default') {
    return this.request(`/api/knowledge-base?regionId=${regionId}`);
  }

  async getKnowledgeArticles(category = null) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/api/knowledge-base/articles${query}`);
  }

  async getAquaponicLibrary(regionId = 'default') {
    return this.request(`/api/aquatic-life?regionId=${regionId}`);
  }

  async getAquaticSpecies(regionId = 'default') {
    return this.request(`/api/aquatic-life/species?regionId=${regionId}`);
  }

  // ============ GLOBAL NETWORK ============

  async getGlobalCommunities(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/global/communities${query}`);
  }

  async getGlobalMetrics() {
    return this.request('/api/global/metrics');
  }

  async getGlobalTrades(limit = 50) {
    return this.request(`/api/global/trades?limit=${limit}`);
  }

  async getGlobalLibraries() {
    return this.request('/api/global/libraries');
  }

  async getGlobalResourceMap() {
    return this.request('/api/global/resources');
  }

  // ============ GOVERNANCE & PROPOSALS ============

  async getGovernanceStats() {
    return this.request('/api/governance/stats');
  }

  async getProposals(status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/api/governance/proposals${query}`);
  }

  async getProposal(id) {
    return this.request(`/api/governance/proposals/${id}`);
  }

  async createProposal(proposalData) {
    return this.request('/api/governance/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData)
    });
  }

  async voteOnProposal(proposalId, voteData) {
    return this.request(`/api/governance/proposals/${proposalId}/votes`, {
      method: 'POST',
      body: JSON.stringify(voteData)
    });
  }

  async getGovernanceMembers(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/governance/members${query}`);
  }

  async getGovernanceDelegates() {
    return this.request('/api/governance/delegates');
  }

  // ============ EXPANSION PLANNING ============

  async getExpansionProjects(status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/api/expansion/projects${query}`);
  }

  async getExpansionMetrics() {
    return this.request('/api/expansion/metrics');
  }

  async getHousingExpansion(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/expansion/housing${query}`);
  }

  async getWaterExpansion(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/expansion/water${query}`);
  }

  async getSolarExpansion(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/expansion/solar${query}`);
  }

  async getExpansionTimeline() {
    return this.request('/api/expansion/timeline');
  }

  // ============ RESILIENCE & EMERGENCY ============

  async getResilienceMetrics(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/resilience/metrics${query}`);
  }

  async getEmergencyPlans() {
    return this.request('/api/resilience/emergency-plans');
  }

  async getEmergencyPreparedness(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/resilience/preparedness${query}`);
  }

  async getRisks(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/resilience/risks${query}`);
  }

  async getResilienceResources(type = null) {
    const query = type ? `?type=${type}` : '';
    return this.request(`/api/resilience/resources${query}`);
  }

  async getBackupSystems(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/resilience/backups${query}`);
  }

  // ============ ALERTING & NOTIFICATIONS ============

  async getAlerts(status = 'active') {
    return this.request(`/api/alerts?status=${status}`);
  }

  async acknowledgeAlert(alertId) {
    return this.request(`/api/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify({ acknowledged: true })
    });
  }

  async resolveAlert(alertId, resolution) {
    return this.request(`/api/alerts/${alertId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolution })
    });
  }

  // ============ MARKETPLACE & TRADING ============

  async getMarketplaceListings(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/marketplace/listings${query}`);
  }

  async getMarketplaceListing(listingId) {
    return this.request(`/api/marketplace/listings/${listingId}`);
  }

  async createMarketplaceListing(listingData) {
    return this.request('/api/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
  }

  async getTradeHistory(regionId = null, limit = 50) {
    const query = regionId ? `?regionId=${regionId}&limit=${limit}` : `?limit=${limit}`;
    return this.request(`/api/marketplace/trades${query}`);
  }

  // ============ INVENTORY MANAGEMENT ============

  async getInventoryItems(regionId = null, category = null) {
    const params = new URLSearchParams();
    if (regionId) params.append('regionId', regionId);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/inventory/items${query}`);
  }

  async getInventoryCategories(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/inventory/categories${query}`);
  }

  async addInventoryItem(itemData) {
    return this.request('/api/inventory/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async updateInventoryItem(itemId, updates) {
    return this.request(`/api/inventory/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // ============ ADMIN & SYSTEM MANAGEMENT ============

  async getAdminDashboard() {
    return this.request('/api/admin/dashboard');
  }

  async getSystemLogs(limit = 100) {
    return this.request(`/api/admin/logs?limit=${limit}`);
  }

  async getSystemServices() {
    return this.request('/api/admin/services');
  }

  async getUserSettings(userId = null) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request(`/api/settings${query}`);
  }

  async updateUserSettings(settings) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  async getWellnessData(regionId = null) {
    const query = regionId ? `?regionId=${regionId}` : '';
    return this.request(`/api/wellness${query}`);
  }

  async getAutomationRules() {
    return this.request('/api/automation/rules');
  }

  async createAutomationRule(ruleData) {
    return this.request('/api/automation/rules', {
      method: 'POST',
      body: JSON.stringify(ruleData)
    });
  }

  async updateAutomationRule(ruleId, updates) {
    return this.request(`/api/automation/rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
}

// Export singleton instance
export default new ApiService();
