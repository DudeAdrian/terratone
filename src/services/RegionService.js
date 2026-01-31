/**
 * RegionService.js
 * Fetches regional data from Sofie Backend for global context
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/api";

class RegionService {
  constructor() {
    this.selectedRegion = JSON.parse(localStorage.getItem("sofie_region")) || null;
  }

  // Get all regions
  async fetchRegions() {
    try {
      const response = await fetch(`${BACKEND_URL}/regions`);
      if (!response.ok) throw new Error("Failed to fetch regions");
      return await response.json();
    } catch (error) {
      console.error("RegionService error:", error);
      return [];
    }
  }

  // Get region by ID with all data
  async fetchRegion(regionId) {
    try {
      const response = await fetch(`${BACKEND_URL}/regions/${regionId}`);
      if (!response.ok) throw new Error("Region not found");
      return await response.json();
    } catch (error) {
      console.error("RegionService error:", error);
      return null;
    }
  }

  // Get metrics for region
  async fetchMetrics(regionId, metricType = "yield", year = 2024) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/regions/${regionId}/metrics?metricType=${metricType}&year=${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch metrics");
      return await response.json();
    } catch (error) {
      console.error("RegionService error:", error);
      return [];
    }
  }

  // Get benchmarks for region
  async fetchBenchmarks(regionId) {
    try {
      const response = await fetch(`${BACKEND_URL}/regions/${regionId}/benchmarks`);
      if (!response.ok) throw new Error("Failed to fetch benchmarks");
      return await response.json();
    } catch (error) {
      console.error("RegionService error:", error);
      return [];
    }
  }

  // Link user to region
  async linkUserToRegion(email, name, regionId, role = "viewer") {
    try {
      const response = await fetch(`${BACKEND_URL}/user-region`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, regionId, role })
      });
      if (!response.ok) throw new Error("Failed to link user");
      const user = await response.json();
      localStorage.setItem("sofie_user", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("RegionService error:", error);
      return null;
    }
  }

  // Get user
  async fetchUser(email) {
    try {
      const response = await fetch(`${BACKEND_URL}/users/${email}`);
      if (!response.ok) throw new Error("User not found");
      return await response.json();
    } catch (error) {
      console.error("RegionService error:", error);
      return null;
    }
  }

  // Set selected region (localStorage)
  setSelectedRegion(region) {
    this.selectedRegion = region;
    localStorage.setItem("sofie_region", JSON.stringify(region));
  }

  // Get selected region
  getSelectedRegion() {
    return this.selectedRegion;
  }

  // Clear selected region
  clearSelectedRegion() {
    this.selectedRegion = null;
    localStorage.removeItem("sofie_region");
  }
}

export default new RegionService();
