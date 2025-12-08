import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const Wellness = () => {
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const wellnessService = sofieCore.getService("wellness");
    if (wellnessService) {
      setPrograms(wellnessService.getWellnessPrograms());
      setEvents(wellnessService.getCommunityEvents());
      setResources(wellnessService.getWellnessResources());
      setStats(wellnessService.getWellnessStats());
    }
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🧘 Community Wellness</h1>
        <p className="text-lg text-gray-600">Health, wellbeing, and community connection programs</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-sm font-semibold text-blue-600 uppercase">Active Programs</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.activePrograms || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="text-sm font-semibold text-green-600 uppercase">Participants</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalParticipants || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-sm font-semibold text-purple-600 uppercase">Events</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.upcomingEvents || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
          <div className="text-sm font-semibold text-orange-600 uppercase">Wellness Score</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats.wellnessScore || 0}%</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">
              {program.type === "physical" && "🏃"}
              {program.type === "mental" && "🧠"}
              {program.type === "educational" && "📖"}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{program.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{program.description}</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Frequency:</strong> {program.frequency}</p>
              <p><strong>Participants:</strong> {program.participants}</p>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Join Program
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Upcoming Community Events</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {events.map((event) => (
          <div key={event.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">{event.name}</h3>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full capitalize">{event.type}</span>
            </div>
            <p className="text-gray-600 mb-4">📅 {event.date}</p>
            <p className="text-sm text-gray-600 mb-4">👥 {event.participants} registered</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">
              Register
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">💚 Wellness Resources</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.name}</h3>
            <p className="text-sm text-gray-600 mb-3 capitalize">{resource.type}</p>
            <div className="flex items-center">
              {resource.available ? (
                <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  ✓ Available
                </span>
              ) : (
                <span className="inline-block bg-gray-400 text-white text-xs px-3 py-1 rounded-full font-bold">
                  Not Available
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wellness;
