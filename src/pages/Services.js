import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Community Tools",
      path: "community",
      description: "Organize, connect, and empower community initiatives.",
      icon: "👥",
      color: "blue",
    },
    {
      title: "Energy Systems",
      path: "energy",
      description: "Manage solar, battery, and off-grid solutions.",
      icon: "⚡",
      color: "yellow",
    },
    {
      title: "AI Interfaces",
      path: "ai",
      description: "Deploy AI tools for communication, planning, and decision-making.",
      icon: "🧠",
      color: "purple",
    },
    {
      title: "Self-Sufficiency",
      path: "/sustainability",
      description: "Track food, water, housing, and local sustainability metrics.",
      icon: "🌍",
      color: "green",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Services Hub</h1>
        <p className="text-lg text-gray-600">Access all Sofie Systems modules and tools</p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <Link key={idx} to={service.path}>
            <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition transform hover:scale-105 h-full cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{service.icon}</div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${service.color}-100 text-${service.color}-700`}>
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-blue-600 font-semibold">Access →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

Services.propTypes = {};

export default Services;