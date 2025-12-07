// src/components/SystemShell.js

import React from "react";
import { Link } from "react-router-dom";
import sofieCore from "../core/SofieCore";

const SystemShell = ({ children }) => {
  React.useEffect(() => {
    sofieCore.init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 text-center">
        <h1 className="text-3xl font-bold">Sofie Systems OS</h1>
        <p className="text-gray-500">Empowering Harmonic Habitats</p>
      </header>

      {/* 🔗 NAVIGATION BAR */}
      <nav className="bg-blue-600 text-white p-3 flex justify-center space-x-6 font-medium">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/services/energy">Energy</Link>
        <Link to="/services/community">Community</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <main className="max-w-6xl mx-auto p-6">{children}</main>

      <footer className="text-center text-sm text-gray-400 mt-10 pb-4">
        &copy; {new Date().getFullYear()} Sofie Systems
      </footer>
    </div>
  );
};

export default SystemShell;
