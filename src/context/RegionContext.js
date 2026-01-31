import React, { createContext, useState, useEffect } from 'react';
import RegionService from '../services/RegionService';
import GlobalMapService from '../services/GlobalMapService';

export const RegionContext = createContext();

export default function RegionProvider({ children }) {
  const [selectedRegion, setSelectedRegion] = useState(RegionService.getSelectedRegion());
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRegions();
  }, []);

  async function loadRegions() {
    setLoading(true);
    
    // Try to fetch from backend first
    let data = await RegionService.fetchRegions();
    
    // If backend fails, use GlobalMapService continents as fallback
    if (!data || data.length === 0) {
      console.log('[RegionContext] Backend unavailable, using GlobalMapService continents');
      if (GlobalMapService.status === 'idle') {
        GlobalMapService.initialize();
      }
      
      const continents = GlobalMapService.getContinents();
      data = continents.map(continent => ({
        id: continent.id,
        name: continent.displayName,
        climateZone: continent.emoji,
        latitude: continent.coordinates.lat,
        longitude: continent.coordinates.lng,
        description: continent.description
      }));
    }
    
    setRegions(data);
    setLoading(false);
  }

  function handleSelectRegion(region) {
    RegionService.setSelectedRegion(region);
    setSelectedRegion(region);
  }

  const value = {
    selectedRegion,
    regions,
    loading,
    selectRegion: handleSelectRegion,
    refreshRegions: loadRegions
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = React.useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within RegionProvider');
  }
  return context;
}
