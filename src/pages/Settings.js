// src/pages/Settings_v2.js - Glassmorphic Settings Panel

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard } from "../theme/GlassmorphismTheme";
import { useSettingsData } from "../hooks/useApi";

const Settings = () => {
  const authService = sofieCore.getService("auth");
  const currentUser = authService?.getCurrentUser?.();
  const { data: settingsData, loading, error, refetch } = useSettingsData(currentUser?.id);
  
  const [user, setUser] = useState(null);
  const [storageStats, setStorageStats] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (settingsData) {
      // Use API data
      setUser(settingsData.user || currentUser);
      setStorageStats(settingsData.storageStats || {});
    } else {
      // Fallback to sofieCore
      const storageService = sofieCore.getService("storage");
      setUser(currentUser);
      setStorageStats(storageService?.getStats?.() || {});
    }
  }, [settingsData, currentUser]);

  const handleLogout = () => {
    const authService = sofieCore.getService("auth");
    authService.logout();
    window.location.href = "/login";
  };

  const handleExportData = () => {
    const storageService = sofieCore.getService("storage");
    const exportData = storageService?.exportData?.();
    
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `harmonic-data-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      const storageService = sofieCore.getService("storage");
      storageService?.clear?.();
      alert("Data cleared");
      window.location.reload();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <div className="p-8 text-slate-700 dark:text-slate-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-slate-500 border-t-transparent rounded-full mr-3"></div>
            Loading settings...
          </div>
        </GlassCard>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center p-4">
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Settings</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-slate-600 dark:text-slate-300">Please log in to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }} elevation="high">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            ⚙️ Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Manage your account and system preferences</p>
        </GlassSection>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["profile", "storage", "system"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white"
                  : "bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/60"
              }`}
            >
              {tab === "profile" && "👤"} 
              {tab === "storage" && "💾"}
              {tab === "system" && "🔧"}
              {" " + tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{user.avatar || "👤"}</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <GlassCard colors={{ primary: "blue", secondary: "cyan" }}>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Role</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-2 capitalize">{user.role}</p>
              </GlassCard>
              <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Community</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">{user.community}</p>
              </GlassCard>
              <GlassCard colors={{ primary: "purple", secondary: "violet" }}>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Member Since</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">{new Date(user.joinDate).toLocaleDateString()}</p>
              </GlassCard>
              <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">User ID</p>
                <p className="font-mono text-xs text-slate-600 dark:text-slate-400 mt-2 break-all">{user.id}</p>
              </GlassCard>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-red-400 to-rose-500 text-white hover:shadow-lg transition-all"
            >
              Logout
            </button>
          </GlassSection>
        )}

        {/* Storage Tab */}
        {activeTab === "storage" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Data & Storage</h2>
            
            {storageStats && (
              <div className="mb-6 p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Data:</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(storageStats.total / 1024)}KB</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <button
                onClick={handleExportData}
                className="w-full px-4 py-3 rounded-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg transition-all"
              >
                Export Data
              </button>
              <button
                onClick={handleClearData}
                className="w-full px-4 py-3 rounded-lg font-bold border border-red-200/50 dark:border-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-400/10 transition-all"
              >
                Clear All Data
              </button>
            </div>

            <div className="p-3 rounded-lg bg-blue-400/20 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20">
              <p className="text-xs text-blue-900 dark:text-blue-300">ℹ️ Your data is encrypted and stored locally</p>
            </div>
          </GlassSection>
        )}

        {/* System Tab */}
        {activeTab === "system" && (
          <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">System Preferences</h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Automatic with system preference</p>
                  </div>
                  <input type="checkbox" disabled className="w-4 h-4" defaultChecked />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Web3 Integration</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Blockchain verified</p>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-bold">✓ Active</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/20 dark:bg-slate-800/20 border border-white/10 dark:border-slate-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Notifications</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Real-time system alerts</p>
                  </div>
                  <input type="checkbox" disabled className="w-4 h-4" defaultChecked />
                </div>
              </div>
            </div>
          </GlassSection>
        )}
      </div>
    </div>
  );
};

export default Settings;
