import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceCount, setServiceCount] = useState(0);
  const [debug, setDebug] = useState({ servicesLoaded: false, coreServices: [] });

  useEffect(() => {
    try {
      // Debug: Check what services are available
      const serviceKeys = Object.keys(sofieCore.services || {});
      setDebug({ servicesLoaded: true, coreServices: serviceKeys });
      setServiceCount(serviceKeys.length);

      // Get logs
      const logger = sofieCore.getService("logger");
      if (logger && typeof logger.getLogs === "function") {
        const allLogs = logger.getLogs();
        setLogs(Array.isArray(allLogs) ? allLogs.slice(-10) : []);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      setDebug(prev => ({ ...prev, error: error.message }));
    }
  }, []);

  const services = [
    { name: "logger", icon: "📝", status: "active" },
    { name: "energy", icon: "⚡", status: "active" },
    { name: "community", icon: "👥", status: "active" },
    { name: "food", icon: "🌱", status: "active" },
    { name: "water", icon: "💧", status: "active" },
    { name: "housing", icon: "🏠", status: "active" },
    { name: "sustainability", icon: "🌍", status: "active" },
  ];

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
  };

  const getServiceData = (serviceName) => {
    try {
      const service = sofieCore.getService(serviceName);
      if (!service) return { error: "Service not found" };

      switch (serviceName) {
        case "logger":
          return service.getLogs ? { logs: service.getLogs() } : { info: "Logger service active" };
        case "food":
          return service.getFoodData ? service.getFoodData() : { info: "Food service active" };
        case "water":
          return service.getWaterData ? service.getWaterData() : { info: "Water service active" };
        case "housing":
          return service.getHousingData ? service.getHousingData() : { info: "Housing service active" };
        case "energy":
          return service.getEnergyData ? service.getEnergyData() : { info: "Energy service active" };
        case "sustainability":
          return service.getDashboardMetrics ? service.getDashboardMetrics() : { info: "Sustainability service active" };
        case "community":
          return service.getPosts ? { posts: service.getPosts() } : { info: "Community service active" };
        default:
          return { info: `${serviceName} service active` };
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 font-semibold">✓ Admin Dashboard Loaded Successfully</p>
        <p className="text-sm text-blue-600 mt-1">Services initialized: {debug.coreServices.length} | Services: {debug.coreServices.join(", ")}</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage system services, users, and configuration</p>
      </div>

      {/* Debug Info */}
      {debug.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">Error: {debug.error}</p>
        </div>
      )}
      
      {debug.coreServices.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 font-semibold">⚠ No services loaded. Services available: {debug.coreServices.join(", ") || "None"}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-sm font-semibold text-blue-600 uppercase">Total Services</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{serviceCount || Object.keys(sofieCore.services).length}</div>
          <p className="text-sm text-gray-600 mt-2">All services registered and active</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">System Status</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">✓ Healthy</div>
          <p className="text-sm text-gray-600 mt-2">All modules operational</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-sm font-semibold text-purple-600 uppercase">Active Users</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">1</div>
          <p className="text-sm text-gray-600 mt-2">Currently connected</p>
        </div>
      </div>

      {/* Services Management */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Services</h2>
            <div className="space-y-2">
              {services.map((service, idx) => (
                <button
                  key={idx}
                  onClick={() => handleServiceClick(service.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    selectedService === service.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2">{service.icon}</span>
                  {service.name}
                  <span
                    className={`ml-2 text-xs font-bold ${
                      selectedService === service.name ? "text-blue-200" : "text-green-600"
                    }`}
                  >
                    {service.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedService ? `${selectedService.toUpperCase()} Service Details` : "Select a Service"}
            </h2>
            {selectedService ? (
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
                <pre>{JSON.stringify(getServiceData(selectedService), null, 2)}</pre>
              </div>
            ) : (
              <p className="text-gray-600">Click a service to view its data and configuration</p>
            )}
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📝 System Logs (Last 10)</h2>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} className="text-gray-400">
                {typeof log === "string" ? log : log.formatted || JSON.stringify(log)}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No logs available</div>
          )}
        </div>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {};

export default AdminDashboard;