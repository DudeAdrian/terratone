// src/pages/Services_v2.js - Glassmorphic Services Hub

import React from "react";
import { Link } from "react-router-dom";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const Services = () => {
  const services = [
    {
      title: "Community Tools",
      path: "community",
      description: "Organize, connect, and empower community initiatives.",
      icon: "👥",
      color: "blue",
    },
    {
      title: "Herbal Library",
      path: "/herbal-library",
      description: "Indigenous herbal knowledge for resilience and shared wellness.",
      icon: "🌿",
      color: "green",
    },
    {
      title: "Energy Systems",
      path: "energy",
      description: "Manage solar, battery, and off-grid solutions.",
      icon: "⚡",
      color: "amber",
    },
    {
      title: "AI Interfaces",
      path: "ai",
      description: "Deploy AI tools for communication and decision-making.",
      icon: "🧠",
      color: "purple",
    },
    {
      title: "Self-Sufficiency",
      path: "/sustainability",
      description: "Track food, water, housing, and local metrics.",
      icon: "🌍",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }} elevation="high">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Services Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Access all Sofie Systems modules and tools</p>
        </GlassSection>

        {/* Services Grid */}
        <GlassGrid cols={1} colsMd={2} gap={6}>
          {services.map((service, idx) => (
            <Link key={idx} to={service.path}>
              <GlassCard colors={{ primary: service.color, secondary: service.color }}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{service.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/30 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">
                    Active
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{service.description}</p>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                  Access →
                </div>
              </GlassCard>
            </Link>
          ))}
        </GlassGrid>

        {/* Info Section */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About Services</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Each service represents a critical module of the Sofie Systems operating system. All services are Web3-enabled,
            blockchain-verified, and connected through our distributed architecture to ensure seamless integration across
            your Harmonic Habitats community.
          </p>
        </GlassSection>
      </div>
    </div>
  );
};

export default Services;
