import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./components/MainLayout";
import Services from "./pages/Services";
import Energy from "./pages/services/Energy";
import Community from "./pages/services/Community";
import SelfSufficiency from "./pages/SelfSufficiency";
import SystemShell from "./components/SystemShell";

// Block extensions trying to redefine ethereum
if (window.ethereum && Object.getOwnPropertyDescriptor(window, 'ethereum')?.configurable === false) {
  console.warn("Extension attempted to redefine window.ethereum — skipping.");
}

const App = () => {
  return (
    <Router>
      <SystemShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/services"
            element={
              <MainLayout>
                <Services />
              </MainLayout>
            }
          />
          <Route path="/services/energy" element={<Energy />} />
          <Route path="/services/community" element={<Community />} />
          <Route path="/sustainability" element={<SelfSufficiency />} />
        </Routes>
      </SystemShell>
    </Router>
  );
};

export default App;