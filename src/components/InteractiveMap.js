import React, { useEffect, useRef, useState } from 'react';
import MapProjection from '../services/MapProjection';
import GeoDataService from '../services/GeoDataService';

const InteractiveMap = ({ communities, onCommunitySelect, defaultLayer = 'health' }) => {
  const canvasRef = useRef(null);
  const [currentLayer, setCurrentLayer] = useState(defaultLayer);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [hoveredCommunity, setHoveredCommunity] = useState(null);

  const projectionRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentLayer(defaultLayer);
  }, [defaultLayer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const projection = new MapProjection(canvas.width, canvas.height);
    projectionRef.current = projection;

    // Fetch and load world.geo.json
    if (GeoDataService.status === 'idle') {
      GeoDataService.initialize();
      
      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(geojson => {
          GeoDataService.loadFeatures(geojson);
          draw();
        })
        .catch(error => {
          console.warn('[InteractiveMap] Could not load world.geo.json:', error);
          console.log('[InteractiveMap] Falling back to community-only rendering');
          draw();
        });
    }

    // Event listeners
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        projection.pan(deltaX, deltaY);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Check hover
        let found = null;
        for (let community of communities) {
          const proj = projection.project(community.lat, community.lng);
          const dist = Math.sqrt(Math.pow(x - proj.x, 2) + Math.pow(y - proj.y, 2));
          if (dist < 15) {
            found = community;
            break;
          }
        }
        setHoveredCommunity(found);
      }

      draw();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = null;
      for (let community of communities) {
        const proj = projection.project(community.lat, community.lng);
        const dist = Math.sqrt(Math.pow(x - proj.x, 2) + Math.pow(y - proj.y, 2));
        if (dist < 15) {
          found = community;
          break;
        }
      }

      if (found) {
        setSelectedCommunity(found);
        if (onCommunitySelect) {
          onCommunitySelect(found);
        }
      }

      draw();
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      projection.zoom(zoomFactor, { x, y });
      draw();
    };

    const drawGeoJsonFeature = (feature) => {
      const geometry = feature.geometry;
      if (!geometry) return;

      const drawRing = (ring) => {
        ctx.beginPath();
        ring.forEach(([lng, lat], i) => {
          const proj = projection.project(lat, lng);
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach(drawRing);
      } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
          polygon.forEach(drawRing);
        });
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw world map countries from GeoJSON
      if (GeoDataService.worldFeatures.length > 0) {
        ctx.strokeStyle = 'rgba(100, 200, 150, 0.7)';
        ctx.fillStyle = 'rgba(40, 140, 100, 0.5)';
        ctx.lineWidth = 1;

        GeoDataService.worldFeatures.forEach(feature => {
          drawGeoJsonFeature(feature);
        });
      }

      // Draw grid
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.15)';
      ctx.lineWidth = 0.5;

      for (let lat = -90; lat <= 90; lat += 30) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 5) {
          const proj = projection.project(lat, lng);
          if (lng === -180) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      for (let lng = -180; lng <= 180; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const proj = projection.project(lat, lng);
          if (lat === -90) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Draw communities
      communities.forEach((community) => {
        const proj = projection.project(community.lat, community.lng);
        const metricValue = community[currentLayer] || 50;

        let color = 'rgb(239, 68, 68)';
        if (metricValue >= 85) color = 'rgb(34, 197, 94)';
        else if (metricValue >= 75) color = 'rgb(59, 130, 246)';
        else if (metricValue >= 60) color = 'rgb(234, 179, 8)';

        // Selected community
        if (selectedCommunity && selectedCommunity.id === community.id) {
          color = 'rgb(168, 85, 247)';
        } else if (hoveredCommunity && hoveredCommunity.id === community.id) {
          color = 'rgb(249, 250, 251)';
        }

        // Draw marker with glow
        ctx.shadowColor = color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowColor = 'transparent';
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    draw();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [communities, currentLayer, selectedCommunity, hoveredCommunity, onCommunitySelect]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['health', 'energy', 'food', 'water', 'trade', 'governance'].map((layer) => (
          <button
            key={layer}
            onClick={() => setCurrentLayer(layer)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentLayer === layer
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            {layer.charAt(0).toUpperCase() + layer.slice(1)}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        className="w-full bg-gradient-to-br from-slate-950 to-slate-900 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing shadow-xl"
      />

      <p className="text-xs text-slate-500">Drag to pan • Scroll to zoom • Click to select • Hover for info</p>
    </div>
  );
};

export default InteractiveMap;
