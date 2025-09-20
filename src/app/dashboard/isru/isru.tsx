"use client";

import React, { useMemo, useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  X, 
  Copy, 
  Settings,
  Zap,
  Droplets,
  Fuel,
  Factory,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

import data from "../../dummy.json"; // adjust path if needed

const mockData = data as any;

type ISRUUnit = {
  id: string;
  name: string;
  missionId: string;
  resourceType: string;
  productionCapacity: number;
  status: string;
  locationId?: string;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
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
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function resourceIcon(resourceType: string) {
  switch ((resourceType || "").toLowerCase()) {
    case "water":
      return <Droplets className="w-6 h-6 text-blue-400" />;
    case "oxygen":
      return <Zap className="w-6 h-6 text-green-400" />;
    case "fuel":
      return <Fuel className="w-6 h-6 text-orange-400" />;
    case "power":
      return <Zap className="w-6 h-6 text-yellow-400" />;
    default:
      return <Factory className="w-6 h-6 text-gray-400" />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Operational":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "In Testing":
      return <Clock className="w-4 h-4 text-yellow-400" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
  }
}

function computeMissionAggregates(
  mission: Mission,
  units: ISRUUnit[],
  usage: any[],
  bufferPercent = 20
) {
  const durationDays = mission.durationDays || 0;
  const totalProductionCapacity = units.reduce(
    (s, u) => s + (u.productionCapacity || 0),
    0
  );
  const totalConsumptionRate = usage
    .filter((u) => u.missionId === mission.id)
    .reduce((s, u) => s + (u.consumptionRate || 0), 0);

  const netNeed =
    totalConsumptionRate * durationDays - totalProductionCapacity * durationDays;
  const withBuffer = netNeed + (Math.abs(netNeed) * bufferPercent) / 100;

  return {
    totalProductionCapacity,
    totalConsumptionRate,
    netNeed,
    withBuffer,
  };
}

export default function IsruPageClient() {
  const [query, setQuery] = useState("");
  const [missionFilter, setMissionFilter] = useState<string | "all">("all");
  const [selectedUnit, setSelectedUnit] = useState<ISRUUnit | null>(null);
  const [bufferPercent, setBufferPercent] = useState<number>(20);

  const isru: ISRUUnit[] = mockData.isru || [];
  const missions: Mission[] = mockData.missions || [];
  const resourceUsage: any[] = mockData.resourceUsage || [];
  const locations: any[] = mockData.locations || [];
  const inventory: any[] = mockData.inventory || [];
  const clients: any[] = mockData.clients || [];

  const groupedByMission = useMemo(() => {
    const map = new Map<string, ISRUUnit[]>();
    for (const u of isru) {
      const arr = map.get(u.missionId) || [];
      arr.push(u);
      map.set(u.missionId, arr);
    }
    return map;
  }, [isru]);

  const displayedUnits = useMemo(() => {
    const list = isru.filter((u) => {
      if (missionFilter !== "all" && u.missionId !== missionFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        (u.resourceType || "").toLowerCase().includes(q) ||
        (mockData.missions.find((m: any) => m.id === u.missionId)?.name || "")
          .toLowerCase()
          .includes(q)
      );
    });
    list.sort((a, b) => {
      if (a.status === b.status) return a.name.localeCompare(b.name);
      if (a.status === "Operational") return -1;
      if (b.status === "Operational") return 1;
      return a.status.localeCompare(b.status);
    });
    return list;
  }, [isru, missionFilter, query]);

  const missionSummaries = useMemo(() => {
    return missions.map((m) => {
      const units = groupedByMission.get(m.id) || [];
      const agg = computeMissionAggregates(m, units, resourceUsage, bufferPercent);
      return { mission: m, units, agg };
    });
  }, [missions, groupedByMission, resourceUsage, bufferPercent]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(mockData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "isru-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalUnits = isru.length;
  const operationalUnits = isru.filter(u => u.status === "Operational").length;
  const totalCapacity = isru.reduce((sum, unit) => sum + (unit.productionCapacity || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="border-b border-gray-800/50 p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white text-transparent">
                ISRU Management
              </h1>
              <p className="text-gray-400 mt-2">
                In-Situ Resource Utilization systems and production monitoring
              </p>
            </div>
            
            <button
              onClick={() => {/* Add new ISRU unit logic */}}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                         text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 
                         shadow-lg hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add ISRU Unit
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Total Units</p>
                  <p className="text-2xl font-bold text-white">{totalUnits}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Operational</p>
                  <p className="text-2xl font-bold text-white-400">{operationalUnits}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Total Capacity</p>
                  <p className="text-2xl font-bold text-white-400">{totalCapacity}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Active Missions</p>
                  <p className="text-2xl font-bold text-white-400">{missions.length}</p>
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
                placeholder="Search units, resources, missions..."
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

          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 backdrop-blur-sm">
              <Settings className="w-5 h-5 text-gray-400" />
              <label className="text-sm text-gray-400">Buffer:</label>
              <input
                type="number"
                value={bufferPercent}
                onChange={(e) => setBufferPercent(Number(e.target.value || 0))}
                className="w-16 bg-transparent text-white text-sm focus:outline-none"
              />
              <span className="text-sm text-gray-400">%</span>
            </div>

            <button
              onClick={exportJson}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 
                         text-white px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Mission Summaries */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Mission Overview</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {missionSummaries.map(({ mission, units, agg }) => (
              <div
                key={mission.id}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 
                         border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 
                         backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{mission.name}</h3>
                    <p className="text-sm text-gray-400">
                      {mission.durationDays ?? "—"} days • {mission.passengerCount ?? "—"} crew
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Units</div>
                    <div className="text-2xl font-bold text-blue-400">{units.length}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Production /day</div>
                    <div className="text-lg font-semibold text-green-400">{agg.totalProductionCapacity}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Consumption /day</div>
                    <div className="text-lg font-semibold text-orange-400">{agg.totalConsumptionRate}</div>
                  </div>
                  <div className="col-span-2 bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Net Mining Need</div>
                    <div className="text-sm text-white">
                      <span className="font-semibold">{Math.round(agg.netNeed)}</span>
                      <span className="text-gray-400 ml-2">
                        (w/ buffer: {Math.round(agg.withBuffer)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ISRU Units Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">ISRU Units</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedUnits.map((unit) => {
              const mission = missions.find((m) => m.id === unit.missionId);
              const location = locations.find((l) => l.id === unit.locationId);
              const client = clients.find((c: any) =>
                inventory.some((inv: any) => inv.clientId === c.id && inv.missionId === unit.missionId)
              );

              return (
                <div
                  key={unit.id}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 
                           border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 
                           backdrop-blur-sm cursor-pointer hover:shadow-lg hover:shadow-blue-500/10
                           transform hover:scale-[1.02]"
                  onClick={() => setSelectedUnit(unit)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-800/50 rounded-xl">
                        {resourceIcon(unit.resourceType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{unit.name}</h4>
                        <p className="text-sm text-gray-400">
                          {mission?.name || "Unknown Mission"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                        ${unit.status === "Operational" 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                          : unit.status === "In Testing"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}>
                        {getStatusIcon(unit.status)}
                        {unit.status}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Production Capacity</span>
                      <span className="text-lg font-semibold text-white">{unit.productionCapacity}/day</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{location?.name || "Unknown Location"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatDate(unit.updatedAt)}</span>
                    </div>

                    {client && (
                      <div className="text-sm text-blue-400">
                        Client: {client.name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {displayedUnits.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <Factory className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No ISRU Units Found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Unit Details Modal */}
        {selectedUnit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedUnit(null)}
            />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-4xl 
                          border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800/50 rounded-xl">
                    {resourceIcon(selectedUnit.resourceType)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedUnit.name}</h2>
                    <p className="text-gray-400">{selectedUnit.resourceType} • {selectedUnit.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(JSON.stringify(selectedUnit, null, 2));
                      // Add toast notification here if needed
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 
                             text-white rounded-lg transition-all duration-200"
                  >
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </button>
                  <button
                    onClick={() => setSelectedUnit(null)}
                    className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg 
                             transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                    <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedUnit.status)}
                          <span className="text-white font-medium">{selectedUnit.status}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Production Capacity:</span>
                        <span className="text-white font-medium">{selectedUnit.productionCapacity}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resource Type:</span>
                        <span className="text-white font-medium">{selectedUnit.resourceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white font-medium">
                          {locations.find((l) => l.id === selectedUnit.locationId)?.name || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Timeline</h3>
                    <div className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white font-medium">{formatDate(selectedUnit.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Updated:</span>
                        <span className="text-white font-medium">{formatDate(selectedUnit.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw JSON Data */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Raw Data</h3>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                    <pre className="text-sm text-gray-300 overflow-auto max-h-64">
                      {JSON.stringify(selectedUnit, null, 2)}
                    </pre>
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