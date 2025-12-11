// src/pages/Services_v2.js - Quantum Services Hub with Heart Chakra Theme

import React from "react";
import { Link } from "react-router-dom";
import { HolographicCard } from "../theme/QuantumGlassTheme";

const Services = () => {
  const services = [
    {
      title: "Global Community Map",
      path: "/global-map",
      description: "Interactive continental map showing all 50+ communities worldwide with region filters.",
      icon: "🗺️",
      chakra: "throat",
    },
    {
      title: "Community Tools",
      path: "community",
      description: "Organize, connect, and empower community initiatives.",
      icon: "👥",
      chakra: "heart",
    },
    {
      title: "Herbal Library",
      path: "/herbal-library",
      description: "Indigenous herbal knowledge for resilience and shared wellness.",
      icon: "🌿",
      chakra: "heart",
    },
    {
      title: "Energy Systems",
      path: "energy",
      description: "Manage solar, battery, and off-grid solutions.",
      icon: "⚡",
      chakra: "solar",
    },
    {
      title: "AI Interfaces",
      path: "ai",
      description: "Deploy AI tools for communication and decision-making.",
      icon: "🧠",
      chakra: "third_eye",
    },
    {
      title: "Self-Sufficiency",
      path: "/sustainability",
      description: "Track food, water, housing, and local metrics.",
      icon: "🌍",
      chakra: "heart",
    },
  ];

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <HolographicCard glowColor="emerald" interactive={false}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-700">Access Hub</p>
              <h1 className="text-4xl font-bold text-slate-900">Services</h1>
              <p className="text-slate-700 mt-2">All Sofie Systems modules in one place.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-800">
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Web3-ready</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Blockchain verified</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Integrated</span>
            </div>
          </div>
        </HolographicCard>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <Link key={idx} to={service.path}>
              <HolographicCard glowColor={service.chakra === 'heart' ? 'emerald' : service.chakra === 'solar' ? 'amber' : service.chakra === 'throat' ? 'cyan' : 'violet'}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">{service.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-white/50 text-slate-800 shadow">
                    Active
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-700 mb-4">{service.description}</p>
                <div className="text-sm font-semibold text-emerald-700">Access →</div>
              </HolographicCard>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <HolographicCard glowColor="emerald" interactive={false}>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">About Services</h2>
          <p className="text-slate-700">
            Each service is a core module of the Sofie Systems OS. They are Web3-ready, blockchain-verified, and fully integrated to keep your Harmonic Habitat in sync.
          </p>
        </HolographicCard>
      </div>
    </div>
  );
};

export default Services;
