import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import navigationConfig from "../config/navigation";
import sofieCore from "../core/SofieCore";

const MainLayout = ({ children }) => {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize services and fetch region from backend
    const initializeSystem = async () => {
      try {
        // Fetch regions from backend API
        const response = await fetch('http://localhost:3001/api/regions');
        if (response.ok) {
          const regions = await response.json();
          if (regions && regions.length > 0) {
            const region = regions[0]; // Use first region
            setCurrentRegion(region);
            
            // Initialize all services with the region
            const energyService = sofieCore.getService("energy");
            const waterService = sofieCore.getService("water");
            const foodService = sofieCore.getService("food");
            
            if (energyService) energyService.initialize(region.id);
            if (waterService) waterService.initialize(region.id);
            if (foodService) foodService.initialize(region.id);
            
            console.log("✅ Services initialized with region:", region.name);
          }
        }
      } catch (error) {
        console.warn("⚠️ Backend not available, using local mode:", error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeSystem();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      <header className="bg-gradient-to-r from-amber-200/80 via-orange-100/80 to-amber-200/80 backdrop-blur-xl text-amber-900 shadow-[0_0_40px_rgba(251,191,36,0.3)] border-b border-amber-300/40">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-3">
            🌱 <span className="bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Sofie Systems</span>
          </div>
          <div className="flex items-center gap-6">
            {currentRegion && (
              <div className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-amber-300/50 shadow-lg text-sm font-semibold text-amber-800">
                📍 {currentRegion.name}
              </div>
            )}
            {navigationConfig.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-amber-600 transition font-medium text-amber-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-200/40 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-700 font-semibold">Initializing services...</p>
            </div>
          </div>
        ) : children}
      </main>

      <footer className="bg-amber-200/60 backdrop-blur-md text-amber-900 mt-12 border-t border-amber-300/50 shadow-[0_-4px_20px_rgba(251,191,36,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Sofie Systems</h3>
              <p className="text-sm text-amber-800">Empowering sustainable communities through intelligent resource management.</p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Quick Links</h3>
              <ul className="text-sm space-y-1 text-amber-800">
                <li><a href="/services" className="hover:text-amber-600 transition">Services</a></li>
                <li><a href="/sustainability" className="hover:text-amber-600 transition">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Connect</h3>
              <p className="text-sm text-amber-800">Part of the Harmonic Habitats initiative</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center text-sm">
            <p>© 2025 Sofie Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;