// src/pages/services/Energy.js

import React, { useState } from "react";
import MainLayout from "../../components/MainLayout";
import sofieCore from "../../core/SofieCore";

const Energy = () => {
  const energyService = sofieCore.getService("energy");

  const [data, setData] = useState(energyService.getEnergyData());

  const simulateUpdate = () => {
    const newData = {
      solarProduction: Math.floor(Math.random() * 100),
      batteryLevel: Math.floor(Math.random() * 100),
      gridBalance: Math.floor(Math.random() * 100),
    };

    energyService.updateEnergyData(newData);
    setData(energyService.getEnergyData());
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-4">Energy System Status</h2>

        <div className="space-y-2 mb-6">
          <p><strong>Solar Production:</strong> {data.solarProduction} kW</p>
          <p><strong>Battery Level:</strong> {data.batteryLevel}%</p>
          <p><strong>Grid Balance:</strong> {data.gridBalance} kWh</p>
        </div>

        <button
          onClick={simulateUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simulate Update
        </button>
      </div>
    </MainLayout>
  );
};

export default Energy;
