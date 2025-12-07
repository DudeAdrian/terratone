// src/pages/Map.js

import React from "react";
import { Link } from "react-router-dom";
import SystemShell from "../components/SystemShell";

const modules = [
  { title: "Community Tools", path: "/services/community", color: "bg-indigo-100" },
  { title: "Energy Systems", path: "/services/energy", color: "bg-yellow-100" },
  { title: "AI Interfaces", path: "/services/ai", color: "bg-green-100" },
  { title: "Sustainability Layers", path: "/services/sustainability", color: "bg-blue-100" },
  { title: "Admin Dashboard", path: "/admin", color: "bg-gray-100" },
];

const Map = () => {
  return (
    <SystemShell>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Sofie Systems Map</h1>
        <p className="text-gray-600 mt-2">Navigate your operating system</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((mod, i) => (
          <Link key={i} to={mod.path}>
            <div className={`p-6 rounded-xl shadow hover:shadow-xl transition ${mod.color}`}>
              <h2 className="text-2xl font-semibold">{mod.title}</h2>
              <p className="text-sm text-gray-600 mt-1">Go to {mod.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </SystemShell>
  );
};

export default Map;
