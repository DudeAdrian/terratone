import React from "react";
import MainLayout from "../components/MainLayout";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Community Tools",
    path: "community",
    description: "Organize, connect, and empower community initiatives.",
  },
  {
    title: "Energy Systems",
    path: "energy",
    description: "Manage solar, battery, and off-grid solutions.",
  },
  {
    title: "AI Interfaces",
    path: "ai",
    description: "Deploy AI tools for communication, planning, and decision-making.",
  },
  {
    title: "Self-Sufficiency Layers",
    path: "sustainability",
    description: "Track food, water, housing, and local sustainability metrics.",
  },
];

const Services = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Sofie Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <Link to={`/services/${service.path}`} key={idx}>
              <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition">
                <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
