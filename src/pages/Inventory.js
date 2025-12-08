import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";

const Inventory = () => {
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
    <div>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">📦 Community Inventory</h1>
        <p className="text-lg text-gray-600">Track shared resources across the community</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-sm">({inventory[category]?.quantity || 0} {inventory[category]?.unit})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Item</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Item name"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddItem}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Add to Inventory
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedCategory.toUpperCase()} Items</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {inventory[selectedCategory]?.categories &&
            Object.entries(inventory[selectedCategory].categories).map(([item, quantity]) => (
              <div key={item} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800">{item}</h3>
                <p className="text-2xl font-bold text-blue-600">{quantity}</p>
                <p className="text-sm text-gray-600">{inventory[selectedCategory]?.unit}</p>
              </div>
            ))}
          {(!inventory[selectedCategory]?.categories || Object.keys(inventory[selectedCategory].categories).length === 0) && (
            <p className="text-gray-600 col-span-3">No items in this category yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
