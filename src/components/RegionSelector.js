import React from 'react';
import { useRegion } from '../context/RegionContext';
import { GlassCard } from '../theme/GlassmorphismTheme';

/**
 * RegionSelector Component
 * Dropdown to select active region with integrated map
 */
export default function RegionSelector() {
  const { selectedRegion, regions, loading, selectRegion } = useRegion();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          📍 Region:
        </label>
        <select
          value={selectedRegion?.id || ''}
          onChange={(e) => {
            const region = regions.find(r => r.id === e.target.value);
            if (region) selectRegion(region);
          }}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-white/20 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-white text-sm hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select a region...</option>
          {regions.map(region => (
            <option key={region.id} value={region.id}>
              {region.name} ({region.climateZone})
            </option>
          ))}
        </select>
        {selectedRegion && (
          <>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              ✓ {selectedRegion.name}
            </span>
            <button
              onClick={() => navigate('/map')}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition"
            >
              🗺️ View Map
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * RegionInfo Card
 * Display detailed region information
 */
export function RegionInfo() {
  const { selectedRegion } = useRegion();

  if (!selectedRegion) {
    return (
      <GlassCard className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">No region selected</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {selectedRegion.name}
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Climate Zone</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {selectedRegion.climateZone}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Coordinates</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {selectedRegion.latitude.toFixed(1)}°, {selectedRegion.longitude.toFixed(1)}°
          </p>
        </div>
      </div>
      {selectedRegion.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {selectedRegion.description}
        </p>
      )}
    </GlassCard>
  );
}
