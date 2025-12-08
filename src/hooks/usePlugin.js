import { useContext } from "react";
import { SofieContext } from "../context/SofieContext";

/**
 * Hook for plugins to access Harmonic Habitats OS APIs
 * Usage: const { getService, updateState, on, off } = usePlugin();
 */
export const usePlugin = () => {
  const { sofieCore } = useContext(SofieContext);

  return {
    /**
     * Get a service from SofieCore
     */
    getService: (serviceName) => {
      return sofieCore?.getService(serviceName);
    },

    /**
     * Get the plugin registry
     */
    getPluginRegistry: () => {
      return sofieCore?.getService("pluginRegistry");
    },

    /**
     * Subscribe to service state changes
     */
    useServiceState: (serviceName, key) => {
      const service = sofieCore?.getService(serviceName);
      return service?.getState?.(key);
    },

    /**
     * Call a service method
     */
    callService: async (serviceName, methodName, ...args) => {
      const service = sofieCore?.getService(serviceName);
      if (service && typeof service[methodName] === "function") {
        return service[methodName](...args);
      }
      return null;
    },

    /**
     * Listen to plugin events
     */
    onPluginEvent: (eventName, callback) => {
      const registry = sofieCore?.getService("pluginRegistry");
      registry?.on(eventName, callback);
    },

    /**
     * Emit a plugin event
     */
    emitPluginEvent: (eventName, data) => {
      const registry = sofieCore?.getService("pluginRegistry");
      registry?._emitEvent(eventName, data);
    },
  };
};

export default usePlugin;
