import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTint, FaLeaf, FaBolt, FaCloudSun, FaHeart, FaCog, FaGlobe } from "react-icons/fa";
import { glassPanel } from "../theme/glassTokens";
import "./PanelCarousel.css";

const RINGS = [
  { name: "Water", icon: <FaTint />, color: "#46c6ff", endpoint: "/api/water" },
  { name: "Energy", icon: <FaBolt />, color: "#f7c66b", endpoint: "/api/energy" },
  { name: "Climate", icon: <FaCloudSun />, color: "#5dd0b1", endpoint: "/api/climate" },
  { name: "Food", icon: <FaLeaf />, color: "#f5a873", endpoint: "/api/food" },
  { name: "Heartware", icon: <FaHeart />, color: "#ff5b6a", endpoint: "/api/heartware" },
  { name: "System", icon: <FaCog />, color: "#e8d3ba", endpoint: "/api/system" },
];

const MOCK_BRANCHES = {
  Water: [
    { name: "Recycling loop", route: "/water/recycling" },
    { name: "Potable quality", route: "/water/quality" },
    { name: "Usage analytics", route: "/water/usage" },
    { name: "Leak detection", route: "/water/leaks" },
    { name: "Irrigation plan", route: "/water/irrigation" },
  ],
  Energy: [
    { name: "Solar array", route: "/energy/solar" },
    { name: "Grid import/export", route: "/energy/grid" },
    { name: "Battery state", route: "/energy/battery" },
    { name: "Load shedding", route: "/energy/load" },
    { name: "Forecast & pricing", route: "/energy/forecast" },
  ],
  Climate: [
    { name: "Indoor climate", route: "/climate/indoor" },
    { name: "Outdoor forecast", route: "/climate/forecast" },
    { name: "Humidity balance", route: "/climate/humidity" },
    { name: "Air quality", route: "/climate/air" },
    { name: "Ventilation control", route: "/climate/ventilation" },
  ],
  Food: [
    { name: "Production", route: "/food/production" },
    { name: "Nutrition", route: "/food/nutrition" },
    { name: "Cold storage", route: "/food/storage" },
    { name: "Supply planning", route: "/food/planning" },
    { name: "Safety checks", route: "/food/safety" },
  ],
  Heartware: [
    { name: "Compassion", route: "/heartware/compassion" },
    { name: "Care", route: "/heartware/care" },
    { name: "Community", route: "/heartware/community" },
    { name: "Mutual aid", route: "/heartware/aid" },
    { name: "Wellbeing", route: "/heartware/wellbeing" },
  ],
  System: [
    { name: "Expansion", route: "/system/expansion" },
    { name: "Inventory", route: "/system/inventory" },
    { name: "IoT", route: "/system/iot" },
    { name: "Plugins", route: "/system/plugins" },
    { name: "Resilience", route: "/system/resilience" },
  ],
};

export default function PanelCarousel() {
  const [activeRing, setActiveRing] = useState(null);
  const [rotations, setRotations] = useState([0, 0, 0, 0, 0, 0]);
  const navigate = useNavigate();
  const location = useLocation();
  const activeRingData = activeRing !== null ? RINGS[activeRing] : null;
  const [displayText, setDisplayText] = useState("");
  const fullText = "S.O.F.I.E. Systems Global Network";

  // Check if returning from a branch page
  useEffect(() => {
    if (location.state?.activeRing !== undefined) {
      setActiveRing(location.state.activeRing);
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotations((prev) => [
        (prev[0] + 0.15) % 360,  // Ring 1 (Water): CW - 0.15 speed
        (prev[1] + 0.12) % 360,  // Ring 2 (Energy): CW - 0.12 speed
        (prev[2] + 0.18) % 360,  // Ring 3 (Climate): CW - 0.18 speed
        (prev[3] + 0.10) % 360,  // Ring 4 (Food): CW - 0.10 speed
        (prev[4] + 0.16) % 360,  // Ring 5 (Seeds): CW - 0.16 speed
        (prev[5] + 0.14) % 360,  // Ring 6 (System): CW - 0.14 speed
      ]);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    let index = 0;
    let typingInterval;
    let restartTimeout;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          restartTimeout = setTimeout(() => {
            index = 0;
            setDisplayText("");
            startTyping();
          }, 5000);
        }
      }, 100);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(restartTimeout);
    };
  }, []);

  const handleRingClick = (idx) => {
    console.log("Ring clicked:", idx, RINGS[idx].name);
    setActiveRing(idx);
  };

  return (
    <div className="panel-carousel-container">
      {/* Globe hub with typewriter text */}
      <div className="globe-hub" onClick={() => navigate("/global/map")}>
        <div className="globe-core">
          <FaGlobe className="globe-icon" />
        </div>
        <div className="band-text-top">{displayText}</div>
      </div>

      {/* Concentric rings with rotating icons */}
      <div className="orbital-rings">
        {RINGS.map((ring, idx) => {
          const ringNumber = idx + 1;
          const isActive = activeRing === idx;
          
          // Each icon orbits on its own ring at its own speed
          const speeds = [0.25, -0.20, 0.30, -0.18, 0.28, -0.22];
          const orbitAngle = (rotations[idx] * (speeds[idx] > 0 ? 1 : -1)) % 360;
          
          // Ring radii: each ring is 50px apart, starting from 225px (ring 1) to 350px (ring 6)
          const ringRadii = [225, 250, 275, 300, 325, 350];
          const radius = ringRadii[idx];

          return (
            <div
              key={ring.name}
              className={`orbital-ring ring-${ringNumber} ${isActive ? "active" : ""}`}
            >
              <button
                className={`ring-icon-holder ring-icon-${ringNumber}`}
                style={{ 
                  color: ring.color,
                  zIndex: isActive ? 1000 : 50 + idx,
                  transform: `rotate(${orbitAngle}deg) translateY(-${radius}px) rotate(${-orbitAngle}deg)`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRingClick(idx);
                }}
                aria-label={`${ring.name} - Click to view branches`}
                title={`Click to view ${ring.name} branches`}
              >
                <div className="ring-icon-only">{ring.icon}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active ring details panel */}
      {activeRingData && (
        <div
          className="active-ring-details"
          style={{
            ...glassPanel,
            background: `linear-gradient(135deg, ${activeRingData.color}22, rgba(210, 175, 135, 0.12))`,
            border: `1px solid ${activeRingData.color}66`,
            boxShadow: `0 10px 28px rgba(0, 0, 0, 0.28), 0 0 24px ${activeRingData.color}55, inset 0 0 16px rgba(255, 255, 255, 0.08)`,
          }}
        >
          <button
            className="details-home"
            onClick={() => setActiveRing(null)}
            aria-label="Close and return to rings"
            title="Close and return to rings"
            style={{ borderColor: `${activeRingData.color}66`, color: activeRingData.color }}
          >
            Close
          </button>
          <div className="details-header">
            <div className="details-icon" style={{ color: activeRingData.color }}>
              {activeRingData.icon}
            </div>
            <h2 className="details-title" style={{ color: activeRingData.color }}>
              {activeRingData.name}
            </h2>
          </div>
          <div className="branches-grid">
            {MOCK_BRANCHES[activeRingData.name].map((branch) => (
              <div
                key={branch.name}
                className="branch-item"
                style={{ border: `1px solid ${activeRingData.color}66`, background: `${activeRingData.color}14` }}
                onClick={() => navigate(branch.route, { state: { activeRing, ringName: activeRingData.name, ringColor: activeRingData.color } })}
              >
                <div
                  className="branch-circle"
                  style={{
                    border: `1px solid ${activeRingData.color}66`,
                    background: `${activeRingData.color}18`,
                    color: activeRingData.color,
                  }}
                >
                  {branch.name[0]}
                </div>
                <span className="branch-name">{branch.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
