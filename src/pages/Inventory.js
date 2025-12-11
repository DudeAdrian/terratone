// src/pages/Inventory_v2.js - Glassmorphic Community Inventory

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../core/SofieCore";
import { QuantumSection, QuantumCard, QuantumGlassGrid } from "../theme/QuantumGlassTheme";
import { createBackHandler } from "../utils/navigation";

const Inventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  const handleBack = createBackHandler(navigate, location);
  const [inventory, setInventory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    const inventoryService = sofieCore.getService("inventory");
    if (inventoryService) {
      setInventory(inventoryService.getInventory());
    }
  }, []);

  const handleAddItem = () => {
    const inventoryService = sofieCore.getService("inventory");
    if (inventoryService && newItem && newQuantity) {
      inventoryService.addItem(selectedCategory, newItem, parseInt(newQuantity));
      setInventory(inventoryService.getInventory());
      setNewItem("");
      setNewQuantity("");
    }
  };

  const categories = Object.keys(inventory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-950 to-teal-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <QuantumSection chakra="heart" opacityLevel="crystal" blurLevel="deep" edgeGlow>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleBack}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e8d3ba'
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_22px_rgba(16,185,129,0.55)]">
              📦 Community Inventory
            </h1>
            <p className="text-emerald-100/80 mt-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">Track and manage shared resources across the community</p>
          </div>
        </QuantumSection>

        <QuantumGlassGrid columns={2} gap={6} className="grid-cols-1 md:grid-cols-2">
          {/* Categories Sidebar */}
          <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow edgeGlow>
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)]"
                      : "bg-white/5 text-white border border-emerald-500/30 hover:bg-white/10"
                  }`}
                >
                  <span className="capitalize">{category}</span>
                  <span className="ml-2 text-sm opacity-75">({inventory[category]?.quantity || 0} {inventory[category]?.unit})</span>
                </button>
              ))}
            </div>
          </QuantumCard>

          {/* Add Item Form */}
          <QuantumCard chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow>
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">Add to Inventory</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-100/90 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g., Tomato Seeds"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-emerald-500/30 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-100/90 mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-emerald-500/30 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
              </div>
              <button
                onClick={handleAddItem}
                className="w-full px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
              >
                Add to Inventory
              </button>
            </div>
          </QuantumCard>
        </QuantumGlassGrid>

        {/* Items Grid */}
        <QuantumSection chakra="throat" opacityLevel="veil" blurLevel="medium" edgeGlow>
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">
            {selectedCategory.toUpperCase()} Items
          </h2>
          <QuantumGlassGrid columns={3} gap={4} className="grid-cols-1 md:grid-cols-3">
            {inventory[selectedCategory]?.categories &&
              Object.entries(inventory[selectedCategory].categories).map(([item, quantity]) => (
                <QuantumCard key={item} chakra="heart" blurLevel="deep" opacityLevel="ultraClear" glow>
                  <p className="text-xs font-semibold text-emerald-200 uppercase">Item</p>
                  <h3 className="text-xl font-bold text-white mt-2 mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">{item}</h3>
                  <p className="text-3xl font-bold text-emerald-200 drop-shadow-[0_0_14px_rgba(16,185,129,0.45)] mb-2">{quantity}</p>
                  <p className="text-sm text-emerald-100/75">{inventory[selectedCategory]?.unit}</p>
                </QuantumCard>
              ))}
            {(!inventory[selectedCategory]?.categories || Object.keys(inventory[selectedCategory].categories).length === 0) && (
              <div className="col-span-full text-center py-12">
                <p className="text-emerald-100/75 text-lg font-semibold">No items in this category yet</p>
              </div>
            )}
          </QuantumGlassGrid>
        </QuantumSection>

        {/* Web3 Badge */}
        <QuantumCard chakra="throat" opacityLevel="veil" blurLevel="shallow" edgeGlow>
          <p className="text-center text-sm font-semibold text-cyan-100/80 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            🔗 Inventory tracked on blockchain • Verified across network
          </p>
        </QuantumCard>
      </div>
    </div>
  );
};

export default Inventory;
