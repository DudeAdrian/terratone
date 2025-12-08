import React, { useState } from "react";
import sofieCore from "../../core/SofieCore";

const Energy = () => {
  const energyService = sofieCore.getService("energy");
  const [data, setData] = useState(energyService.getEnergyData());
  const [history, setHistory] = useState([]);

  const simulateUpdate = () => {
    const newData = {
      solarProduction: Math.floor(Math.random() * 100),
      batteryLevel: Math.floor(Math.random() * 100),
      gridBalance: Math.floor(Math.random() * 100),
    };

    energyService.updateEnergyData(newData);
    setData(energyService.getEnergyData());
    setHistory([
      { timestamp: new Date().toLocaleTimeString(), ...newData },
      ...history,
    ].slice(0, 5));
  };

  const ProgressCard = ({ title, value, unit, icon, color }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg shadow-md p-6 border-l-4 border-${color}-600`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase">{title}</p>
          <div className="text-4xl font-bold text-gray-800 mt-2">{value}{unit}</div>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-600 h-2 rounded-full transition-all`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">⚡ Energy Systems</h1>
        <p className="text-lg text-gray-600">Monitor solar production, battery levels, and grid balance</p>
      </div>

      {/* Energy Status Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <ProgressCard
          title="Solar Production"
          value={data.solarProduction}
          unit=" kW"
          icon="☀️"
          color="yellow"
        />
        <ProgressCard
          title="Battery Level"
          value={data.batteryLevel}
          unit="%"
          icon="🔋"
          color="blue"
        />
        <ProgressCard
          title="Grid Balance"
          value={data.gridBalance}
          unit=" kWh"
          icon="⚡"
          color="purple"
        />
      </div>

      {/* Control & Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Controls</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={simulateUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
          >
            🔄 Simulate Data Update
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md">
            ⚙️ System Config
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md">
            📊 View Analytics
          </button>
        </div>
      </div>

      {/* Data History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Recent Updates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Solar (kW)</th>
                  <th className="px-4 py-2 text-left">Battery (%)</th>
                  <th className="px-4 py-2 text-left">Grid (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{entry.timestamp}</td>
                    <td className="px-4 py-3 font-semibold text-yellow-600">{entry.solarProduction}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{entry.batteryLevel}%</td>
                    <td className="px-4 py-3 font-semibold text-purple-600">{entry.gridBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

Energy.propTypes = {};

export default Energy;