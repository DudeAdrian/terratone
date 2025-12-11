import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { SofieProvider } from "./context/SofieContext";
import RegionProvider from "./context/RegionContext";
import ApiStatusMonitor from "./components/ApiStatusMonitor";

import PanelCarousel from "./pages/PanelCarousel";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import Energy from "./pages/services/Energy";
import Community from "./pages/services/Community";
import SelfSufficiency from "./pages/SelfSufficiency";
import SystemDashboard from "./pages/SystemDashboard";
import AlertCenter from "./pages/AlertCenter";
import SetupWizard from "./pages/SetupWizard";
import GlobalMap from "./pages/GlobalMap";
import SystemShell from "./components/SystemShellTouchOS";
import WaterRecycling from "./pages/water/WaterRecycling";
import WaterQuality from "./pages/water/WaterQuality";
import WaterUsage from "./pages/water/WaterUsage";
import WaterLeaks from "./pages/water/WaterLeaks";
import WaterIrrigation from "./pages/water/WaterIrrigation";
import EnergySolar from "./pages/energy/EnergySolar";
import EnergyGrid from "./pages/energy/EnergyGrid";
import EnergyBattery from "./pages/energy/EnergyBattery";
import EnergyLoad from "./pages/energy/EnergyLoad";
import EnergyForecast from "./pages/energy/EnergyForecast";
import ClimateIndoor from "./pages/climate/ClimateIndoor";
import ClimateForecast from "./pages/climate/ClimateForecast";
import ClimateHumidity from "./pages/climate/ClimateHumidity";
import ClimateAir from "./pages/climate/ClimateAir";
import ClimateVentilation from "./pages/climate/ClimateVentilation";
import FoodProduction from "./pages/food/FoodProduction";
import FoodNutrition from "./pages/food/FoodNutrition";
import FoodStorage from "./pages/food/FoodStorage";
import FoodSafety from "./pages/food/FoodSafety";
import FoodPlanning from "./pages/food/FoodPlanning";
import Expansion from "./pages/Expansion";
import PluginMarketplace from "./pages/PluginMarketplace";
import Resilience from "./pages/Resilience";
import Inventory from "./pages/Inventory";
import IoT from "./pages/IoT";
import GlobalNetwork from "./pages/GlobalNetwork";
import GlobalBenchmarks from "./pages/GlobalBenchmarks";
import ImpactBenchmarks from "./pages/ImpactBenchmarks";
import HerbalLibrary from "./pages/HerbalLibrary";
import SeedBank from "./pages/SeedBank";
import HarvestForecast from "./pages/HarvestForecast";
import PestManagement from "./pages/PestManagement";
import ApiIntegrationDemo from "./components/ApiIntegrationDemo";

// Block extensions trying to redefine ethereum
if (window.ethereum && Object.getOwnPropertyDescriptor(window, 'ethereum')?.configurable === false) {
  console.warn("Extension attempted to redefine window.ethereum — skipping.");
}

const PanelWrapper = ({ children }) => {
  const location = useLocation();
  const isPanelView = location.pathname === "/" || location.pathname === "/panel";
  
  if (isPanelView) {
    return children;
  }
  
  return <SystemShell>{children}</SystemShell>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <SofieProvider>
        <RegionProvider>
          <Router>
            <ApiStatusMonitor position="top-right" />
            <PanelWrapper>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PanelCarousel />} />
                <Route path="/panel" element={<PanelCarousel />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/api-demo" element={<ApiIntegrationDemo />} />
                <Route path="/dashboard" element={<SystemDashboard />} />
                <Route path="/alerts" element={<AlertCenter />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/energy" element={<Energy />} />
                <Route path="/services/community" element={<Community />} />
                <Route path="/sustainability" element={<SelfSufficiency />} />
                <Route path="/map" element={<GlobalMap />} />
                <Route path="/water/recycling" element={<WaterRecycling />} />
                <Route path="/water/quality" element={<WaterQuality />} />
                <Route path="/water/usage" element={<WaterUsage />} />
                <Route path="/water/leaks" element={<WaterLeaks />} />
                <Route path="/water/irrigation" element={<WaterIrrigation />} />
                <Route path="/energy/solar" element={<EnergySolar />} />
                <Route path="/energy/grid" element={<EnergyGrid />} />
                <Route path="/energy/battery" element={<EnergyBattery />} />
                <Route path="/energy/load" element={<EnergyLoad />} />
                <Route path="/energy/forecast" element={<EnergyForecast />} />
                <Route path="/climate/indoor" element={<ClimateIndoor />} />
                <Route path="/climate/forecast" element={<ClimateForecast />} />
                <Route path="/climate/humidity" element={<ClimateHumidity />} />
                <Route path="/climate/air" element={<ClimateAir />} />
                <Route path="/climate/ventilation" element={<ClimateVentilation />} />
                <Route path="/food/production" element={<FoodProduction />} />
                <Route path="/food/nutrition" element={<FoodNutrition />} />
                <Route path="/food/storage" element={<FoodStorage />} />
                <Route path="/food/safety" element={<FoodSafety />} />
                <Route path="/food/planning" element={<FoodPlanning />} />
                <Route path="/system/expansion" element={<Expansion />} />
                <Route path="/system/inventory" element={<Inventory />} />
                <Route path="/system/iot" element={<IoT />} />
                <Route path="/system/plugins" element={<PluginMarketplace />} />
                <Route path="/system/resilience" element={<Resilience />} />
                <Route path="/global/network" element={<GlobalNetwork />} />
                <Route path="/global/benchmarks" element={<GlobalBenchmarks />} />
                <Route path="/global/impact" element={<ImpactBenchmarks />} />
                <Route path="/global/herbal-library" element={<HerbalLibrary />} />
                <Route path="/global/seedbank" element={<SeedBank />} />
                <Route path="/global/harvest-forecast" element={<HarvestForecast />} />
                <Route path="/global/pest-management" element={<PestManagement />} />
              </Routes>
            </PanelWrapper>
          </Router>
        </RegionProvider>
      </SofieProvider>
    </ErrorBoundary>
  );
};

export default App;