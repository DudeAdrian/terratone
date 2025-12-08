import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FeatureCard = ({ feature }) => (
  <Link to={feature.link}>
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105 p-6 h-full cursor-pointer border border-gray-100">
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
      <p className="text-gray-600 text-sm">{feature.description}</p>
      <div className="mt-4 text-primary-600 font-semibold text-sm">Explore →</div>
    </div>
  </Link>
);

FeatureCard.propTypes = {
  feature: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

const Home = () => {
  const features = [
    {
      icon: "⚡",
      title: "Energy Systems",
      description: "Monitor solar production, battery levels, and grid balance in real-time.",
      link: "/services/energy",
    },
    {
      icon: "👥",
      title: "Community",
      description: "Connect, collaborate, and empower your local community.",
      link: "/services/community",
    },
    {
      icon: "🌍",
      title: "Sustainability",
      description: "Track food, water, housing, and environmental metrics.",
      link: "/sustainability",
    },
    {
      icon: "⚙️",
      title: "Admin",
      description: "Manage users, settings, and system configuration.",
      link: "/admin",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-12 p-8">
        <h1 className="text-5xl font-bold text-green-800 mb-4">Sofie Systems</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Operating System for Harmonic Habitats communities. Empowering sustainable living through integrated systems, collaborative networks, and intelligent resource management.
        </p>
        <p className="text-lg text-green-600 font-semibold">The benchmark operating system for regenerative living</p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature) => (
          <FeatureCard key={feature.link} feature={feature} />
        ))}
      </div>

      {/* Key Metrics */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">System Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">♻️</div>
            <h3 className="text-lg font-semibold text-gray-700">Sustainable</h3>
            <p className="text-gray-600">Zero-waste living solutions</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-600 mb-2">🤝</div>
            <h3 className="text-lg font-semibold text-gray-700">Connected</h3>
            <p className="text-gray-600">Community-driven development</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-gray-700">Intelligent</h3>
            <p className="text-gray-600">AI-powered optimization</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-lg mb-6 opacity-90">Start tracking your sustainability metrics today.</p>
        <Link
          to="/sustainability"
          className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
        >
          Launch Sustainability Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;