/**
 * PluginRegistry - Central plugin management system for Harmonic Habitats OS
 * Manages plugin lifecycle: discovery, installation, activation, deregistration
 */

class PluginRegistry {
  constructor(sofieCore) {
    this.sofieCore = sofieCore;
    this.plugins = new Map();
    this.installedPlugins = new Map();
    this.pluginStates = new Map();
    this.eventListeners = new Map();
    this.logger = sofieCore.getService("logger");
  }

  /**
   * Register a plugin in the available plugins registry
   */
  registerPlugin(pluginId, pluginManifest) {
    if (this.plugins.has(pluginId)) {
      this.logger?.warn(`Plugin ${pluginId} already registered`);
      return false;
    }

    this.plugins.set(pluginId, {
      id: pluginId,
      ...pluginManifest,
      status: "available",
      installedAt: null,
      version: pluginManifest.version || "1.0.0",
    });

    this.logger?.info(`Plugin registered: ${pluginId} v${pluginManifest.version || "1.0.0"}`);
    return true;
  }

  /**
   * Install a plugin (add to installed plugins)
   */
  installPlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      this.logger?.error(`Plugin ${pluginId} not found in registry`);
      return false;
    }

    if (this.installedPlugins.has(pluginId)) {
      this.logger?.warn(`Plugin ${pluginId} already installed`);
      return false;
    }

    this.installedPlugins.set(pluginId, {
      ...plugin,
      status: "installed",
      installedAt: new Date().toISOString(),
      enabled: false,
    });

    this.pluginStates.set(pluginId, {});
    this.logger?.info(`Plugin installed: ${pluginId}`);
    this._emitEvent("plugin:installed", { pluginId });
    return true;
  }

  /**
   * Activate an installed plugin
   */
  async activatePlugin(pluginId, pluginClass) {
    const installed = this.installedPlugins.get(pluginId);
    if (!installed) {
      this.logger?.error(`Plugin ${pluginId} not installed`);
      return false;
    }

    try {
      const instance = new pluginClass(this.sofieCore, pluginId);
      
      if (instance.initialize) {
        await instance.initialize();
      }

      this.installedPlugins.set(pluginId, {
        ...installed,
        status: "active",
        enabled: true,
        instance,
      });

      this.logger?.info(`Plugin activated: ${pluginId}`);
      this._emitEvent("plugin:activated", { pluginId });
      return true;
    } catch (error) {
      this.logger?.error(`Failed to activate plugin ${pluginId}: ${error.message}`);
      return false;
    }
  }

  /**
   * Deactivate a plugin
   */
  deactivatePlugin(pluginId) {
    const installed = this.installedPlugins.get(pluginId);
    if (!installed || !installed.instance) {
      return false;
    }

    try {
      if (installed.instance.destroy) {
        installed.instance.destroy();
      }

      this.installedPlugins.set(pluginId, {
        ...installed,
        status: "installed",
        enabled: false,
        instance: null,
      });

      this.logger?.info(`Plugin deactivated: ${pluginId}`);
      this._emitEvent("plugin:deactivated", { pluginId });
      return true;
    } catch (error) {
      this.logger?.error(`Failed to deactivate plugin ${pluginId}: ${error.message}`);
      return false;
    }
  }

  /**
   * Uninstall a plugin
   */
  uninstallPlugin(pluginId) {
    const installed = this.installedPlugins.get(pluginId);
    if (!installed) {
      return false;
    }

    if (installed.instance) {
      this.deactivatePlugin(pluginId);
    }

    this.installedPlugins.delete(pluginId);
    this.pluginStates.delete(pluginId);
    this.logger?.info(`Plugin uninstalled: ${pluginId}`);
    this._emitEvent("plugin:uninstalled", { pluginId });
    return true;
  }

  /**
   * Get all available plugins
   */
  getAvailablePlugins() {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all installed plugins
   */
  getInstalledPlugins() {
    return Array.from(this.installedPlugins.values());
  }

  /**
   * Get active/enabled plugins
   */
  getActivePlugins() {
    return Array.from(this.installedPlugins.values()).filter((p) => p.enabled);
  }

  /**
   * Get single plugin
   */
  getPlugin(pluginId) {
    return this.installedPlugins.get(pluginId) || this.plugins.get(pluginId);
  }

  /**
   * Update plugin state
   */
  updatePluginState(pluginId, state) {
    const current = this.pluginStates.get(pluginId) || {};
    this.pluginStates.set(pluginId, { ...current, ...state });
    this._emitEvent("plugin:stateChanged", { pluginId, state });
  }

  /**
   * Get plugin state
   */
  getPluginState(pluginId) {
    return this.pluginStates.get(pluginId) || {};
  }

  /**
   * Event system for inter-plugin communication
   */
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  off(eventName, callback) {
    if (this.eventListeners.has(eventName)) {
      const listeners = this.eventListeners.get(eventName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  _emitEvent(eventName, data) {
    if (this.eventListeners.has(eventName)) {
      this.eventListeners.get(eventName).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.logger?.error(`Error in event listener for ${eventName}: ${error.message}`);
        }
      });
    }
  }

  /**
   * Get plugin API (safe API for plugins to use)
   */
  getPluginAPI(pluginId) {
    return {
      getService: (serviceName) => this.sofieCore.getService(serviceName),
      updateState: (state) => this.updatePluginState(pluginId, state),
      getState: () => this.getPluginState(pluginId),
      on: (eventName, callback) => this.on(eventName, callback),
      off: (eventName, callback) => this.off(eventName, callback),
      emit: (eventName, data) => this._emitEvent(eventName, data),
      log: (level, message) => this.logger?.[level](`[${pluginId}] ${message}`),
    };
  }
}

export default PluginRegistry;
