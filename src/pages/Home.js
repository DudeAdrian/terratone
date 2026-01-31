// src/pages/Home.js - Glassmorphic Landing Page

import React from "react";
import { Link } from "react-router-dom";
import { HolographicCard } from "../theme/QuantumGlassTheme";

const Home = () => {

  const features = [
    {
      icon: "⚡",
      title: "Energy Systems",
      description: "Monitor solar production, battery levels, and grid balance in real-time.",
      link: "/services/energy",
      glow: "amber",
    },
    {
      icon: "👥",
      title: "Community",
      description: "Connect, collaborate, and empower your local community.",
      link: "/services/community",
      glow: "cyan",
    },
    {
      icon: "🌍",
      title: "Sustainability",
      description: "Track food, water, housing, and environmental metrics.",
      link: "/sustainability",
      glow: "emerald",
    },
    {
      icon: "⚙️",
      title: "Admin",
      description: "Manage users, settings, and system configuration.",
      link: "/admin",
      glow: "violet",
    },
    {
      icon: "🧘‍♀️",
      title: "Wellness Intelligence",
      description: "Real-time biometrics with voice-activated health monitoring.",
      link: "/wellness-dashboard",
      glow: "violet",
    },
    {
      icon: "🌿",
      title: "Herbal Library",
      description: "Natural remedies and personalized wellness recommendations.",
      link: "/herbal-library",
      glow: "emerald",
    },
  ];

  return (
    <div className="relative min-h-screen bg-transparent p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-white/5 to-cyan-400/5 blur-3xl" />
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Hero Section */}
        <HolographicCard glowColor="amber" interactive={false}>
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 to-orange-200 bg-clip-text text-transparent">
              🌱 Sofie Systems
            </h1>
            <p className="text-lg md:text-xl text-slate-800 max-w-3xl mx-auto">
              Operating System for Harmonic Habitats communities. Empowering sustainable living through integrated systems, collaborative networks, and intelligent resource management.
            </p>
            <p className="text-base md:text-lg font-semibold text-amber-700">
              The benchmark operating system for regenerative living
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-lg text-xs font-semibold text-amber-800">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              Network syncing
            </div>
          </div>
        </HolographicCard>

        {/* Global Network CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HolographicCard glowColor="amber">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-700">Global Map</p>
                <h2 className="text-2xl font-bold text-slate-900">50+ communities live</h2>
                <p className="text-slate-700 mt-1">See population, energy, water, and health overlays across all regions.</p>
              </div>
              <Link
                to="/global-map"
                className="px-5 py-2 rounded-full bg-amber-500 text-white font-semibold shadow hover:shadow-lg transition"
              >
                Open Map →
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-amber-800">
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Population insights</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Live metrics</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Regional filters</span>
            </div>
          </HolographicCard>

          <HolographicCard glowColor="emerald">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-700">Herbal Library</p>
                <h2 className="text-2xl font-bold text-slate-900">Indigenous knowledge</h2>
                <p className="text-slate-700 mt-1">11 herbs across 7 traditions, ready offline with safety notes.</p>
              </div>
              <Link
                to="/herbal-library"
                className="px-5 py-2 rounded-full bg-emerald-500 text-white font-semibold shadow hover:shadow-lg transition"
              >
                Browse Herbs →
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-emerald-800">
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Search & filter</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Traditions</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60">Safety ready</span>
            </div>
          </HolographicCard>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white/90">Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link key={feature.link} to={feature.link}>
                <HolographicCard glowColor={feature.glow}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">{feature.icon}</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-white/50 text-slate-800 shadow">
                      Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-700 mb-4">{feature.description}</p>
                  <div className="text-sm font-semibold text-amber-700">Explore →</div>
                </HolographicCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
