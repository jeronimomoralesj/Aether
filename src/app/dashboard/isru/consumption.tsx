"use client";
import React, { useState, useMemo } from "react";
import data from "../../dummy.json"; // adjust path if needed
import {
  Plus,
  X,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Fuel,
  Droplets,
  Zap,
  Factory,
  Calendar,
  Clock,
  BarChart3,
  AlertTriangle,
  Save
} from "lucide-react";

const mockData = data as any;

type ResourceUsage = {
  id: string;
  missionId: string;
  resourceType: string;
  consumptionRate: number;
  durationEstimate: number;
  description: string;
  linkedInventoryId?: string | null;
  miningRequirement: number;
  createdAt: string;
  updatedAt: string;
};

type Mission = {
  id: string;
  name: string;
  durationDays?: number;
  passengerCount?: number;
  startDate?: string;
  [k: string]: any;
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function resourceIcon(resourceType: string) {
  switch ((resourceType || "").toLowerCase()) {
    case "water":
      return <Droplets className="w-5 h-5 text-blue-400" />;
    case "oxygen":
      return <Zap className="w-5 h-5 text-green-400" />;
    case "fuel":
      return <Fuel className="w-5 h-5 text-orange-400" />;
    case "power":
      return <Zap className="w-5 h-5 text-yellow-400" />;
    default:
      return <Factory className="w-5 h-5 text-gray-400" />;
  }
}

function ConsumptionPage() {
  const [query, setQuery] = useState("");
  const [missionFilter, setMissionFilter] = useState<string | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState<ResourceUsage | null>(null);
  const [formData, setFormData] = useState<Partial<ResourceUsage>>({});

  const resourceUsage: ResourceUsage[] = mockData.resourceUsage || [];
  const missions: Mission[] = mockData.missions || [];
  const inventory: any[] = mockData.inventory || [];

  const filteredUsages = useMemo(() => {
    return resourceUsage.filter((usage) => {
      if (missionFilter !== "all" && usage.missionId !== missionFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        usage.resourceType.toLowerCase().includes(q) ||
        usage.description.toLowerCase().includes(q) ||
        (missions.find(m => m.id === usage.missionId)?.name || "").toLowerCase().includes(q)
      );
    });
  }, [resourceUsage, missionFilter, query, missions]);

  const totalConsumption = useMemo(() => {
    return filteredUsages.reduce((sum, usage) => sum + usage.consumptionRate, 0);
  }, [filteredUsages]);

  const totalMiningRequirement = useMemo(() => {
    return filteredUsages.reduce((sum, usage) => sum + usage.miningRequirement, 0);
  }, [filteredUsages]);

  const handleAddUsage = () => {
    if (!formData.resourceType || !formData.consumptionRate || !formData.missionId) return;

    const newUsage: ResourceUsage = {
      id: Date.now().toString(),
      missionId: formData.missionId || "",
      resourceType: formData.resourceType || "",
      consumptionRate: Number(formData.consumptionRate) || 0,
      durationEstimate: Number(formData.durationEstimate) || 0,
      description: formData.description || "",
      linkedInventoryId: formData.linkedInventoryId || null,
      miningRequirement: Number(formData.miningRequirement) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you would save this to your backend
    console.log("New resource usage:", newUsage);
    setFormData({});
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({});
    setSelectedUsage(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800/50 p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Resource Consumption
              </h1>
              <p className="text-gray-400 mt-2">
                Monitor and manage resource consumption across all missions
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                         text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 
                         shadow-lg hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Resource Usage
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Records</p>
                  <p className="text-2xl font-bold text-white">{filteredUsages.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Daily Consumption</p>
                  <p className="text-2xl font-bold text-orange-400">{totalConsumption}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Mining Required</p>
                  <p className="text-2xl font-bold text-red-400">{totalMiningRequirement}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Missions</p>
                  <p className="text-2xl font-bold text-green-400">{missions.length}</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources, descriptions, missions..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                         focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={missionFilter}
                onChange={(e) => setMissionFilter(e.target.value as any)}
                className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                         focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm appearance-none"
              >
                <option value="all">All Missions</option>
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resource Usage Table */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white">Resource Usage Records</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Resource</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Mission</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Consumption Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Duration Est.</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Mining Req.</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredUsages.length > 0 ? (
                  filteredUsages.map((usage) => {
                    const mission = missions.find(m => m.id === usage.missionId);
                    return (
                      <tr 
                        key={usage.id} 
                        className="hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer"
                        onClick={() => setSelectedUsage(usage)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {resourceIcon(usage.resourceType)}
                            <div>
                              <div className="text-white font-medium">{usage.resourceType}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">
                                {usage.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{mission?.name || "Unknown"}</div>
                          <div className="text-sm text-gray-400">
                            {mission?.durationDays ? `${mission.durationDays} days` : "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{usage.consumptionRate}/day</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{usage.durationEstimate} days</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-red-400 font-medium">{usage.miningRequirement}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-400 text-sm">{formatDate(usage.updatedAt)}</div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Factory className="w-16 h-16 text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No Resource Usage Found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-2xl 
                          border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold text-white">Add Resource Usage</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg 
                           transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Resource Type
                    </label>
                    <input
                      type="text"
                      value={formData.resourceType || ""}
                      onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                      placeholder="e.g., Water, Oxygen, Fuel"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mission
                    </label>
                    <select
                      value={formData.missionId || ""}
                      onChange={(e) => setFormData({ ...formData, missionId: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                               text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 transition-all duration-200 appearance-none"
                    >
                      <option value="">Select Mission</option>
                      {missions.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Consumption Rate (per day)
                    </label>
                    <input
                      type="number"
                      value={formData.consumptionRate || ""}
                      onChange={(e) => setFormData({ ...formData, consumptionRate: e.target.value })}
                      placeholder="150"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration Estimate (days)
                    </label>
                    <input
                      type="number"
                      value={formData.durationEstimate || ""}
                      onChange={(e) => setFormData({ ...formData, durationEstimate: e.target.value })}
                      placeholder="30"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mining Requirement
                    </label>
                    <input
                      type="number"
                      value={formData.miningRequirement || ""}
                      onChange={(e) => setFormData({ ...formData, miningRequirement: e.target.value })}
                      placeholder="5000"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Linked Inventory (Optional)
                    </label>
                    <select
                      value={formData.linkedInventoryId || ""}
                      onChange={(e) => setFormData({ ...formData, linkedInventoryId: e.target.value || null })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                               text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 transition-all duration-200 appearance-none"
                    >
                      <option value="">No linked inventory</option>
                      {inventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of resource usage..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                             text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                             focus:border-blue-500/50 transition-all duration-200 resize-vertical"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl 
                             transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUsage}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                             hover:from-blue-600 hover:to-purple-600 text-white rounded-xl 
                             transition-all duration-200 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Usage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedUsage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedUsage(null)}
            />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-3xl 
                          border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                  {resourceIcon(selectedUsage.resourceType)}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedUsage.resourceType} Usage</h2>
                    <p className="text-gray-400">
                      {missions.find(m => m.id === selectedUsage.missionId)?.name || "Unknown Mission"}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedUsage(null)}
                  className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg 
                           transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Usage Details</h3>
                    <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Consumption Rate:</span>
                        <span className="text-white font-medium">{selectedUsage.consumptionRate}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration Estimate:</span>
                        <span className="text-white font-medium">{selectedUsage.durationEstimate} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mining Requirement:</span>
                        <span className="text-red-400 font-medium">{selectedUsage.miningRequirement}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Timeline</h3>
                    <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white font-medium">{formatDate(selectedUsage.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Updated:</span>
                        <span className="text-white font-medium">{formatDate(selectedUsage.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedUsage.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsumptionPage;