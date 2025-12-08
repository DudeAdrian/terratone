import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const PluginMarketplace = () => {
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stats, setStats] = useState({});

  useEffect(() => {
    const pluginRegistry = sofieCore.getService("pluginRegistry");
    if (pluginRegistry) {
      setAvailablePlugins(pluginRegistry.getAvailablePlugins());
      setInstalledPlugins(pluginRegistry.getInstalledPlugins());
      setStats({
        available: pluginRegistry.getAvailablePlugins().length,
        installed: pluginRegistry.getInstalledPlugins().length,
        active: pluginRegistry.getActivePlugins().length,
      });
    }
  }, []);

  const handleInstallPlugin = (pluginId) => {
    const pluginRegistry = sofieCore.getService("pluginRegistry");
    if (pluginRegistry) {
      const success = pluginRegistry.installPlugin(pluginId);
      if (success) {
        setInstalledPlugins(pluginRegistry.getInstalledPlugins());
        setStats({
          available: pluginRegistry.getAvailablePlugins().length,
          installed: pluginRegistry.getInstalledPlugins().length,
          active: pluginRegistry.getActivePlugins().length,
        });
      }
    }
  };

  const handleActivatePlugin = async (pluginId) => {
    const pluginRegistry = sofieCore.getService("pluginRegistry");
    if (pluginRegistry) {
      let PluginClass;
      switch (pluginId) {
        case "weather":
          const WeatherPlugin = await import("../plugins/WeatherPlugin").then((m) => m.default);
          PluginClass = WeatherPlugin;
          break;
        case "iot-devices":
          const IoTPlugin = await import("../plugins/IoTDevicesPlugin").then((m) => m.default);
          PluginClass = IoTPlugin;
          break;
        case "smart-alerts":
          const AlertsPlugin = await import("../plugins/SmartAlertsPlugin").then((m) => m.default);
          PluginClass = AlertsPlugin;
          break;
        case "skills-directory":
          const SkillsPlugin = await import("../plugins/SkillsDirectoryPlugin").then((m) => m.default);
          PluginClass = SkillsPlugin;
          break;
        default:
          return;
      }

      const success = await pluginRegistry.activatePlugin(pluginId, PluginClass);
      if (success) {
        setInstalledPlugins(pluginRegistry.getInstalledPlugins());
      }
    }
  };

  const handleUninstallPlugin = (pluginId) => {
    const pluginRegistry = sofieCore.getService("pluginRegistry");
    if (pluginRegistry) {
      const success = pluginRegistry.uninstallPlugin(pluginId);
      if (success) {
        setInstalledPlugins(pluginRegistry.getInstalledPlugins());
        setStats({
          available: pluginRegistry.getAvailablePlugins().length,
          installed: pluginRegistry.getInstalledPlugins().length,
          active: pluginRegistry.getActivePlugins().length,
        });
      }
    }
  };

  const isPluginInstalled = (pluginId) => {
    return installedPlugins.some((p) => p.id === pluginId);
  };

  const isPluginActive = (pluginId) => {
    return installedPlugins.some((p) => p.id === pluginId && p.enabled);
  };

  const filteredPlugins =
    selectedCategory === "all" ? availablePlugins : availablePlugins.filter((p) => p.category === selectedCategory);

  const categories = ["all", "integration", "automation", "analytics", "community"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🔌 Plugin Marketplace</h1>
        <p className="text-lg text-gray-600">Extend Sofie Systems with powerful plugins for Harmonic Habitats communities</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">Available</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.available || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
          <div className="text-sm font-semibold text-emerald-600 uppercase">Installed</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.installed || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg shadow-md p-6 border-l-4 border-lime-600">
          <div className="text-sm font-semibold text-lime-600 uppercase">Active</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.active || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-md p-6 border-l-4 border-teal-600">
          <div className="text-sm font-semibold text-teal-600 uppercase">System Health</div>
          <div className="text-3xl font-bold text-green-600 mt-2">✓ Optimal</div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat === "all" ? "All Plugins" : cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredPlugins.map((plugin) => {
          const installed = isPluginInstalled(plugin.id);
          const active = isPluginActive(plugin.id);

          return (
            <div
              key={plugin.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-green-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-4xl mb-2">{plugin.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{plugin.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{plugin.category}</p>
                </div>
                <div className="text-right">
                  {active && (
                    <div className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
                      ✓ Active
                    </div>
                  )}
                  {installed && !active && (
                    <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold">
                      Installed
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4">{plugin.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">v{plugin.version}</span>
                {plugin.rating && (
                  <span className="text-sm text-yellow-500">⭐ {plugin.rating} ({plugin.downloads} downloads)</span>
                )}
              </div>

              <div className="space-y-2">
                {!installed ? (
                  <button
                    onClick={() => handleInstallPlugin(plugin.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    Install Plugin
                  </button>
                ) : (
                  <>
                    {!active ? (
                      <button
                        onClick={() => handleActivatePlugin(plugin.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg cursor-default opacity-75"
                      >
                        ✓ Active
                      </button>
                    )}
                    <button
                      onClick={() => handleUninstallPlugin(plugin.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Uninstall
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-green-50 rounded-lg shadow-md p-8 border-l-4 border-green-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Plugin Development</h2>
        <p className="text-gray-700 mb-4">
          Create custom plugins to extend Sofie Systems. All plugins integrate with SofieCore and have access to system services, state management, and UI components.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-green-300">
            <h3 className="font-bold text-green-700 mb-2">🏗️ Build</h3>
            <p className="text-sm text-gray-600">Use our plugin SDK and React hooks to build extensions</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-300">
            <h3 className="font-bold text-green-700 mb-2">🚀 Deploy</h3>
            <p className="text-sm text-gray-600">Share your plugin in the marketplace for others to use</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-300">
            <h3 className="font-bold text-green-700 mb-2">💰 Earn</h3>
            <p className="text-sm text-gray-600">Build reputation and earn community credits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginMarketplace;
