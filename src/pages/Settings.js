import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [storageStats, setStorageStats] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const authService = sofieCore.getService("auth");
    const storageService = sofieCore.getService("storage");

    setUser(authService.getCurrentUser());
    setStorageStats(storageService.getStats());
  }, []);

  const handleLogout = () => {
    const authService = sofieCore.getService("auth");
    authService.logout();
    window.location.href = "/login";
  };

  const handleExportData = () => {
    const storageService = sofieCore.getService("storage");
    const exportData = storageService.exportData();
    
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
    if (window.confirm("Are you sure you want to clear all local data? This cannot be undone.")) {
      const storageService = sofieCore.getService("storage");
      storageService.clear();
      alert("All local data cleared successfully");
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to access settings</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">⚙️ Settings</h1>
        <p className="text-lg text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "profile" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("storage")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "storage" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Data & Storage
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "system" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          System
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{user.avatar}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-bold text-gray-800 capitalize">{user.role}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Community</p>
                <p className="font-bold text-gray-800">{user.community}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-bold text-gray-800">{new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono text-sm text-gray-600">{user.id}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      )}

      {activeTab === "storage" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Data & Storage Management</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
              <div className="text-sm font-semibold text-green-600 uppercase">Stored Items</div>
              <div className="text-3xl font-bold text-gray-800 mt-2">{storageStats.itemCount || 0}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-l-4 border-emerald-600">
              <div className="text-sm font-semibold text-emerald-600 uppercase">Storage Used</div>
              <div className="text-3xl font-bold text-gray-800 mt-2">{storageStats.sizeKB || 0} KB</div>
            </div>
            <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg p-6 border-l-4 border-lime-600">
              <div className="text-sm font-semibold text-lime-600 uppercase">Status</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {storageStats.available ? "✓ Active" : "⚠ Inactive"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              📦 Export All Data (JSON)
            </button>

            <button
              onClick={handleClearData}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition ml-0 md:ml-3"
            >
              🗑️ Clear All Local Data
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> All data is currently stored locally in your browser. Enable cloud sync to backup
              data across devices.
            </p>
          </div>
        </div>
      )}

      {activeTab === "system" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Information</h2>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-600">Platform Version</p>
              <p className="font-bold text-gray-800">Sofie Systems v1.0.0</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="font-bold text-gray-800">25 services running</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-600">Installed Plugins</p>
              <p className="font-bold text-gray-800">5 plugins available</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-600">Browser</p>
              <p className="font-mono text-sm text-gray-600">{navigator.userAgent}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
