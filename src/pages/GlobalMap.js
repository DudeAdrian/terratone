import React, { useEffect, useMemo, useState } from "react";
import { useRegion } from "../context/RegionContext";
import GlobalMapService from "../services/GlobalMapService";
import InteractiveMap from "../components/InteractiveMap";
import { HolographicCard } from "../theme/QuantumGlassTheme";

// Map RegionSelector selection -> GlobalMapService continent keys
const CONTINENT_BY_REGION = {
  "North America": "North America",
  "Oceania": "Oceania",
  "South America": "South America",
  "Europe & UK": "Europe",
  "Asia": "Asia",
};

const GlobalMap = () => {
  const { selectedRegion, regions, selectRegion } = useRegion();
  const [selectedLayer, setSelectedLayer] = useState("health");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  useEffect(() => {
    if (GlobalMapService.status === "idle") {
      GlobalMapService.initialize();
    }
  }, []);

  const continent = selectedRegion ? (CONTINENT_BY_REGION[selectedRegion.name] || selectedRegion.name) : null;

  const communities = useMemo(() => {
    if (!continent) return [];
    return GlobalMapService.getCommunitiesByContinent(continent);
  }, [continent]);

  useEffect(() => {
    if (communities.length > 0) {
      setSelectedCommunity(communities[0]);
    } else {
      setSelectedCommunity(null);
    }
  }, [communities]);

  const layerOptions = GlobalMapService.getLayers();

  const renderCommunityCard = (community) => {
    if (!community) return null;
    return (
      <HolographicCard glowColor="cyan" interactive={false}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase text-cyan-800 font-semibold">Selected community</p>
            <h3 className="text-2xl font-bold text-slate-900">{community.name}</h3>
            <p className="text-sm text-slate-700">{community.region}, {community.country}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-cyan-800 font-semibold">Population</p>
            <p className="text-xl font-bold text-slate-900">{community.population.toLocaleString()}</p>
            <p className="text-xs text-slate-700 capitalize">Tier: {community.tier}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {["health", "energy", "food", "water", "trade", "governance"].map((metric) => (
            <div key={metric} className="p-3 rounded-lg bg-white/70 border border-white/60 shadow-sm">
              <p className="text-xs text-cyan-800 uppercase font-semibold">{metric}</p>
              <p className="text-lg font-bold text-slate-900">{community[metric] ?? 0}%</p>
            </div>
          ))}
        </div>
      </HolographicCard>
    );
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <HolographicCard glowColor="cyan" interactive={false}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">🗺️ Regional Community Map</h1>
              <p className="text-slate-700 mt-2">
                Dots represent communities in your selected region. Click a dot to see population and key metrics.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label htmlFor="region-select" className="text-slate-700 font-semibold mr-2">Region:</label>
              <select
                id="region-select"
                value={selectedRegion ? selectedRegion.name : ''}
                onChange={e => {
                  const region = regions.find(r => r.name === e.target.value);
                  if (region) selectRegion(region);
                }}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-white/80 text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="" disabled>Select region</option>
                {regions.map(region => (
                  <option key={region.id} value={region.name}>{region.name}</option>
                ))}
              </select>
              <div className="ml-4 flex flex-wrap gap-2">
                {layerOptions.map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setSelectedLayer(layer)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      selectedLayer === layer
                        ? "bg-emerald-500 text-white shadow"
                        : "bg-white/70 text-slate-800 hover:bg-white"
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {!selectedRegion && (
            <p className="mt-4 text-sm text-amber-800 bg-white/80 rounded-lg px-3 py-2 border border-white/60">
              Select a region in the header to load its communities.
            </p>
          )}
        </HolographicCard>

        {selectedRegion && (
          <HolographicCard glowColor="cyan" interactive={false}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-cyan-800 font-semibold">Region</p>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedRegion.name}</h2>
                  <p className="text-sm text-slate-600">{continent}</p>
                </div>
                <div className="text-sm text-slate-700">
                  {communities.length} communities in view
                </div>
              </div>

              {communities.length === 0 ? (
                <p className="text-sm text-slate-600">No communities found for this region.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-3">
                    <InteractiveMap
                      communities={communities.map((c) => ({ ...c, value: c[selectedLayer] }))}
                      onCommunitySelect={setSelectedCommunity}
                      defaultLayer={selectedLayer}
                    />
                    <div className="flex flex-wrap gap-2">
                      {communities.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCommunity(c)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                            selectedCommunity && selectedCommunity.id === c.id
                              ? "border-cyan-300 bg-white/80 text-slate-900 shadow"
                              : "border-white/50 bg-white/20 text-white hover:bg-white/40"
                          }`}
                        >
                          {GlobalMapService.getMetricIndicator(c[selectedLayer])} {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {renderCommunityCard(selectedCommunity)}
                  </div>
                </div>
              )}
            </div>
          </HolographicCard>
        )}
      </div>
    </div>
  );
};

export default GlobalMap;
