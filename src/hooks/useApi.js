import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Custom Hook: useApiHealth
 * Monitors backend API connectivity and health status
 */
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      setIsLoading(true);
      try {
        const result = await api.health();
        setIsHealthy(true);
        setError(null);
        setLastCheck(new Date());
        console.log('✅ Backend API Health: OK', result);
      } catch (err) {
        setIsHealthy(false);
        setError(err.message || 'Backend connection failed');
        setLastCheck(new Date());
        console.error('❌ Backend API Health Check Failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Check health immediately
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isHealthy, isLoading, error, lastCheck };
};

/**
 * Custom Hook: useApiCall
 * Handles data fetching with loading and error states
 */
export const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err);
        console.error('API Call Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err);
      console.error('API Call Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};

/**
 * Custom Hook: useWaterData
 * Fetches all water-related data
 */
export const useWaterData = (regionId = 'default') => {
  const recycling = useApiCall(() => api.getWaterRecycling(regionId), [regionId]);
  const quality = useApiCall(() => api.getWaterQuality(regionId), [regionId]);
  const usage = useApiCall(() => api.getWaterUsage(regionId), [regionId]);
  const leaks = useApiCall(() => api.getWaterLeaks(regionId), [regionId]);
  const irrigation = useApiCall(() => api.getIrrigationZones(regionId), [regionId]);

  return {
    recycling,
    quality,
    usage,
    leaks,
    irrigation,
    isLoading: [recycling, quality, usage, leaks, irrigation].some(d => d.isLoading),
    hasError: [recycling, quality, usage, leaks, irrigation].some(d => d.error),
  };
};

/**
 * Custom Hook: useEnergyData
 * Fetches all energy-related data
 */
export const useEnergyData = (regionId = 'default') => {
  const solar = useApiCall(() => api.getSolarSystems(regionId), [regionId]);
  const battery = useApiCall(() => api.getBatterySystems(regionId), [regionId]);
  const grid = useApiCall(() => api.getGridConnection(regionId), [regionId]);
  const consumption = useApiCall(() => api.getEnergyConsumption(regionId), [regionId]);
  const metrics = useApiCall(() => api.getEnergyMetrics(regionId), [regionId]);

  return {
    solar,
    battery,
    grid,
    consumption,
    metrics,
    isLoading: [solar, battery, grid, consumption, metrics].some(d => d.isLoading),
    hasError: [solar, battery, grid, consumption, metrics].some(d => d.error),
  };
};

/**
 * Custom Hook: useClimateData
 * Fetches all climate-related data
 */
export const useClimateData = (regionId = 'default') => {
  const zones = useApiCall(() => api.getClimateZones(regionId), [regionId]);
  const monitoring = useApiCall(() => api.getEnvironmentalMonitoring(regionId), [regionId]);
  const weather = useApiCall(() => api.getWeatherForecast(regionId), [regionId]);
  const hvac = useApiCall(() => api.getHVACStatus(regionId), [regionId]);

  return {
    zones,
    monitoring,
    weather,
    hvac,
    isLoading: [zones, monitoring, weather, hvac].some(d => d.isLoading),
    hasError: [zones, monitoring, weather, hvac].some(d => d.error),
  };
};

/**
 * Custom Hook: useFoodData
 * Fetches all food-related data
 */
export const useFoodData = (regionId = 'default') => {
  const gardens = useApiCall(() => api.getGardens(regionId), [regionId]);
  const crops = useApiCall(() => api.getCropPlans(regionId), [regionId]);
  const storage = useApiCall(() => api.getStorageLocations(regionId), [regionId]);
  const pests = useApiCall(() => api.getPestManagement(regionId), [regionId]);

  return {
    gardens,
    crops,
    storage,
    pests,
    isLoading: [gardens, crops, storage, pests].some(d => d.isLoading),
    hasError: [gardens, crops, storage, pests].some(d => d.error),
  };
};

/**
 * Custom Hook: useCommunityData
 * Fetches all community/heartware-related data
 */
export const useCommunityData = (regionId = 'default') => {
  const resources = useApiCall(() => api.getCommunityResources(regionId), [regionId]);
  const skills = useApiCall(() => api.getSkillsMarketplace(regionId), [regionId]);
  const events = useApiCall(() => api.getCommunityEvents(regionId), [regionId]);
  const wellness = useApiCall(() => api.getWellnessTracking(regionId), [regionId]);

  return {
    resources,
    skills,
    events,
    wellness,
    isLoading: [resources, skills, events, wellness].some(d => d.isLoading),
    hasError: [resources, skills, events, wellness].some(d => d.error),
  };
};

/**
 * Custom Hook: useSystemData
 * Fetches all system management data
 */
export const useSystemData = (regionId = 'default') => {
  const expansions = useApiCall(() => api.getExpansionPlans(regionId), [regionId]);
  const assets = useApiCall(() => api.getAssetInventory(regionId), [regionId]);
  const iot = useApiCall(() => api.getIoTDevices(regionId), [regionId]);
  const config = useApiCall(() => api.getSystemConfiguration(regionId), [regionId]);
  const metrics = useApiCall(() => api.getSystemMetrics(regionId), [regionId]);

  return {
    expansions,
    assets,
    iot,
    config,
    metrics,
    isLoading: [expansions, assets, iot, config, metrics].some(d => d.isLoading),
    hasError: [expansions, assets, iot, config, metrics].some(d => d.error),
  };
};

/**
 * Custom Hook: useGovernanceData
 * Fetches governance, proposals, and voting data
 */
export const useGovernanceData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [stats, proposals, members, delegates] = await Promise.all([
        api.getGovernanceStats(),
        api.getProposals(),
        api.getGovernanceMembers(regionId),
        api.getGovernanceDelegates()
      ]);
      setData({ stats, proposals, members, delegates });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load governance data');
      console.error('Governance data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useExpansionData
 * Fetches expansion projects, housing, water, solar data
 */
export const useExpansionData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [projects, metrics, housing, water, solar, timeline] = await Promise.all([
        api.getExpansionProjects(),
        api.getExpansionMetrics(),
        api.getHousingExpansion(regionId),
        api.getWaterExpansion(regionId),
        api.getSolarExpansion(regionId),
        api.getExpansionTimeline()
      ]);
      setData({ projects, metrics, housing, water, solar, timeline });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load expansion data');
      console.error('Expansion data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useResilienceData
 * Fetches resilience metrics, emergency plans, risks, and backup systems
 */
export const useResilienceData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [metrics, plans, preparedness, risks, resources, backups] = await Promise.all([
        api.getResilienceMetrics(regionId),
        api.getEmergencyPlans(),
        api.getEmergencyPreparedness(regionId),
        api.getRisks(regionId),
        api.getResilienceResources(),
        api.getBackupSystems(regionId)
      ]);
      setData({ metrics, plans, preparedness, risks, resources, backups });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load resilience data');
      console.error('Resilience data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useAlerts
 * Fetches and manages system alerts
 */
export const useAlerts = (status = 'active') => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts(status);
      setAlerts(data?.alerts || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
      console.error('Alerts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const acknowledge = async (alertId) => {
    try {
      await api.acknowledgeAlert(alertId);
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const resolve = async (alertId, resolution) => {
    try {
      await api.resolveAlert(alertId, resolution);
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  useEffect(() => {
    refetch();
  }, [status]);

  return { alerts, loading, error, refetch, acknowledge, resolve };
};

/**
 * Custom Hook: useHerbalData
 * Fetches herbal library data with filtering
 */
export const useHerbalData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const herbalData = await api.getHerbalLibrary(regionId);
      setData(herbalData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load herbal library');
      console.error('Herbal library error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useSeedBankData
 * Fetches seed bank inventory and varieties
 */
export const useSeedBankData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [seedBank, varieties] = await Promise.all([
        api.getSeedBank(regionId),
        api.getSeedVarieties(regionId)
      ]);
      setData({ seedBank, varieties });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load seed bank');
      console.error('Seed bank error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useKnowledgeBaseData
 * Fetches knowledge base articles and categories
 */
export const useKnowledgeBaseData = (regionId = null, category = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [knowledgeBase, articles] = await Promise.all([
        api.getKnowledgeBase(regionId),
        api.getKnowledgeArticles(category)
      ]);
      setData({ knowledgeBase, articles });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load knowledge base');
      console.error('Knowledge base error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId, category]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useMarketplaceData
 * Fetches marketplace listings and trade history
 */
export const useMarketplaceData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [listings, trades] = await Promise.all([
        api.getMarketplaceListings(regionId),
        api.getTradeHistory(regionId, 50)
      ]);
      setData({ listings, trades });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load marketplace');
      console.error('Marketplace error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useInventoryData
 * Fetches inventory items and categories
 */
export const useInventoryData = (regionId = null, category = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [items, categories] = await Promise.all([
        api.getInventoryItems(regionId, category),
        api.getInventoryCategories(regionId)
      ]);
      setData({ items, categories });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
      console.error('Inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId, category]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useAdminData
 * Fetches admin dashboard, logs, and system services
 */
export const useAdminData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const [dashboard, logs, services] = await Promise.all([
        api.getAdminDashboard(),
        api.getSystemLogs(100),
        api.getSystemServices()
      ]);
      setData({ dashboard, logs, services });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
      console.error('Admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useSettingsData
 * Fetches user settings
 */
export const useSettingsData = (userId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const settings = await api.getUserSettings(userId);
      setData(settings);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
      console.error('Settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [userId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useWellnessDataAPI
 * Fetches wellness tracking data from API
 */
export const useWellnessDataAPI = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const wellness = await api.getWellnessData(regionId);
      setData(wellness);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load wellness data');
      console.error('Wellness error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

/**
 * Custom Hook: useAutomationData
 * Fetches automation rules
 */
export const useAutomationData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const rules = await api.getAutomationRules();
      setData(rules);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load automation rules');
      console.error('Automation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};
