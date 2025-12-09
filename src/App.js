import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { SofieProvider } from "./context/SofieContext";
import RegionProvider from "./context/RegionContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import Energy from "./pages/services/Energy";
import Community from "./pages/services/Community";
import SelfSufficiency from "./pages/SelfSufficiency";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import CommunityNetwork from "./pages/CommunityNetwork";
import ImpactBenchmarks from "./pages/ImpactBenchmarks";
import KnowledgeBase from "./pages/KnowledgeBase";
import Governance from "./pages/Governance";
import Resilience from "./pages/Resilience";
import Wellness from "./pages/Wellness";
import Expansion from "./pages/Expansion";
import SeedBank from "./pages/SeedBank";
import GlobalNetwork from "./pages/GlobalNetwork";
import HarvestForecast from "./pages/HarvestForecast";
import PestManagement from "./pages/PestManagement";
import WaterRecyclingMonitor from "./pages/WaterRecyclingMonitor";
import AquaticLifeDatabase from "./pages/AquaticLifeDatabase";
import AutopilotMode from "./pages/AutopilotMode";
import NutritionOptimization from "./pages/NutritionOptimization";
import ClimateSettings from "./pages/ClimateSettings";
import SystemDashboard from "./pages/SystemDashboard";
import AlertCenter from "./pages/AlertCenter";
import SetupWizard from "./pages/SetupWizard";
import PluginMarketplace from "./pages/PluginMarketplace";
import IoT from "./pages/IoT";
import ImpactTracking from "./pages/ImpactTracking";
import HerbalLibrary from "./pages/HerbalLibrary";
import Predictions from "./pages/Predictions";
import GlobalBenchmarks from "./pages/GlobalBenchmarks";
import SystemShell from "./components/SystemShell";

// Block extensions trying to redefine ethereum
if (window.ethereum && Object.getOwnPropertyDescriptor(window, 'ethereum')?.configurable === false) {
  console.warn("Extension attempted to redefine window.ethereum — skipping.");
}

const App = () => {
  return (
    <ErrorBoundary>
      <SofieProvider>
        <RegionProvider>
          <Router>
            <SystemShell>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/setup" element={<SetupWizard />} />
                <Route path="/dashboard" element={<SystemDashboard />} />
                <Route path="/alerts" element={<AlertCenter />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/energy" element={<Energy />} />
                <Route path="/services/community" element={<Community />} />
                <Route path="/sustainability" element={<SelfSufficiency />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/communities" element={<CommunityNetwork />} />
                <Route path="/impact" element={<ImpactBenchmarks />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/resilience" element={<Resilience />} />
                <Route path="/wellness" element={<Wellness />} />
                <Route path="/expansion" element={<Expansion />} />
                <Route path="/seedbank" element={<SeedBank />} />
                <Route path="/global-network" element={<GlobalNetwork />} />
                <Route path="/global-benchmarks" element={<GlobalBenchmarks />} />
                <Route path="/harvest-forecast" element={<HarvestForecast />} />
                <Route path="/pest-management" element={<PestManagement />} />
                <Route path="/water-recycling" element={<WaterRecyclingMonitor />} />
                <Route path="/aquatic-life" element={<AquaticLifeDatabase />} />
                <Route path="/autopilot" element={<AutopilotMode />} />
                <Route path="/nutrition-optimization" element={<NutritionOptimization />} />
                <Route path="/climate-settings" element={<ClimateSettings />} />
                <Route path="/plugins" element={<PluginMarketplace />} />
                <Route path="/iot" element={<IoT />} />
                <Route path="/impact-tracking" element={<ImpactTracking />} />
                <Route path="/herbal-library" element={<HerbalLibrary />} />
                <Route path="/predictions" element={<Predictions />} />
              </Routes>
            </SystemShell>
          </Router>
        </RegionProvider>
      </SofieProvider>
    </ErrorBoundary>
  );
};

export default App;