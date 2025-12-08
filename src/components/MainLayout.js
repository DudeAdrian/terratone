import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import navigationConfig from "../config/navigation";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Sofie Systems</div>
          <div className="flex gap-6">
            {navigationConfig.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-primary-100 transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-2">Sofie Systems</h3>
              <p className="text-sm">Empowering sustainable communities through intelligent resource management.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Quick Links</h3>
              <ul className="text-sm space-y-1">
                <li><a href="/services" className="hover:text-white transition">Services</a></li>
                <li><a href="/sustainability" className="hover:text-white transition">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Connect</h3>
              <p className="text-sm">Part of the Harmonic Habitats initiative</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center text-sm">
            <p>© 2025 Sofie Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;