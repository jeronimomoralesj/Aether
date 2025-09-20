"use client";

import { useState } from "react";
import { FileText, Settings, Play, Download, AlertCircle, CheckCircle, TrendingUp, Package, Weight, Box } from "lucide-react";

export default function Manifest() {
  const [selectedMission, setSelectedMission] = useState("");
  const [constraints, setConstraints] = useState({
    max_mass_kg: "1000",
    max_volume_m3: "50",
    priority_threshold: "7",
    reserve_percentage: "15"
  });
  const [optimization, setOptimization] = useState({
    objective: "efficiency", // efficiency, mass, volume, criticality
    algorithm: "multi_knapsack" // multi_knapsack, greedy, genetic
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    efficiency: number;
    selected_items: number;
    total_mass: number;
    total_volume: number;
    items: Array<any>;
    optimization_log: Array<string>;
  } | null>(null);

  const missions = [
    { id: "artemis-iii", name: "Artemis III", description: "Lunar surface operations" },
    { id: "mars-sample", name: "Mars Sample Return", description: "Sample collection and return" },
    { id: "lunar-gateway", name: "Lunar Gateway", description: "Space station operations" },
    { id: "europa-clipper", name: "Europa Clipper", description: "Jupiter moon exploration" }
  ];

  const mockInventory = [
    { id: "O2T-001", name: "Oxygen Tank", mass: 1.25, volume: 0.0175, criticality: 10, category: "Life Support" },
    { id: "WR-002", name: "Water Recycler", mass: 45.5, volume: 0.125, criticality: 9, category: "Life Support" },
    { id: "SP-003", name: "Solar Panel", mass: 12.8, volume: 0.085, criticality: 8, category: "Power Systems" },
    { id: "NC-004", name: "Navigation Computer", mass: 3.2, volume: 0.012, criticality: 9, category: "Navigation" },
    { id: "EB-005", name: "Emergency Beacon", mass: 0.8, volume: 0.005, criticality: 10, category: "Communication" },
    { id: "FP-006", name: "Food Package", mass: 2.1, volume: 0.015, criticality: 7, category: "Consumables" },
    { id: "TS-007", name: "Tool Set", mass: 5.5, volume: 0.032, criticality: 6, category: "Tools" },
    { id: "ES-008", name: "EVA Suit", mass: 125.0, volume: 0.180, criticality: 10, category: "Life Support" }
  ];

  const generateManifest = async () => {
    if (!selectedMission) {
      alert("Please select a mission first");
      return;
    }

    setGenerating(true);

    try {
      // Simulate PuLP optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock optimization algorithm
      const maxMass = parseFloat(constraints.max_mass_kg);
      const maxVolume = parseFloat(constraints.max_volume_m3);
      const minCriticality = parseInt(constraints.priority_threshold);
      
      // Filter and sort items by criticality and efficiency
      const eligibleItems = mockInventory.filter(item => item.criticality >= minCriticality);
      const sortedItems = eligibleItems.sort((a, b) => {
        const efficiencyA = a.criticality / (a.mass + a.volume * 100);
        const efficiencyB = b.criticality / (b.mass + b.volume * 100);
        return efficiencyB - efficiencyA;
      });

      // Simple knapsack selection
      const selectedItems = [];
      let totalMass = 0;
      let totalVolume = 0;

      for (const item of sortedItems) {
        if (totalMass + item.mass <= maxMass && totalVolume + item.volume <= maxVolume) {
          selectedItems.push(item);
          totalMass += item.mass;
          totalVolume += item.volume;
        }
      }

      const efficiency = Math.round(((totalMass / maxMass + totalVolume / maxVolume) / 2) * 100);

      const optimizationLog = [
        "Initializing PuLP multi-knapsack solver...",
        `Filtering items with criticality >= ${minCriticality}`,
        `Found ${eligibleItems.length} eligible items`,
        "Calculating item efficiency ratios...",
        "Running optimization algorithm...",
        `Selected ${selectedItems.length} items within constraints`,
        `Total mass: ${totalMass.toFixed(2)}/${maxMass} kg`,
        `Total volume: ${totalVolume.toFixed(4)}/${maxVolume} m³`,
        `Optimization complete: ${efficiency}% efficiency`
      ];

      setResult({
        efficiency,
        selected_items: selectedItems.length,
        total_mass: totalMass,
        total_volume: totalVolume,
        items: selectedItems,
        optimization_log: optimizationLog
      });

    } catch (error) {
      alert("Optimization failed. Please check constraints and try again.");
    } finally {
      setGenerating(false);
    }
  };

  const exportManifest = (format: 'csv' | 'pdf' | 'json') => {
    if (!result) return;
    
    if (format === 'csv') {
      const csvContent = [
        'item_id,name,mass_kg,volume_m3,criticality,category',
        ...result.items.map(item => 
          `${item.id},${item.name},${item.mass},${item.volume},${item.criticality},${item.category}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manifest_${selectedMission}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert(`${format.toUpperCase()} export would be generated with ReportLab/jsPDF`);
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-400 bg-green-500/20";
    if (efficiency >= 75) return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  const getObjectiveDescription = (obj: string) => {
    switch(obj) {
      case "efficiency": return "Maximize mass and volume utilization";
      case "mass": return "Prioritize high-value items by mass";
      case "volume": return "Prioritize compact, dense items";
      case "criticality": return "Prioritize highest criticality items";
      default: return "";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <FileText className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Generate Manifest</h2>
          <p className="text-gray-400">Optimize item selection using PuLP multi-knapsack algorithm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Mission Selection */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Package className="w-5 h-5 text-blue-400 mr-2" />
              Mission Selection
            </h3>
            <div className="space-y-3">
              {missions.map(mission => (
                <label key={mission.id} className="flex items-start space-x-3 p-3 border border-gray-600 
                       rounded-lg hover:border-purple-500/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="mission"
                    value={mission.id}
                    checked={selectedMission === mission.id}
                    onChange={(e) => setSelectedMission(e.target.value)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{mission.name}</p>
                    <p className="text-gray-400 text-sm">{mission.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 text-yellow-400 mr-2" />
              Mission Constraints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Mass (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={constraints.max_mass_kg}
                    onChange={(e) => setConstraints({...constraints, max_mass_kg: e.target.value})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Volume (m³)
                </label>
                <div className="relative">
                  <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={constraints.max_volume_m3}
                    onChange={(e) => setConstraints({...constraints, max_volume_m3: e.target.value})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority Threshold (1-10)
                </label>
                <select
                  value={constraints.priority_threshold}
                  onChange={(e) => setConstraints({...constraints, priority_threshold: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>≥ {n} ({""}
                      {n >= 9 ? 'Critical' : n >= 7 ? 'High' : n >= 5 ? 'Medium' : 'Low'}
                      {""})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reserve Capacity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={constraints.reserve_percentage}
                  onChange={(e) => setConstraints({...constraints, reserve_percentage: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Optimization Settings */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              Optimization Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objective Function
                </label>
                <select
                  value={optimization.objective}
                  onChange={(e) => setOptimization({...optimization, objective: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white"
                >
                  <option value="efficiency">Maximize Efficiency</option>
                  <option value="mass">Maximize Mass Utilization</option>
                  <option value="volume">Maximize Volume Utilization</option>
                  <option value="criticality">Maximize Criticality Score</option>
                </select>
                <p className="text-gray-400 text-xs mt-1">{getObjectiveDescription(optimization.objective)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Algorithm
                </label>
                <select
                  value={optimization.algorithm}
                  onChange={(e) => setOptimization({...optimization, algorithm: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white"
                >
                  <option value="multi_knapsack">Multi-Knapsack (PuLP)</option>
                  <option value="greedy">Greedy Algorithm</option>
                  <option value="genetic">Genetic Algorithm</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateManifest}
            disabled={!selectedMission || generating}
            className={`w-full py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-3
                      ${!selectedMission || generating
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      }`}
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Generate Optimal Manifest</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Summary */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Optimization Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-400 font-medium">Items Selected</p>
                    <p className="text-2xl font-bold text-white">{result.selected_items}</p>
                  </div>
                  <div className={`text-center p-4 border rounded-lg ${getEfficiencyColor(result.efficiency)}`}>
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Efficiency</p>
                    <p className="text-2xl font-bold">{result.efficiency}%</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Mass:</span>
                    <span className="text-white">{result.total_mass.toFixed(2)} / {constraints.max_mass_kg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Volume:</span>
                    <span className="text-white">{result.total_volume.toFixed(4)} / {constraints.max_volume_m3} m³</span>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Mass Utilization</span>
                      <span>{Math.round((result.total_mass / parseFloat(constraints.max_mass_kg)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((result.total_mass / parseFloat(constraints.max_mass_kg)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Volume Utilization</span>
                      <span>{Math.round((result.total_volume / parseFloat(constraints.max_volume_m3)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((result.total_volume / parseFloat(constraints.max_volume_m3)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Export Manifest</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => exportManifest('csv')}
                    className="flex flex-col items-center p-4 bg-green-500/10 hover:bg-green-500/20 
                             border border-green-500/30 rounded-lg transition-colors duration-200"
                  >
                    <Download className="w-6 h-6 text-green-400 mb-2" />
                    <span className="text-green-400 font-medium">CSV</span>
                    <span className="text-xs text-gray-400">Spreadsheet</span>
                  </button>
                  
                  <button
                    onClick={() => exportManifest('pdf')}
                    className="flex flex-col items-center p-4 bg-red-500/10 hover:bg-red-500/20 
                             border border-red-500/30 rounded-lg transition-colors duration-200"
                  >
                    <FileText className="w-6 h-6 text-red-400 mb-2" />
                    <span className="text-red-400 font-medium">PDF</span>
                    <span className="text-xs text-gray-400">Report</span>
                  </button>
                  
                  <button
                    onClick={() => exportManifest('json')}
                    className="flex flex-col items-center p-4 bg-blue-500/10 hover:bg-blue-500/20 
                             border border-blue-500/30 rounded-lg transition-colors duration-200"
                  >
                    <Package className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-blue-400 font-medium">JSON</span>
                    <span className="text-xs text-gray-400">Data</span>
                  </button>
                </div>
              </div>

              {/* Selected Items */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Selected Items</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {result.items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400 font-mono text-sm">{item.id}</span>
                          <span className="text-white font-medium">{item.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${item.criticality >= 9 
                              ? 'text-red-400 bg-red-500/20' 
                              : item.criticality >= 7 
                                ? 'text-yellow-400 bg-yellow-500/20' 
                                : 'text-green-400 bg-green-500/20'
                            }`}>
                            {item.criticality}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>{item.mass} kg</span>
                          <span>{item.volume.toFixed(4)} m³</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimization Log */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Optimization Log</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
                  {result.optimization_log.map((log, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-gray-500 flex-shrink-0">{String(index + 1).padStart(2, '0')}:</span>
                      <span className={`${
                        log.includes('ERROR') ? 'text-red-400' :
                        log.includes('WARNING') ? 'text-yellow-400' :
                        log.includes('complete') ? 'text-green-400' :
                        'text-gray-300'
                      }`}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Manifest Generated</h3>
              <p className="text-gray-400 mb-6">
                Configure your mission parameters and constraints, then click "Generate Optimal Manifest" to begin optimization.
              </p>
              <div className="text-left bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300">
                <h4 className="font-medium text-white mb-2">The algorithm will:</h4>
                <ul className="space-y-1">
                  <li>• Filter items by criticality threshold</li>
                  <li>• Calculate efficiency ratios for each item</li>
                  <li>• Run PuLP multi-knapsack optimization</li>
                  <li>• Select optimal items within mass/volume constraints</li>
                  <li>• Generate manifest with 15% time savings vs manual planning</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}