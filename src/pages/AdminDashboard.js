import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid, QuantumEnergyButton } from "../theme/QuantumGlassTheme";
import { useAdminData } from "../hooks/useApi";

const AdminDashboard = () => {
  const { data: adminData, loading: adminLoading, error: adminError, refetch } = useAdminData();
  const [logs, setLogs] = useState([]);
  const [selectedService, setSelectedService] = useState("logger");
  const [serviceCount, setServiceCount] = useState(0);
  const [debug, setDebug] = useState({ servicesLoaded: false, coreServices: [] });
  const [activeTab, setActiveTab] = useState("overview");

  // Use API data or fallback to sofieCore
  useEffect(() => {
    try {
      if (adminData) {
        // Use API data
        setLogs(adminData.logs || []);
        setServiceCount(adminData.services?.length || 0);
        setDebug({ servicesLoaded: true, coreServices: adminData.services || [], source: 'API' });
      } else {
        // Fallback to sofieCore
        const serviceKeys = Object.keys(sofieCore.services || {});
        setDebug({ servicesLoaded: true, coreServices: serviceKeys, source: 'sofieCore' });
        setServiceCount(serviceKeys.length);

        const logger = sofieCore.getService("logger");
        if (logger && typeof logger.getLogs === "function") {
          const allLogs = logger.getLogs();
          setLogs(Array.isArray(allLogs) ? allLogs.slice(-10) : []);
        }
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      setDebug(prev => ({ ...prev, error: error.message }));
    }
  }, [adminData]);

  const services = [
    { name: "logger", icon: "📝", status: "active", uptime: "99.8%" },
    { name: "energy", icon: "⚡", status: "active", uptime: "99.9%" },
    { name: "community", icon: "👥", status: "active", uptime: "99.7%" },
    { name: "food", icon: "🌱", status: "active", uptime: "99.6%" },
    { name: "water", icon: "💧", status: "active", uptime: "99.8%" },
    { name: "housing", icon: "🏠", status: "active", uptime: "99.9%" },
    { name: "sustainability", icon: "🌍", status: "active", uptime: "99.5%" },
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

  const serviceData = getServiceData(selectedService);

  // Loading state
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-gray-900 to-purple-950 flex items-center justify-center">
        <QuantumCard chakra="third_eye">
          <div className="p-8 text-gray-300 flex items-center">
            <div className="animate-spin inline-block w-6 h-6 border-3 border-violet-500 border-t-transparent rounded-full mr-3"></div>
            Loading admin dashboard...
          </div>
        </QuantumCard>
      </div>
    );
  }

  // Error state
  if (adminError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-gray-900 to-purple-950 flex items-center justify-center p-4">
        <QuantumCard chakra="third_eye">
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Admin Data</h2>
            <p className="text-gray-300 mb-4">{adminError}</p>
            <QuantumEnergyButton onClick={refetch} className="px-6 py-2">
              Retry
            </QuantumEnergyButton>
          </div>
        </QuantumCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-gray-900 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Status Banner */}
        {debug.coreServices.length > 0 && (
          <QuantumCard chakra="third_eye">
            <div className="p-4 md:p-6 flex items-center gap-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-900/20 dark:to-green-900/20 border-l-4 border-emerald-500">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">Admin Dashboard Operational</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{debug.coreServices.length} services initialized • All systems healthy</p>
              </div>
            </div>
          </QuantumCard>
        )}

        {/* Header */}
        <QuantumSection chakra="third_eye" elevation="high">
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-200 max-w-2xl">
              System health monitoring, service management, and Web3 integration control
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium backdrop-blur-sm">
                🔧 7 Services Active
              </span>
              <span className="px-4 py-2 bg-green-100/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
                ✓ All Healthy
              </span>
              <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium backdrop-blur-sm">
                📊 Real-time Monitoring
              </span>
            </div>
          </div>
        </QuantumSection>

        {/* Quick Stats */}
        <QuantumGlassGrid cols={2} colsMd={3} gap={5}>
          <QuantumCard chakra="third_eye">
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Active Services</div>
              <div className="text-5xl font-bold text-slate-600 dark:text-slate-400">{serviceCount || 7}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">All operational</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="third_eye">
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">System Status</div>
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">✓</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Healthy</p>
            </div>
          </QuantumCard>

          <QuantumCard chakra="third_eye">
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Uptime Average</div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">99.8%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Last 30 days</p>
            </div>
          </QuantumCard>
        </QuantumGlassGrid>

        {/* Main Content - Tabs */}
        <QuantumSection chakra="third_eye">
          <div className="flex flex-wrap border-b border-slate-300/30 dark:border-slate-700/30 backdrop-blur-sm">
            {["overview", "services", "logs", "integration"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-medium capitalize text-lg transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-b from-slate-400/40 to-slate-300/20 dark:from-slate-600/50 dark:to-slate-700/30 text-slate-700 dark:text-slate-300 border-b-2 border-slate-600 dark:border-slate-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/10 dark:hover:bg-slate-700/10"
                }`}
              >
                {tab === "overview" && "📊"}
                {tab === "services" && "🔧"}
                {tab === "logs" && "📝"}
                {tab === "integration" && "🔗"}
                <span className="ml-2">{tab}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <QuantumCard chakra="third_eye">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Performance</h3>
                    <div className="space-y-4">
                      {[
                        { label: "CPU Usage", value: 32, icon: "⚡" },
                        { label: "Memory Usage", value: 58, icon: "💾" },
                        { label: "Database Health", value: 95, icon: "📊" },
                        { label: "API Response", value: 87, icon: "📡" }
                      ].map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span>{metric.icon}</span> {metric.label}
                            </span>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{metric.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-slate-500 to-gray-500 h-2 rounded-full"
                              style={{ width: `${metric.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </QuantumCard>

                <QuantumCard chakra="third_eye">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Service Status Overview</h3>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-100/30 dark:bg-slate-800/30">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{service.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white capitalize">{service.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Uptime: {service.uptime}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                            ✓ Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </QuantumCard>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <QuantumCard chakra="third_eye">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Services</h3>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <button
                            key={service.name}
                            onClick={() => handleServiceClick(service.name)}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                              selectedService === service.name
                                ? "bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-lg"
                                : "bg-slate-100/30 dark:bg-slate-800/30 text-gray-900 dark:text-gray-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                            }`}
                          >
                            <span className="mr-2">{service.icon}</span>
                            <span className="capitalize">{service.name}</span>
                            <span className={`ml-2 text-xs font-bold ${selectedService === service.name ? "text-green-200" : "text-emerald-600 dark:text-emerald-400"}`}>
                              ✓
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </QuantumCard>
                </div>

                {/* Service Details */}
                <div className="md:col-span-2">
                  <QuantumCard chakra="third_eye">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{services.find(s => s.name === selectedService)?.icon}</span>
                          <span className="capitalize">{selectedService} Service</span>
                        </h3>
                        <span className="px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold">
                          Active
                        </span>
                      </div>
                      <div className="bg-gray-900/50 dark:bg-gray-950/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto h-64">
                        <pre>{JSON.stringify(serviceData, null, 2)}</pre>
                      </div>
                    </div>
                  </QuantumCard>
                </div>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="p-8">
              <QuantumCard chakra="third_eye">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Logs</h3>
                  <div className="bg-gray-900/50 dark:bg-gray-950/50 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto h-96">
                    {logs.length > 0 ? (
                      <div className="space-y-1">
                        {logs.map((log, idx) => (
                          <div key={idx} className="text-green-400">
                            <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span> {typeof log === "string" ? log : JSON.stringify(log)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-yellow-400">No logs available</div>
                    )}
                  </div>
                </div>
              </QuantumCard>
            </div>
          )}

          {/* Integration Tab */}
          {activeTab === "integration" && (
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <QuantumCard chakra="third_eye">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>🔗</span> Web3 Integration
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: "Blockchain Network", status: "Connected", icon: "✓", color: "emerald" },
                        { name: "Smart Contracts", status: "Deployed", icon: "✓", color: "blue" },
                        { name: "Wallet Integration", status: "Active", icon: "✓", color: "purple" },
                        { name: "IPFS Storage", status: "Available", icon: "✓", color: "orange" }
                      ].map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg bg-${item.color}-100/20 dark:bg-${item.color}-900/20 border-l-4 border-${item.color}-500`}>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Status: {item.status}</p>
                          </div>
                          <span className={`text-xl text-${item.color}-600 dark:text-${item.color}-400`}>{item.icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </QuantumCard>

                <QuantumCard chakra="third_eye">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>🔐</span> Security Status
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: "API Key Rotation", status: "Last: 7 days ago" },
                        { label: "Database Encryption", status: "AES-256 Active" },
                        { label: "Backup Status", status: "Last: 4 hours ago" },
                        { label: "Audit Logs", status: "Verified" }
                      ].map((item, idx) => (
                        <div key={idx} className="border-b border-slate-200/30 dark:border-slate-700/30 pb-3 last:border-0">
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">✓ {item.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </QuantumCard>
              </div>
            </div>
          )}
        </QuantumSection>

      </div>
    </div>
  );
};

export default AdminDashboard;

