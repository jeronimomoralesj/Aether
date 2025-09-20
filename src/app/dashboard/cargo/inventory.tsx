"use client";

import React, { useState, useEffect } from "react";
import { Package, Truck, Target, Zap, BarChart3, AlertTriangle, CheckCircle, Clock, Download, X } from "lucide-react";
import data from "../../dummy.json";

// Simple optimization function - no complex algorithms
function optimizeCargo(items, ship, priorityMode = false) {
  if (!items || !items.length || !ship) {
    return { selected: [], rejected: [], totalMass: 0, totalVolume: 0 };
  }

  const massLimit = ship.cargoCapacity;
  const volumeLimit = ship.volumeCapacity;

  // Add priority to items
  const itemsWithPriority = items.map(item => {
    let priority = 1;
    
    if (priorityMode) {
      if (item.criticality) {
        priority = item.criticality;
      } else {
        // Simple age-based priority
        const daysSinceCreated = Math.floor(
          (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        priority = Math.max(1, daysSinceCreated);
      }
    }
    
    return { ...item, priority };
  });

  // Sort by priority
  itemsWithPriority.sort((a, b) => b.priority - a.priority);

  // Simple greedy selection
  const selected = [];
  const rejected = [];
  let totalMass = 0;
  let totalVolume = 0;

  for (const item of itemsWithPriority) {
    if (totalMass + item.mass <= massLimit && totalVolume + item.volume <= volumeLimit) {
      selected.push(item);
      totalMass += item.mass;
      totalVolume += item.volume;
    } else {
      // Determine rejection reason
      let reason = '';
      if (totalMass + item.mass > massLimit && totalVolume + item.volume > volumeLimit) {
        reason = 'Exceeds both mass and volume capacity';
      } else if (totalMass + item.mass > massLimit) {
        reason = 'Exceeds mass capacity';
      } else {
        reason = 'Exceeds volume capacity';
      }
      rejected.push({ ...item, reason });
    }
  }

  // Check if within capacity
  const withinCapacity = totalMass <= massLimit && totalVolume <= volumeLimit;
  const massOverage = Math.max(0, totalMass - massLimit);
  const volumeOverage = Math.max(0, totalVolume - volumeLimit);

  return { 
    selected, 
    rejected, 
    totalMass, 
    totalVolume, 
    withinCapacity,
    massOverage,
    volumeOverage
  };
}

function CargoPlanner({ inModal = false }) {
  const missions = data.missions;
  const ships = data.ships;
  const locations = data.locations

const findLocation = (inventoryItem, data) => {
  if (!inventoryItem?.placeId || inventoryItem.placeId.length === 0) {
    return "Unknown Location";
  }

  // Get the last placeId entry
  const lastPlace = inventoryItem.placeId[inventoryItem.placeId.length - 1];

  // Find location by value
  const location = data.locations.find((loc) => loc.id === lastPlace.value);

  return location ? location.name : "Unknown Location";
};

  // Filter out inventory items that already have a missionId
  const availableInventory = data.inventory.filter(item => !item.missionId || item.missionId === "");

  const [selectedMission, setSelectedMission] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({}); // Changed from selectedItems
  const [optimizedResult, setOptimizedResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages

  const mission = missions.find(m => m.id === selectedMission);
  const ship = mission ? ships.find(s => s.id === mission.shipId) : null;

  // Group identical items by name
  const groupedInventory = React.useMemo(() => {
    const groups = {};
    availableInventory.forEach(item => {
      if (!groups[item.name]) {
        groups[item.name] = {
          ...item, // Use first item as template
          items: [], // Array of all items with this name
          availableCount: 0
        };
      }
      groups[item.name].items.push(item);
      groups[item.name].availableCount++;
    });
    return Object.values(groups);
  }, [availableInventory]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleQuantityChange = (itemName, quantity) => {
    const newQuantities = { ...itemQuantities };
    if (quantity <= 0) {
      delete newQuantities[itemName];
    } else {
      newQuantities[itemName] = quantity;
    }
    setItemQuantities(newQuantities);
  };

  const getSelectedItemsForOptimization = () => {
    const selectedItems = [];
    Object.entries(itemQuantities).forEach(([itemName, quantity]) => {
      const group = groupedInventory.find(g => g.name === itemName);
      if (group && quantity > 0) {
        // Take up to the requested quantity from available items
        const itemsToTake = group.items.slice(0, Math.min(quantity, group.availableCount));
        selectedItems.push(...itemsToTake);
      }
    });
    return selectedItems;
  };

  const getAllItemsForOptimization = () => {
    // For auto-optimization, create items based on available inventory
    // For grouped items, we'll take all available items of each type
    const allItems = [];
    groupedInventory.forEach(group => {
      allItems.push(...group.items);
    });
    return allItems;
  };

  const handleManualOptimize = () => {
    if (!ship || Object.keys(itemQuantities).length === 0) return;
    
    const selectedItemsList = getSelectedItemsForOptimization();
    const result = optimizeCargo(selectedItemsList, ship, false);
    setOptimizedResult({ ...result, mode: 'manual' });
    
    // Show success message
    setSuccessMessage({
      type: 'success',
      title: 'Manual Optimization Complete!',
      message: `Successfully optimized ${selectedItemsList.length} selected items. ${result.selected.length} items fit within ship capacity.`
    });
  };

  const handleAutoOptimize = () => {
    if (!ship) return;
    
    const allItems = getAllItemsForOptimization();
    const result = optimizeCargo(allItems, ship, true);
    setOptimizedResult({ ...result, mode: 'priority' });
    
    // Show success message
    setSuccessMessage({
      type: 'success',
      title: 'Auto-Optimization Complete!',
      message: `Successfully optimized all available inventory by priority. ${result.selected.length} items selected from ${allItems.length} available items.`
    });
  };

  const getCapacityPercentage = (used, total) => {
    return Math.min((used / total) * 100, 100);
  };

  const downloadManifest = () => {
    if (!optimizedResult || !mission || !ship) return;

    const manifestData = {
      manifestHeader: {
        manifestNumber: `MAN-${Date.now()}`,
        generatedDate: new Date().toISOString(),
        mission: {
          id: mission.id,
          name: mission.name,
          destination: mission.destination || 'Unknown',
          departureDate: mission.departureDate || 'TBD'
        },
        vessel: {
          id: ship.id,
          name: ship.name,
          type: ship.type || 'Cargo Vessel',
          cargoCapacity: ship.cargoCapacity,
          volumeCapacity: ship.volumeCapacity
        },
        loadingSummary: {
          totalItems: optimizedResult.selected.length,
          totalMass: optimizedResult.totalMass,
          totalVolume: optimizedResult.totalVolume,
          massUtilization: `${((optimizedResult.totalMass / ship.cargoCapacity) * 100).toFixed(2)}%`,
          volumeUtilization: `${((optimizedResult.totalVolume / ship.volumeCapacity) * 100).toFixed(2)}%`,
          optimizationMode: optimizedResult.mode === 'priority' ? 'Priority-based Auto-optimization' : 'Manual Selection Optimization'
        }
      },
      cargoManifest: optimizedResult.selected.map((item, index) => ({
        itemNumber: index + 1,
        itemId: item.id,
        description: item.name,
        mass: item.mass,
        volume: item.volume,
        status: item.status,
        location: item.subLocation || 'Unknown',
        priority: item.priority || 1,
        criticality: item.criticality || null,
        createdDate: item.createdAt
      })),
      rejectedItems: optimizedResult.rejected?.map((item, index) => ({
        itemNumber: index + 1,
        itemId: item.id,
        description: item.name,
        mass: item.mass,
        volume: item.volume,
        rejectionReason: item.reason
      })) || [],
      manifestFooter: {
        generatedBy: 'Cargo Planning System v1.0',
        totalPages: 1,
        certification: 'This manifest has been automatically generated and optimized based on cargo capacity constraints and priority algorithms.'
      }
    };

    // Create formatted text version for download
    const manifestText = `
═══════════════════════════════════════════════════════════════════
                          CARGO MANIFEST
═══════════════════════════════════════════════════════════════════

MANIFEST NUMBER: ${manifestData.manifestHeader.manifestNumber}
GENERATED: ${new Date(manifestData.manifestHeader.generatedDate).toLocaleString()}

MISSION DETAILS:
├─ Mission ID: ${manifestData.manifestHeader.mission.id}
├─ Mission Name: ${manifestData.manifestHeader.mission.name}
├─ Destination: ${manifestData.manifestHeader.mission.destination}
└─ Departure Date: ${manifestData.manifestHeader.mission.departureDate}

VESSEL SPECIFICATIONS:
├─ Vessel ID: ${manifestData.manifestHeader.vessel.id}
├─ Vessel Name: ${manifestData.manifestHeader.vessel.name}
├─ Type: ${manifestData.manifestHeader.vessel.type}
├─ Cargo Capacity: ${manifestData.manifestHeader.vessel.cargoCapacity.toLocaleString()} kg
└─ Volume Capacity: ${manifestData.manifestHeader.vessel.volumeCapacity.toLocaleString()} m³

LOADING SUMMARY:
├─ Total Items Loaded: ${manifestData.manifestHeader.loadingSummary.totalItems}
├─ Total Mass: ${manifestData.manifestHeader.loadingSummary.totalMass.toLocaleString()} kg
├─ Total Volume: ${manifestData.manifestHeader.loadingSummary.totalVolume.toLocaleString()} m³
├─ Mass Utilization: ${manifestData.manifestHeader.loadingSummary.massUtilization}
├─ Volume Utilization: ${manifestData.manifestHeader.loadingSummary.volumeUtilization}
└─ Optimization Mode: ${manifestData.manifestHeader.loadingSummary.optimizationMode}

═══════════════════════════════════════════════════════════════════
                        CARGO MANIFEST ITEMS
═══════════════════════════════════════════════════════════════════

${manifestData.cargoManifest.map(item => `
ITEM #${item.itemNumber.toString().padStart(3, '0')}
├─ Item ID: ${item.itemId}
├─ Description: ${item.description}
├─ Mass: ${item.mass.toLocaleString()} kg
├─ Volume: ${item.volume.toLocaleString()} m³
├─ Status: ${item.status}
├─ Location: ${item.location}
├─ Priority: ${item.priority}
${item.criticality ? `├─ Criticality: ${item.criticality}` : ''}
└─ Created: ${new Date(item.createdDate).toLocaleDateString()}
`).join('\n')}

${manifestData.rejectedItems.length > 0 ? `
═══════════════════════════════════════════════════════════════════
                         REJECTED ITEMS
═══════════════════════════════════════════════════════════════════

${manifestData.rejectedItems.map(item => `
REJECTED ITEM #${item.itemNumber.toString().padStart(3, '0')}
├─ Item ID: ${item.itemId}
├─ Description: ${item.description}
├─ Mass: ${item.mass.toLocaleString()} kg
├─ Volume: ${item.volume.toLocaleString()} m³
└─ Reason: ${item.rejectionReason}
`).join('\n')}
` : ''}

═══════════════════════════════════════════════════════════════════
                           CERTIFICATION
═══════════════════════════════════════════════════════════════════

${manifestData.manifestFooter.certification}

Generated by: ${manifestData.manifestFooter.generatedBy}
Total Pages: ${manifestData.manifestFooter.totalPages}
Manifest End

═══════════════════════════════════════════════════════════════════
`;

    // Create and download the file
    const blob = new Blob([manifestText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cargo_Manifest_${mission.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getPriorityDisplay = (item) => {
    if (item.criticality) {
      return (
        <div className="flex items-center space-x-1">
          <AlertTriangle size={14} className="text-red-400" />
          <span className="text-red-400 font-semibold">{item.criticality}</span>
        </div>
      );
    }
    
    const ageInDays = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return (
      <div className="flex items-center space-x-1">
        Created <span className="text-blue-400">{ageInDays} days ago</span>
      </div>
    );
  };

  const getTotalSelectedItems = () => {
    return Object.values(itemQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  // Different layout for modal vs standalone
  const containerClasses = inModal 
    ? "text-white space-y-4 h-full" 
    : "text-white p-4 sm:p-6 lg:p-8 space-y-8";

  const sectionClasses = inModal
    ? "bg-gradient-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-800/50 p-4"
    : "bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-gray-800/50 p-6";

  return (
    <div className={containerClasses}>
      {/* Success Message */}
      {successMessage && (
        <div className={`bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 relative ${inModal ? '' : 'mb-6'}`}>
          <button
            onClick={() => setSuccessMessage(null)}
            className="absolute top-2 right-2 text-green-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-green-400 font-semibold text-sm">{successMessage.title}</h3>
              <p className="text-green-200 text-sm mt-1">{successMessage.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mission Selector */}
      <div className={sectionClasses}>
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-5 h-5 text-purple-400" />
          <h2 className={`font-semibold ${inModal ? 'text-lg' : 'text-xl'}`}>Select Mission</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMission(m.id);
                setOptimizedResult(null);
                setItemQuantities({});
                setSuccessMessage(null);
                setShowSuccessPopup(false);
              }}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedMission === m.id
                  ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                  : 'border-gray-700/50 bg-gray-800/30 hover:border-blue-500/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Truck className={`w-4 h-4 ${selectedMission === m.id ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="font-medium truncate">{m.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ship Specifications */}
      {ship && (
        <div className={sectionClasses}>
          <div className="flex items-center space-x-3 mb-4">
            <Truck className="w-5 h-5 text-green-400" />
            <h2 className={`font-semibold ${inModal ? 'text-lg' : 'text-xl'}`}>Ship: {ship.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Cargo Capacity</span>
                <span className="font-semibold text-blue-400 text-sm">{ship.cargoCapacity.toLocaleString()} kg</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ 
                    width: `${optimizedResult ? getCapacityPercentage(optimizedResult.totalMass, ship.cargoCapacity) : 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Volume Capacity</span>
                <span className="font-semibold text-purple-400 text-sm">{ship.volumeCapacity.toLocaleString()} m³</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                  style={{ 
                    width: `${optimizedResult ? getCapacityPercentage(optimizedResult.totalVolume, ship.volumeCapacity) : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Inventory - Now Grouped */}
      {ship && (
        <div className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-orange-400" />
              <h2 className={`font-semibold ${inModal ? 'text-lg' : 'text-xl'}`}>Available Inventory (Grouped)</h2>
            </div>
            <div className="text-sm text-gray-400">
              {getTotalSelectedItems()} items selected from {groupedInventory.length} product types
            </div>
          </div>

          {/* Fixed height container for scrolling in modal */}
          <div className={inModal ? "max-h-64 overflow-y-auto" : ""}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedInventory.map((group) => (
                <div
                  key={group.name}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    itemQuantities[group.name] > 0
                      ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                      : 'border-gray-700/50 bg-gray-800/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">{group.name}</h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Available: <span className="text-green-400">{group.availableCount}</span> units
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Priority: <span className="text-green-400">{group.criticality ? group.criticality : "Unassigned"}</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Status: <span className="text-blue-400">{group.status}</span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Location:{" "}
                        <span className="text-blue-400 pr-3">
                          {findLocation(group, data)}
                        </span>
                        Sub location: <span className="text-blue-400">{group.subLocation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-gray-400">Mass (each):</span>
                      <div className="text-blue-400 font-mono">{group.mass.toLocaleString()} kg</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Volume (each):</span>
                      <div className="text-purple-400 font-mono">{group.volume.toLocaleString()} m³</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs">
                      {getPriorityDisplay(group)}
                    </div>
                    <div className="text-xs text-gray-500 truncate ml-2">
                      {group.subLocation}
                    </div>
                  </div>
                  
                  {/* Quantity Input */}
                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-gray-400 min-w-0">Qty:</label>
                    <input
                      type="number"
                      min="0"
                      max={group.availableCount}
                      value={itemQuantities[group.name] || 0}
                      onChange={(e) => handleQuantityChange(group.name, parseInt(e.target.value) || 0)}
                      className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                    <button
                      onClick={() => handleQuantityChange(group.name, group.availableCount)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      {ship && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleManualOptimize}
            disabled={getTotalSelectedItems() === 0}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 text-sm"
          >
            <Target className="w-4 h-4" />
            <span>Optimize Selected ({getTotalSelectedItems()})</span>
          </button>
          
          <button
            onClick={handleAutoOptimize}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-semibold transition-all duration-200 text-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Auto Fill by Priority</span>
          </button>
        </div>
      )}

      {/* Optimization Results */}
      {optimizedResult && (
        <div className={sectionClasses}>
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <h2 className={`font-semibold ${inModal ? 'text-lg' : 'text-xl'}`}>Optimization Results</h2>
              <p className="text-sm text-gray-400">
                {optimizedResult.mode === 'priority' ? 'Priority-based optimization' : 'Selected items optimization'}
              </p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Mass Used</span>
                <span className={`font-semibold text-sm ${optimizedResult.withinCapacity ? 'text-blue-400' : 'text-red-400'}`}>
                  {getCapacityPercentage(optimizedResult.totalMass, ship.cargoCapacity).toFixed(1)}%
                </span>
              </div>
              <div className={`text-xl font-bold mb-1 ${optimizedResult.withinCapacity ? 'text-blue-400' : 'text-red-400'}`}>
                {optimizedResult.totalMass.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                / {ship.cargoCapacity.toLocaleString()} kg
              </div>
              {optimizedResult.massOverage > 0 && (
                <div className="text-xs text-red-400 mt-1">
                  Overage: {optimizedResult.massOverage.toLocaleString()} kg
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Volume Used</span>
                <span className={`font-semibold text-sm ${optimizedResult.withinCapacity ? 'text-purple-400' : 'text-red-400'}`}>
                  {getCapacityPercentage(optimizedResult.totalVolume, ship.volumeCapacity).toFixed(1)}%
                </span>
              </div>
              <div className={`text-xl font-bold mb-1 ${optimizedResult.withinCapacity ? 'text-purple-400' : 'text-red-400'}`}>
                {optimizedResult.totalVolume.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                / {ship.volumeCapacity.toLocaleString()} m³
              </div>
              {optimizedResult.volumeOverage > 0 && (
                <div className="text-xs text-red-400 mt-1">
                  Overage: {optimizedResult.volumeOverage.toLocaleString()} m³
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Items Status</span>
                <span className="text-green-400 font-semibold text-sm">
                  {optimizedResult.selected.length} / {optimizedResult.selected.length + (optimizedResult.rejected?.length || 0)}
                </span>
              </div>
              <div className="text-xl font-bold text-green-400 mb-1">
                {optimizedResult.selected.length}
              </div>
              <div className="text-sm text-gray-500">
                items loaded
              </div>
              {optimizedResult.rejected && optimizedResult.rejected.length > 0 && (
                <div className="text-xs text-red-400 mt-1">
                  {optimizedResult.rejected.length} items rejected
                </div>
              )}
            </div>
          </div>

          {/* Download Manifest Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={downloadManifest}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Manifest</span>
            </button>
          </div>

          {/* Results Tables - with scrollable container in modal */}
          <div className={inModal ? "max-h-96 overflow-y-auto space-y-4" : "space-y-6"}>
            {/* Capacity Warning */}
            {!optimizedResult.withinCapacity && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <h3 className="text-red-400 font-semibold text-sm">Capacity Exceeded</h3>
                    <p className="text-gray-300 text-xs mt-1">
                      Your selection exceeds the ship's capacity. The optimizer has selected the highest priority items that fit within limits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Items Table */}
            {optimizedResult.selected.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Items to Load ({optimizedResult.selected.length})</span>
                </h3>
                
                <div className="bg-gray-800/20 rounded-lg border border-gray-700/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700/50 bg-gray-900/30">
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Item Name</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Mass (kg)</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Volume (m³)</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Priority</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizedResult.selected.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-700/30 hover:bg-gray-800/20">
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-white text-sm">{item.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-blue-400 font-mono text-sm">{item.mass.toLocaleString()}</td>
                            <td className="p-3 text-purple-400 font-mono text-sm">{item.volume.toLocaleString()}</td>
                            <td className="p-3">
                              {getPriorityDisplay(item)}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                item.status === 'Ready' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'Stored' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Rejected Items Table */}
            {optimizedResult.rejected && optimizedResult.rejected.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Items Not Loaded ({optimizedResult.rejected.length})</span>
                </h3>
                
                <div className="bg-red-500/5 rounded-lg border border-red-500/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-red-500/20 bg-red-500/10">
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Item Name</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Mass (kg)</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Volume (m³)</th>
                          <th className="text-left p-3 font-semibold text-gray-300 text-sm">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizedResult.rejected.map((item, idx) => (
                          <tr key={idx} className="border-b border-red-500/10">
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="font-medium text-white text-sm">{item.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-blue-400 font-mono text-sm">{item.mass.toLocaleString()}</td>
                            <td className="p-3 text-purple-400 font-mono text-sm">{item.volume.toLocaleString()}</td>
                            <td className="p-3 text-red-400 text-sm">{item.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CargoPlanner;