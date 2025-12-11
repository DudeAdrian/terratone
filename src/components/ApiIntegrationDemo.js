import React from 'react';
import { useApiHealth, useWaterData, useEnergyData, useClimateData, useFoodData } from '../hooks/useApi';
import { GlassSection, GlassCard, GlassGrid } from '../theme/GlassmorphismTheme';
import '../styles/components/api-integration-demo.css';

/**
 * API Integration Demo Component
 * Showcases real backend integration with live data
 */
export default function ApiIntegrationDemo() {
  const { isHealthy, lastCheck } = useApiHealth();
  const waterData = useWaterData('default');
  const energyData = useEnergyData('default');
  const climateData = useClimateData('default');
  const foodData = useFoodData('default');

  const allLoading = [waterData, energyData, climateData, foodData].some(d => d.isLoading);
  const anyError = [waterData, energyData, climateData, foodData].some(d => d.hasError);

  return (
    <div className="api-demo-container">
      <GlassSection colors={{ primary: 'cyan', secondary: 'blue' }} elevation="high">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            🔌 API Integration Status
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Real-time data from sofie-backend</p>
        </div>
      </GlassSection>

      {/* Backend Status */}
      <GlassSection colors={{ primary: 'emerald', secondary: 'green' }}>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Backend Status</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last checked: {lastCheck?.toLocaleTimeString() || 'Checking...'}
              </p>
            </div>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isHealthy ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <span className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
              <span className={isHealthy ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
                {isHealthy ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </GlassSection>

      {/* Data Status */}
      <GlassSection colors={{ primary: 'cyan', secondary: 'blue' }}>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Domain Data Status</h2>
          
          {allLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-600 dark:text-gray-400">
                <div className="animate-spin inline-block w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full mr-3"></div>
                Loading domain data...
              </div>
            </div>
          )}

          {!allLoading && (
            <GlassGrid cols={1} colsMd={2} gap={4}>
              {/* Water */}
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">💧 Water</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Recycling:</span>
                      <span className={waterData.recycling.isLoading ? 'text-yellow-600' : waterData.recycling.error ? 'text-red-600' : 'text-green-600'}>
                        {waterData.recycling.isLoading ? '⏳ Loading' : waterData.recycling.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                      <span className={waterData.quality.isLoading ? 'text-yellow-600' : waterData.quality.error ? 'text-red-600' : 'text-green-600'}>
                        {waterData.quality.isLoading ? '⏳ Loading' : waterData.quality.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                      <span className={waterData.usage.isLoading ? 'text-yellow-600' : waterData.usage.error ? 'text-red-600' : 'text-green-600'}>
                        {waterData.usage.isLoading ? '⏳ Loading' : waterData.usage.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Energy */}
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-3">⚡ Energy</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Solar:</span>
                      <span className={energyData.solar.isLoading ? 'text-yellow-600' : energyData.solar.error ? 'text-red-600' : 'text-green-600'}>
                        {energyData.solar.isLoading ? '⏳ Loading' : energyData.solar.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Battery:</span>
                      <span className={energyData.battery.isLoading ? 'text-yellow-600' : energyData.battery.error ? 'text-red-600' : 'text-green-600'}>
                        {energyData.battery.isLoading ? '⏳ Loading' : energyData.battery.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Grid:</span>
                      <span className={energyData.grid.isLoading ? 'text-yellow-600' : energyData.grid.error ? 'text-red-600' : 'text-green-600'}>
                        {energyData.grid.isLoading ? '⏳ Loading' : energyData.grid.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Climate */}
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-3">🌡️ Climate</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Zones:</span>
                      <span className={climateData.zones.isLoading ? 'text-yellow-600' : climateData.zones.error ? 'text-red-600' : 'text-green-600'}>
                        {climateData.zones.isLoading ? '⏳ Loading' : climateData.zones.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monitoring:</span>
                      <span className={climateData.monitoring.isLoading ? 'text-yellow-600' : climateData.monitoring.error ? 'text-red-600' : 'text-green-600'}>
                        {climateData.monitoring.isLoading ? '⏳ Loading' : climateData.monitoring.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weather:</span>
                      <span className={climateData.weather.isLoading ? 'text-yellow-600' : climateData.weather.error ? 'text-red-600' : 'text-green-600'}>
                        {climateData.weather.isLoading ? '⏳ Loading' : climateData.weather.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Food */}
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">🌾 Food</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gardens:</span>
                      <span className={foodData.gardens.isLoading ? 'text-yellow-600' : foodData.gardens.error ? 'text-red-600' : 'text-green-600'}>
                        {foodData.gardens.isLoading ? '⏳ Loading' : foodData.gardens.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Crops:</span>
                      <span className={foodData.crops.isLoading ? 'text-yellow-600' : foodData.crops.error ? 'text-red-600' : 'text-green-600'}>
                        {foodData.crops.isLoading ? '⏳ Loading' : foodData.crops.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                      <span className={foodData.storage.isLoading ? 'text-yellow-600' : foodData.storage.error ? 'text-red-600' : 'text-green-600'}>
                        {foodData.storage.isLoading ? '⏳ Loading' : foodData.storage.error ? '❌ Error' : '✅ Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </GlassGrid>
          )}
        </div>
      </GlassSection>

      {/* Implementation Status */}
      <GlassSection colors={{ primary: 'purple', secondary: 'indigo' }}>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Implementation Status</h2>
          <GlassGrid cols={1} colsMd={2} gap={4}>
            <GlassCard>
              <div className="p-6">
                <h3 className="font-bold mb-3">✅ Completed</h3>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ API Service Layer (70+ methods)</li>
                  <li>✓ Custom React Hooks (8 hooks)</li>
                  <li>✓ Health Check Monitoring</li>
                  <li>✓ Error Handling</li>
                  <li>✓ Environment Configuration</li>
                  <li>✓ API Status Component</li>
                </ul>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="p-6">
                <h3 className="font-bold mb-3">🚀 Next Steps</h3>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li>→ Update remaining dashboard components</li>
                  <li>→ Add loading skeletons</li>
                  <li>→ Implement data caching</li>
                  <li>→ Add form submission handlers</li>
                  <li>→ Real-time WebSocket updates</li>
                  <li>→ Comprehensive E2E testing</li>
                </ul>
              </div>
            </GlassCard>
          </GlassGrid>
        </div>
      </GlassSection>

      {/* API Documentation Link */}
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          See <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">FRONTEND_INTEGRATION_GUIDE.md</code> for complete documentation
        </p>
        <button
          onClick={() => window.location.href = '/api/docs'}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          View Backend API Docs
        </button>
      </div>
    </div>
  );
}
