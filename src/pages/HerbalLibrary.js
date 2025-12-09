// src/pages/HerbalLibrary.js - Community herbal knowledge hub
import React, { useEffect, useMemo, useState } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const HerbalLibrary = () => {
  const [herbalService, setHerbalService] = useState(null);
  const [herbs, setHerbs] = useState([]);
  const [filters, setFilters] = useState({ search: "", tradition: "", communityUse: "", pregnancySafe: false });
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [stats, setStats] = useState({ totalHerbs: 0, traditions: 0, pregnancySafeCount: 0, resilienceFocus: 0 });

  useEffect(() => {
    const service = sofieCore.getService("herbalLibrary");
    if (service) {
      setHerbalService(service);
      setHerbs(service.getHerbs(filters));
      setStats(service.getStats());
    }
  }, []);

  useEffect(() => {
    if (!herbalService) return;
    setHerbs(herbalService.getHerbs(filters));
  }, [filters, herbalService]);

  const traditions = useMemo(() => herbalService?.getTraditions() || [], [herbalService]);
  const communityUses = useMemo(() => herbalService?.getCommunityUses() || [], [herbalService]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectHerb = (herbId) => {
    if (!herbalService) return;
    setSelectedHerb(herbalService.getHerbById(herbId));
  };

  const herbGrid = (
    <GlassGrid cols={1} colsMd={2} colsLg={3} gap={5}>
      {herbs.map((herb) => (
        <GlassCard key={herb.id} colors={{ primary: "green", secondary: "emerald" }} className="cursor-pointer" onClick={() => handleSelectHerb(herb.id)}>
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{herb.commonName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{herb.scientificName}</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100/60 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200">
                {herb.traditions[0]}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {herb.communityUses?.slice(0, 3).map((use) => (
                <span key={use} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 text-xs font-semibold">
                  {use}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Energetics: {herb.energetics}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 rounded bg-white/40 dark:bg-gray-800/40">{herb.preparation.join(", ")}</span>
              {herb.safety?.pregnancy && <span className="px-2 py-1 rounded bg-green-500/10 text-green-700 dark:text-green-300">✓ Pregnancy-aware</span>}
            </div>
          </div>
        </GlassCard>
      ))}

      {herbs.length === 0 && (
        <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
          <div className="p-10 text-center text-gray-600 dark:text-gray-400">No herbs match these filters yet.</div>
        </GlassCard>
      )}
    </GlassGrid>
  );

  const herbDetail = selectedHerb && (
    <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
      <div className="p-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">{selectedHerb.commonName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">{selectedHerb.scientificName}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedHerb.traditions.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 text-xs font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button onClick={() => setSelectedHerb(null)} className="text-sm text-emerald-600 dark:text-emerald-300 hover:underline">Back</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Community Uses</p>
              <div className="flex flex-wrap gap-2">
                {selectedHerb.communityUses.map((use) => (
                  <span key={use} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 text-xs font-semibold">
                    {use}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Energetics: {selectedHerb.energetics}</p>
            </div>
          </GlassCard>

          <GlassCard colors={{ primary: "yellow", secondary: "amber" }}>
            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold">Preparation</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedHerb.preparation.join(", ")}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Origin: {selectedHerb.origin}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Safety: {selectedHerb.safety?.notes}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "emerald", secondary: "green" }} elevation="high">
          <div className="py-10 px-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">🌿 Community Herbal Library</h1>
            <p className="text-lg text-emerald-700 dark:text-emerald-200 max-w-3xl mt-3">
              Indigenous herbal knowledge for community resilience, wellness, and shared stewardship.
            </p>
          </div>
        </GlassSection>

        {/* Stats */}
        <GlassGrid cols={2} colsMd={4} gap={5}>
          <GlassCard colors={{ primary: "emerald", secondary: "green" }}><div className="p-6 text-center"><div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Herbs</div><div className="text-4xl font-bold text-emerald-600 dark:text-emerald-300">{stats.totalHerbs}</div></div></GlassCard>
          <GlassCard colors={{ primary: "amber", secondary: "yellow" }}><div className="p-6 text-center"><div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Traditions</div><div className="text-4xl font-bold text-amber-600 dark:text-amber-300">{stats.traditions}</div></div></GlassCard>
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}><div className="p-6 text-center"><div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Pregnancy-aware</div><div className="text-4xl font-bold text-green-600 dark:text-green-300">{stats.pregnancySafeCount}</div></div></GlassCard>
          <GlassCard colors={{ primary: "cyan", secondary: "blue" }}><div className="p-6 text-center"><div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Resilience focus</div><div className="text-4xl font-bold text-cyan-600 dark:text-cyan-300">{stats.resilienceFocus}</div></div></GlassCard>
        </GlassGrid>

        {/* Filters */}
        <GlassCard colors={{ primary: "emerald", secondary: "green" }}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search name, use, tradition"
              className="w-full rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-gray-800 dark:text-gray-100"
            />
            <select
              value={filters.tradition}
              onChange={(e) => handleFilterChange("tradition", e.target.value)}
              className="w-full rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-gray-800 dark:text-gray-100"
            >
              <option value="">All traditions</option>
              {traditions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={filters.communityUse}
              onChange={(e) => handleFilterChange("communityUse", e.target.value)}
              className="w-full rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-gray-900/60 px-3 py-2 text-gray-800 dark:text-gray-100"
            >
              <option value="">All community uses</option>
              {communityUses.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={filters.pregnancySafe}
                onChange={(e) => handleFilterChange("pregnancySafe", e.target.checked)}
                className="w-4 h-4"
              />
              Pregnancy-aware only
            </label>
          </div>
        </GlassCard>

        {/* Content */}
        {selectedHerb ? herbDetail : herbGrid}
      </div>
    </div>
  );
};

export default HerbalLibrary;
