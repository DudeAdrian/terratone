// src/pages/Map_v2.js - Quantum Navigation Map with Throat Chakra Theme

import React from "react";
import { Link } from "react-router-dom";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";

const modules = [
  { 
    title: "Community Tools", 
    path: "/services/community", 
    icon: "👥",
    description: "Organize and empower community initiatives",
    chakra: "throat"
  },
  { 
    title: "Energy Systems", 
    path: "/services/energy", 
    icon: "⚡",
    description: "Monitor solar, battery, and grid systems",
    chakra: "solar"
  },
  { 
    title: "AI Interfaces", 
    path: "/services/ai", 
    icon: "🧠",
    description: "Deploy AI tools for communication",
    chakra: "third_eye"
  },
  { 
    title: "Sustainability Layers", 
    path: "/services/sustainability", 
    icon: "🌍",
    description: "Track food, water, housing metrics",
    chakra: "heart"
  },
  { 
    title: "Admin Dashboard", 
    path: "/admin", 
    icon: "⚙️",
    description: "Manage users and system settings",
    chakra: "crown"
  },
];

const Map = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-gray-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="throat">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,187,255,0.5)]">
            🗺️ Sofie Systems Map
          </h1>
          <p className="text-cyan-200 mt-2">Navigate your operating system and access all modules</p>
        </QuantumSection>

        {/* Navigation Grid */}
        <QuantumGlassGrid columns={2} gap={6}>
          {modules.map((mod, idx) => (
            <Link key={idx} to={mod.path}>
              <QuantumCard 
                chakra={mod.chakra} 
                blurLevel="deep" 
                opacityLevel="ultraClear" 
                glow={true} 
                edgeGlow={true} 
                interactive={true}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{mod.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-200 shadow-[0_0_10px_rgba(0,187,255,0.3)]">
                    Active
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{mod.title}</h2>
                <p className="text-cyan-100 mb-4">{mod.description}</p>
                <div className="text-sm font-semibold text-cyan-300 drop-shadow-[0_0_5px_rgba(0,187,255,0.5)]">
                  Navigate →
                </div>
              </QuantumCard>
            </Link>
          ))}
        </QuantumGlassGrid>

        {/* Quick Links Section */}
        <QuantumSection chakra="throat">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(0,187,255,0.5)]">Quick Links</h2>
          <QuantumGlassGrid columns={5} gap={4}>
            {[
              { to: "/sustainability", icon: "📊", label: "Dashboard" },
              { to: "/map", icon: "🗂️", label: "Browse" },
              { to: "/settings", icon: "⚙️", label: "Settings" },
              { to: "/admin", icon: "👑", label: "Admin" },
              { to: "/services", icon: "🔧", label: "Services" },
            ].map((link, idx) => (
              <Link key={idx} to={link.to}>
                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-cyan-400/30 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(0,187,255,0.5)] transition text-center">
                  <p className="text-2xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{link.icon}</p>
                  <p className="text-sm font-semibold text-white">{link.label}</p>
                </div>
              </Link>
            ))}
          </QuantumGlassGrid>
        </QuantumSection>

        {/* Info Card */}
        <QuantumCard chakra="throat" blurLevel="medium" opacityLevel="veil" glow={true}>
          <p className="text-center text-sm font-semibold text-cyan-200">
            🔗 All modules connected via Web3 • System-wide blockchain integration
          </p>
        </QuantumCard>
      </div>
    </div>
  );
};

export default Map;
