import React, { useState, useEffect } from 'react';
import RegionService from '../services/RegionService';
import { GlassCard, GlassSection } from '../theme/GlassmorphismTheme';
import { GlassPageLayout, GlassGrid } from '../theme/GlassPageLayouts';

/**
 * GlobalBenchmarks Page
 * Compare regions by yield, water efficiency, emissions
 */
export default function GlobalBenchmarks() {
  const [regions, setRegions] = useState([]);
  const [benchmarks, setBenchmarks] = useState({});
  const [metricType, setMetricType] = useState('yield');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [metricType]);

  async function loadData() {
    setLoading(true);
    const regionList = await RegionService.fetchRegions();
    setRegions(regionList);

    const benchmarkData = {};
    for (const region of regionList) {
      const benchs = await RegionService.fetchBenchmarks(region.id);
      benchmarkData[region.id] = benchs;
    }
    setBenchmarks(benchmarkData);
    setLoading(false);
  }

  // Sort regions by metric
  const sortedRegions = [...regions].sort((a, b) => {
    const benchA = benchmarks[a.id]?.find(b => b.metricType === metricType);
    const benchB = benchmarks[b.id]?.find(b => b.metricType === metricType);
    return (benchB?.percentile || 0) - (benchA?.percentile || 0);
  });

  return (
    <GlassPageLayout
      title="Global Benchmarks"
      subtitle="Compare regional performance metrics"
      icon="🌍"
    >
      {/* Metric selector */}
      <GlassSection className="mb-6">
        <div className="flex gap-4">
          {['yield', 'water_efficiency', 'emissions_per_ton'].map(type => (
            <button
              key={type}
              onClick={() => setMetricType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                metricType === type
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/30'
              }`}
            >
              {type.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </GlassSection>

      {loading ? (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading benchmarks...</p>
        </GlassCard>
      ) : (
        <GlassGrid cols={1}>
          {sortedRegions.map((region, idx) => {
            const bench = benchmarks[region.id]?.find(b => b.metricType === metricType);
            const rank = idx + 1;
            const isTopThree = rank <= 3;

            return (
              <GlassCard key={region.id} className="p-6 flex items-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {isTopThree && <span className="text-2xl">{'🥇🥈🥉'[rank - 1]}</span>}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      #{rank} {region.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {region.climateZone} • {region.name}
                  </p>
                </div>

                {bench && (
                  <div className="text-right space-y-2">
                    <div className="text-3xl font-bold text-emerald-500">
                      {bench.percentile}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg: {bench.averageValue.toFixed(0)} | Range: {bench.minValue.toFixed(0)} - {bench.maxValue.toFixed(0)}
                    </div>
                    <div className="w-40 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
                        style={{ width: `${bench.percentile}%` }}
                      />
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </GlassGrid>
      )}

      {/* Info section */}
      <GlassSection title="About Benchmarks" className="mt-8 pt-8 border-t border-white/10">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Global benchmarks compare regional performance across key sustainability metrics.
          Percentile ranking shows how each region compares to the global average.
          Higher percentiles indicate better performance for that metric.
        </p>
      </GlassSection>
    </GlassPageLayout>
  );
}
