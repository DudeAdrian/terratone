import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import GlobalMapService from '../services/GlobalMapService';
import { useRegion } from '../context/RegionContext';

/**
 * MapPanel Component
 * Displays an interactive map with region-filtered communities
 */
export default function MapPanel() {
  const { selectedRegion } = useRegion();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  useEffect(() => {
    // Initialize GlobalMapService if not already initialized
    if (GlobalMapService.status === 'idle') {
      GlobalMapService.initialize();
    }
    
    // Load all communities for the map
    const allCommunities = GlobalMapService.getCommunities();
    console.log('[MapPanel] Loaded communities:', allCommunities.length);
    setCommunities(allCommunities);
  }, []);

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
  };

  // Map region display names to community continent values
  const continentMap = {
    'North America': 'North America',
    'Oceania': 'Oceania',
    'South America': 'South America',
    'Europe & UK': 'Europe',
    'Asia': 'Asia',
  };

  // Get the continent for this region
  const continent = selectedRegion ? (continentMap[selectedRegion.name] || selectedRegion.name) : null;

  // Filter communities for the selected region/continent, or show all if no region
  const regionCommunities = selectedRegion 
    ? communities.filter(c => c.continent === continent)
    : communities;

  console.log('[MapPanel] Selected region:', selectedRegion?.name);
  console.log('[MapPanel] Continent:', continent);
  console.log('[MapPanel] Filtered communities:', regionCommunities.length);

  // Don't show anything if no region is selected
  if (!selectedRegion) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700/50 p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-200">
            {selectedRegion.name} - {regionCommunities.length} communities
          </p>
          {selectedRegion.description && (
            <p className="text-xs text-slate-400">
              {selectedRegion.description}
            </p>
          )}
        </div>

          {regionCommunities.length > 0 ? (
            <>
              <InteractiveMap
                communities={regionCommunities}
                onCommunitySelect={handleCommunitySelect}
                defaultLayer="health"
              />

              {selectedCommunity && (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    {selectedCommunity.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400">Population</p>
                      <p className="text-white font-medium">
                        {selectedCommunity.population.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Tier</p>
                      <p className="text-white font-medium capitalize">
                        {selectedCommunity.tier}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Latitude</p>
                      <p className="text-white font-medium">
                        {selectedCommunity.lat.toFixed(3)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Longitude</p>
                      <p className="text-white font-medium">
                        {selectedCommunity.lng.toFixed(3)}°
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/50 grid grid-cols-3 gap-2">
                    {['health', 'energy', 'food'].map(metric => (
                      <div key={metric}>
                        <p className="text-slate-400 text-xs capitalize">{metric}</p>
                        <p className="text-white font-semibold">
                          {selectedCommunity[metric] || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              No communities in {selectedRegion.name}. Select a different region.
            </p>
          )}
      </div>
    </div>
  );
}
