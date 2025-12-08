// src/components/SystemShell.js

import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import sofieCore from "../core/SofieCore";
import navigationConfig from "../config/navigation";
import { SofieContext } from "../context/SofieContext";
import GlobalSearch from "./GlobalSearch";

const SystemShell = ({ children }) => {
  const [user, setUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState("manual");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sofie-dark-mode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const location = useLocation();
  const { updateState, state } = useContext(SofieContext);

  useEffect(() => {
    try {
      sofieCore.init();
      const authService = sofieCore.getService("auth");
      setUser(authService.getCurrentUser());
      // sync mode from context if available
      if (state?.operationMode) {
        setMode(state.operationMode);
        sofieCore.updateState("operationMode", state.operationMode);
      }
    } catch (error) {
      console.error("Error initializing SofieCore:", error);
    }
    
    // Apply dark mode to document root element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Keyboard shortcut for global search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    updateState("operationMode", nextMode);
    try {
      sofieCore.updateState("operationMode", nextMode);
    } catch (e) {
      console.warn("Unable to propagate mode to core", e);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('sofie-dark-mode', JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Don't show shell on login page
  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">🌱 Sofie Systems</h1>
            <p className="text-gray-500 dark:text-gray-400">Operating System for Harmonic Habitats Communities</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold transition border border-gray-300 dark:border-gray-600"
              title="Search (Ctrl+K)"
            >
              <span>🔍</span>
              <span className="hidden md:inline">Search</span>
              <span className="hidden lg:inline text-xs text-gray-500">Ctrl+K</span>
            </button>
            
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleModeChange("manual")}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition ${
                  mode === "manual" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => handleModeChange("autopilot")}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition ${
                  mode === "autopilot" ? "bg-green-600 text-white shadow" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Autopilot
              </button>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition border ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-300 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            >
              {isDarkMode ? '☀️' : '🌙'}
              <span className="hidden md:inline text-xs">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={() => setPanelOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
            >
              ☰ Open Control Panel
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <Link to="/settings" className="flex items-center gap-2 hover:opacity-80 transition">
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="text-right hidden md:block">
                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.community}</p>
                  </div>
                </Link>
              </div>
            )}
            {!user && (
              <Link
                to="/login"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Control Panel Overlay */}
      {panelOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setPanelOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl p-5 flex flex-col border-r border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">Navigation</p>
                <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Control Panel</h2>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xl font-bold"
                aria-label="Close panel"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto">
              {navigationConfig.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setPanelOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-800 transition"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{item.path}</span>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2">System Mode</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModeChange("manual")}
                  className={`flex-1 px-3 py-2 rounded-lg border font-semibold ${
                    mode === "manual"
                      ? "bg-white dark:bg-gray-800 border-green-600 text-green-700 dark:text-green-400 shadow"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => handleModeChange("autopilot")}
                  className={`flex-1 px-3 py-2 rounded-lg border font-semibold ${
                    mode === "autopilot"
                      ? "bg-green-600 border-green-600 text-white shadow"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Autopilot
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Manual requires human confirmations; Autopilot runs system playbooks for provisioning and resource balancing.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-6xl mx-auto p-6 w-full">{children}</main>

      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-auto pt-8 pb-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
        &copy; {new Date().getFullYear()} Sofie Systems. Operating System for Harmonic Habitats Communities Worldwide. 🌍
      </footer>
    </div>
  );
};

SystemShell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SystemShell;