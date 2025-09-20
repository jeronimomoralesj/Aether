'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Package, 
  BarChart3, 
  Factory, 
  Shield, 
  Upload, 
  Plus, 
  Download, 
  Play, 
  Users, 
  MapPin, 
  Rocket,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Settings,
  X
} from 'lucide-react';

// TypeScript Interfaces
interface Mission {
  mission_id: string;
  name: string;
  passengers: number;
  destination: string;
  vehicle: string;
  max_mass_kg: number;
  max_volume_m3: number;
  status: string;
}

interface DigitalTwin {
  item_id: string;
  mission_id: string | null;
  name: string;
  mass_kg: number;
  volume_m3: number;
  criticality: number;
  category: string;
  unit: string;
  facility: string;
  sub_location: string;
  is_reserve: boolean;
}

interface ConsumptionProfile {
  profile_id: string;
  resource_type: string;
  consumption_rate: number;
  unit: string;
  depletion_days: number;
  current_stock: number;
}

interface ISRUProfile {
  isru_id: string;
  resource_type: string;
  production_rate: number;
  unit: string;
  isru_percentage: number;
  net_stock_day_30: number;
}

interface AutonomyRule {
  rule_id: string;
  resource_type: string;
  condition: string;
  action: string;
  priority: number;
}

interface AuditLog {
  log_id: string;
  user_id: string;
  action: string;
  timestamp: string;
}

interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
}

interface Metrics {
  efficiency_gain: number;
  criticality_score: number;
  isru_contribution: number;
  depletion_avg: number;
}

// Mock Data
const mockMissions: Mission[] = [
  {
    mission_id: 'lunar-rover-001',
    name: 'Lunar Rover Cargo - Sept 2025',
    passengers: 4,
    destination: 'Moon',
    vehicle: 'Starship',
    max_mass_kg: 100000,
    max_volume_m3: 1000,
    status: 'Planning'
  },
  {
    mission_id: 'mars-colony-002',
    name: 'Mars Colony Setup - Oct 2025',
    passengers: 12,
    destination: 'Mars',
    vehicle: 'Starship Heavy',
    max_mass_kg: 150000,
    max_volume_m3: 1500,
    status: 'Preparation'
  },
  {
    mission_id: 'asteroid-mining-003',
    name: 'Asteroid Mining Survey',
    passengers: 6,
    destination: 'Asteroid Belt',
    vehicle: 'Dragon Cargo',
    max_mass_kg: 75000,
    max_volume_m3: 800,
    status: 'Active'
  }
];

const mockInventory: DigitalTwin[] = [
  {
    item_id: 'O2T-001',
    mission_id: 'lunar-rover-001',
    name: 'Oxygen Tank',
    mass_kg: 1.25,
    volume_m3: 0.5,
    criticality: 9,
    category: 'Life Support',
    unit: 'kg',
    facility: 'Moon Station',
    sub_location: 'Bay 1',
    is_reserve: false
  },
  {
    item_id: 'WTR-002',
    mission_id: 'lunar-rover-001',
    name: 'Water Container',
    mass_kg: 2.5,
    volume_m3: 1.0,
    criticality: 8,
    category: 'Life Support',
    unit: 'L',
    facility: 'Moon Station',
    sub_location: 'Bay 2',
    is_reserve: true
  },
  {
    item_id: 'PWR-003',
    mission_id: 'mars-colony-002',
    name: 'Power Cell',
    mass_kg: 5.0,
    volume_m3: 0.3,
    criticality: 10,
    category: 'Power',
    unit: 'kWh',
    facility: 'Mars Outpost',
    sub_location: 'Storage A',
    is_reserve: false
  },
  {
    item_id: 'FD-004',
    mission_id: 'lunar-rover-001',
    name: 'Food Rations',
    mass_kg: 0.8,
    volume_m3: 0.2,
    criticality: 7,
    category: 'Consumables',
    unit: 'kg',
    facility: 'Moon Station',
    sub_location: 'Bay 3',
    is_reserve: false
  },
  {
    item_id: 'TL-005',
    mission_id: 'asteroid-mining-003',
    name: 'Mining Tool Kit',
    mass_kg: 15.0,
    volume_m3: 2.0,
    criticality: 6,
    category: 'Equipment',
    unit: 'set',
    facility: 'Asteroid Station',
    sub_location: 'Workshop',
    is_reserve: false
  },
  {
    item_id: 'COM-006',
    mission_id: 'lunar-rover-001',
    name: 'Communication Array',
    mass_kg: 3.2,
    volume_m3: 0.8,
    criticality: 8,
    category: 'Communication',
    unit: 'unit',
    facility: 'Moon Station',
    sub_location: 'Tech Bay',
    is_reserve: false
  },
  {
    item_id: 'MED-007',
    mission_id: 'mars-colony-002',
    name: 'Medical Kit',
    mass_kg: 1.8,
    volume_m3: 0.4,
    criticality: 9,
    category: 'Medical',
    unit: 'kit',
    facility: 'Mars Outpost',
    sub_location: 'Med Bay',
    is_reserve: true
  }
];

const mockConsumptionProfiles: ConsumptionProfile[] = [
  {
    profile_id: 'water-001',
    resource_type: 'Water',
    consumption_rate: 8,
    unit: 'L/day',
    depletion_days: 30,
    current_stock: 240
  },
  {
    profile_id: 'oxygen-001',
    resource_type: 'Oxygen',
    consumption_rate: 0.8,
    unit: 'kg/day',
    depletion_days: 45,
    current_stock: 36
  },
  {
    profile_id: 'food-001',
    resource_type: 'Food',
    consumption_rate: 2.5,
    unit: 'kg/day',
    depletion_days: 40,
    current_stock: 100
  },
  {
    profile_id: 'power-001',
    resource_type: 'Power',
    consumption_rate: 120,
    unit: 'kWh/day',
    depletion_days: 25,
    current_stock: 3000
  },
  {
    profile_id: 'nitrogen-001',
    resource_type: 'Nitrogen',
    consumption_rate: 0.3,
    unit: 'kg/day',
    depletion_days: 55,
    current_stock: 16.5
  }
];

const mockISRUProfiles: ISRUProfile[] = [
  {
    isru_id: 'water-isru-001',
    resource_type: 'Water',
    production_rate: 10,
    unit: 'L/day',
    isru_percentage: 40,
    net_stock_day_30: 300
  },
  {
    isru_id: 'oxygen-isru-001',
    resource_type: 'Oxygen',
    production_rate: 1.2,
    unit: 'kg/day',
    isru_percentage: 35,
    net_stock_day_30: 50
  },
  {
    isru_id: 'methane-isru-001',
    resource_type: 'Methane',
    production_rate: 5,
    unit: 'kg/day',
    isru_percentage: 60,
    net_stock_day_30: 150
  },
  {
    isru_id: 'nitrogen-isru-001',
    resource_type: 'Nitrogen',
    production_rate: 0.5,
    unit: 'kg/day',
    isru_percentage: 25,
    net_stock_day_30: 15
  }
];

const mockAutonomyRules: AutonomyRule[] = [
  {
    rule_id: 'rule-001',
    resource_type: 'Oxygen',
    condition: 'stock < 20%',
    action: 'Allocate Reserve',
    priority: 10
  },
  {
    rule_id: 'rule-002',
    resource_type: 'Water',
    condition: 'depletion < 7 days',
    action: 'Increase ISRU Production',
    priority: 9
  },
  {
    rule_id: 'rule-003',
    resource_type: 'Power',
    condition: 'consumption > 150 kWh/day',
    action: 'Activate Backup Systems',
    priority: 8
  },
  {
    rule_id: 'rule-004',
    resource_type: 'Food',
    condition: 'stock < 30%',
    action: 'Request Emergency Supply',
    priority: 9
  },
  {
    rule_id: 'rule-005',
    resource_type: 'Nitrogen',
    condition: 'production < demand',
    action: 'Optimize ISRU Settings',
    priority: 7
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    log_id: 'log-001',
    user_id: 'raj.patel',
    action: 'Manifest Generated',
    timestamp: '2025-09-09T10:30:00Z'
  },
  {
    log_id: 'log-002',
    user_id: 'sarah.chen',
    action: 'ISRU Profile Updated',
    timestamp: '2025-09-09T09:15:00Z'
  },
  {
    log_id: 'log-003',
    user_id: 'alex.johnson',
    action: 'Inventory Item Added',
    timestamp: '2025-09-09T08:45:00Z'
  },
  {
    log_id: 'log-004',
    user_id: 'maria.lopez',
    action: 'Simulation Completed',
    timestamp: '2025-09-09T08:20:00Z'
  },
  {
    log_id: 'log-005',
    user_id: 'raj.patel',
    action: 'Export Report Generated',
    timestamp: '2025-09-09T07:50:00Z'
  },
  {
    log_id: 'log-006',
    user_id: 'david.kim',
    action: 'Autonomy Rule Modified',
    timestamp: '2025-09-09T07:30:00Z'
  },
  {
    log_id: 'log-007',
    user_id: 'lisa.wang',
    action: 'Resource Analysis Exported',
    timestamp: '2025-09-09T07:10:00Z'
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    message: 'Water production at 40% ISRU efficiency',
    type: 'info',
    timestamp: '2025-09-09T10:45:00Z'
  },
  {
    id: 'alert-002',
    message: 'Manifest successfully generated for Lunar Rover Cargo',
    type: 'success',
    timestamp: '2025-09-09T10:30:00Z'
  },
  {
    id: 'alert-003',
    message: 'Oxygen reserve allocated - Bay 1',
    type: 'warning',
    timestamp: '2025-09-09T10:15:00Z'
  },
  {
    id: 'alert-004',
    message: 'Power consumption exceeding baseline by 12%',
    type: 'warning',
    timestamp: '2025-09-09T09:45:00Z'
  },
  {
    id: 'alert-005',
    message: 'ISRU water production optimized',
    type: 'success',
    timestamp: '2025-09-09T09:30:00Z'
  },
  {
    id: 'alert-006',
    message: 'Critical item count below threshold',
    type: 'error',
    timestamp: '2025-09-09T09:15:00Z'
  },
  {
    id: 'alert-007',
    message: 'System backup completed successfully',
    type: 'success',
    timestamp: '2025-09-09T09:00:00Z'
  }
];

const mockMetrics: Metrics = {
  efficiency_gain: 18,
  criticality_score: 80.77,
  isru_contribution: 40,
  depletion_avg: 30
};

export default function EarthPlanningPage() {
  const [selectedMission, setSelectedMission] = useState<string>('all');
  const [userRole, setUserRole] = useState<'Planner' | 'Operator'>('Planner');
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [inventory, setInventory] = useState<DigitalTwin[]>(mockInventory);
  const [consumptionProfiles, setConsumptionProfiles] = useState<ConsumptionProfile[]>(mockConsumptionProfiles);
  const [isruProfiles, setISRUProfiles] = useState<ISRUProfile[]>(mockISRUProfiles);
  const [autonomyRules, setAutonomyRules] = useState<AutonomyRule[]>(mockAutonomyRules);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [alerts] = useState<Alert[]>(mockAlerts);

  // Modal states
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddISRUModal, setShowAddISRUModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'inventory' | 'consumption' | 'isru'>('inventory');

  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    mass_kg: 0,
    unit: 'kg',
    facility: '',
    sub_location: ''
  });

  const [newISRU, setNewISRU] = useState({
    resource_type: '',
    production_rate: 0,
    unit: 'L/day'
  });

  const [newRule, setNewRule] = useState({
    resource_type: '',
    condition: '',
    action: '',
    priority: 5
  });

  // Filter data based on selected mission
  const filteredInventory = selectedMission === 'all' 
    ? inventory 
    : inventory.filter(item => item.mission_id === selectedMission);

  const selectedMissionData = selectedMission !== 'all' 
    ? mockMissions.find(m => m.mission_id === selectedMission)
    : null;

  // Toast handler
  const showToast = (message: string, type: string = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Simulate loading
  const simulateAction = async (action: string, duration: number = 2000) => {
    setLoading(action);
    await new Promise(resolve => setTimeout(resolve, duration));
    setLoading(null);
  };

  // Form handlers
  const handleAddItem = async () => {
    await simulateAction('Adding item');
    const newInventoryItem: DigitalTwin = {
      item_id: `ITM-${Date.now().toString().slice(-3)}`,
      mission_id: selectedMission !== 'all' ? selectedMission : null,
      name: newItem.name,
      mass_kg: newItem.mass_kg,
      volume_m3: newItem.mass_kg * 0.4, // Mock volume calculation
      criticality: Math.floor(Math.random() * 10) + 1,
      category: 'Equipment',
      unit: newItem.unit,
      facility: newItem.facility,
      sub_location: newItem.sub_location,
      is_reserve: false
    };
    setInventory([...inventory, newInventoryItem]);
    setShowAddItemModal(false);
    setNewItem({ name: '', mass_kg: 0, unit: 'kg', facility: '', sub_location: '' });
    showToast('Item added successfully');
  };

  const handleAddISRU = async () => {
    await simulateAction('Adding ISRU profile');
    const newProfile: ISRUProfile = {
      isru_id: `isru-${Date.now().toString().slice(-3)}`,
      resource_type: newISRU.resource_type,
      production_rate: newISRU.production_rate,
      unit: newISRU.unit,
      isru_percentage: Math.floor(Math.random() * 50) + 20,
      net_stock_day_30: newISRU.production_rate * 30
    };
    setISRUProfiles([...isruProfiles, newProfile]);
    setShowAddISRUModal(false);
    setNewISRU({ resource_type: '', production_rate: 0, unit: 'L/day' });
    showToast('ISRU profile added successfully');
  };

  const handleAddRule = async () => {
    await simulateAction('Adding autonomy rule');
    const newAutonomyRule: AutonomyRule = {
      rule_id: `rule-${Date.now().toString().slice(-3)}`,
      resource_type: newRule.resource_type,
      condition: newRule.condition,
      action: newRule.action,
      priority: newRule.priority
    };
    setAutonomyRules([...autonomyRules, newAutonomyRule]);
    setShowAddRuleModal(false);
    setNewRule({ resource_type: '', condition: '', action: '', priority: 5 });
    showToast('Autonomy rule added successfully');
  };

  const handleSimulation = async (type: string) => {
    await simulateAction(`Running ${type} simulation`);
    if (type === 'consumption') {
      showToast('Simulation complete: 85% criticality score');
    } else if (type === 'isru') {
      showToast('ISRU simulation complete: 40% production efficiency');
    }
  };

  const handleExport = async (type: string) => {
    await simulateAction(`Exporting ${type}`);
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`);
  };

  const handleUpload = async () => {
    await simulateAction(`Uploading ${uploadType} CSV`);
    setShowUploadModal(false);
    showToast(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} CSV uploaded successfully`);
  };

  const getCriticalityColor = (criticality: number) => {
    if (criticality >= 8) return 'text-red-400';
    if (criticality >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900/90 border border-gray-800/50 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-blue-500/10">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Mode Badge and Mission Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 rounded-full border border-blue-500/30">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Earth Planning Mode: Online, Cloud-Connected</span>
            </div>
            
            <select 
              value={selectedMission}
              onChange={(e) => setSelectedMission(e.target.value)}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Missions</option>
              {mockMissions.map(mission => (
                <option key={mission.mission_id} value={mission.mission_id}>
                  {mission.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Role:</span>
            <button
              onClick={() => setUserRole(userRole === 'Planner' ? 'Operator' : 'Planner')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                userRole === 'Planner'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
              }`}
            >
              {userRole}
            </button>
          </div>
        </div>

        {/* Mission Details */}
        {selectedMissionData && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{selectedMissionData.passengers} Passengers</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{selectedMissionData.destination}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{selectedMissionData.vehicle}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{selectedMissionData.max_mass_kg.toLocaleString()} kg max</span>
            </div>
          </div>
        )}

        {/* Overview Metrics */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg border border-gray-800/50">
            <div className="text-2xl font-bold text-blue-400">+{mockMetrics.efficiency_gain}%</div>
            <div className="text-sm text-gray-400">Efficiency Gain</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg border border-gray-800/50">
            <div className="text-2xl font-bold text-purple-400">{mockMetrics.criticality_score}%</div>
            <div className="text-sm text-gray-400">Criticality Score</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg border border-gray-800/50">
            <div className="text-2xl font-bold text-green-400">{mockMetrics.isru_contribution}%</div>
            <div className="text-sm text-gray-400">ISRU Contribution</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg border border-gray-800/50">
            <div className="text-2xl font-bold text-yellow-400">{mockMetrics.depletion_avg} Days</div>
            <div className="text-sm text-gray-400">Avg Depletion</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Inventory Section */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Digital Inventory</h2>
            </div>
            {userRole === 'Planner' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Item</span>
                </button>
                <button
                  onClick={() => {
                    setUploadType('inventory');
                    setShowUploadModal(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 text-gray-400">Item ID</th>
                  <th className="text-left py-2 text-gray-400">Name</th>
                  <th className="text-left py-2 text-gray-400">Mass/Volume</th>
                  <th className="text-left py-2 text-gray-400">Criticality</th>
                  <th className="text-left py-2 text-gray-400">Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.slice(0, 5).map((item) => (
                  <tr key={item.item_id} className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-3 font-mono text-blue-400">{item.item_id}</td>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-gray-300">{item.mass_kg}{item.unit} / {item.volume_m3}m³</td>
                    <td className="py-3">
                      <span className={`font-semibold ${getCriticalityColor(item.criticality)}`}>
                        {item.criticality}/10
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{item.facility} - {item.sub_location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No inventory data - upload CSV to get started
            </div>
          )}
        </div>

        {/* Analytics Section */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Resource Analytics</h2>
            </div>
            {userRole === 'Planner' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSimulation('consumption')}
                  disabled={loading === 'Running consumption simulation'}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors duration-200 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Simulate</span>
                </button>
                <button
                  onClick={() => {
                    setUploadType('consumption');
                    setShowUploadModal(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* Consumption Profiles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 text-gray-400">Resource</th>
                  <th className="text-left py-2 text-gray-400">Rate</th>
                  <th className="text-left py-2 text-gray-400">Depletion</th>
                  <th className="text-left py-2 text-gray-400">Stock</th>
                </tr>
              </thead>
              <tbody>
                {consumptionProfiles.map((profile) => (
                  <tr key={profile.profile_id} className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-3 font-medium">{profile.resource_type}</td>
                    <td className="py-3 text-gray-300">{profile.consumption_rate} {profile.unit}</td>
                    <td className="py-3">
                      <span className={profile.depletion_days < 14 ? 'text-red-400' : profile.depletion_days < 30 ? 'text-yellow-400' : 'text-green-400'}>
                        {profile.depletion_days} days
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{profile.current_stock} {profile.unit.split('/')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mock Chart Visualization */}
          <div className="mt-6 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Consumption Timeline (30 Days)</h3>
            <div className="h-32 flex items-end justify-between space-x-1">
              {Array.from({length: 15}, (_, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-purple-500/60 to-purple-400/20 rounded-t" 
                     style={{height: `${20 + Math.random() * 80}%`}}></div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">Days 1-30 projected consumption</div>
          </div>
        </div>

        {/* ISRU Section */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Factory className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold">ISRU Production</h2>
            </div>
            {userRole === 'Planner' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddISRUModal(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Profile</span>
                </button>
                <button
                  onClick={() => handleSimulation('isru')}
                  disabled={loading === 'Running isru simulation'}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors duration-200 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Simulate</span>
                </button>
              </div>
            )}
          </div>

          {/* ISRU Profiles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 text-gray-400">Resource</th>
                  <th className="text-left py-2 text-gray-400">Production</th>
                  <th className="text-left py-2 text-gray-400">ISRU %</th>
                  <th className="text-left py-2 text-gray-400">Net Stock (30d)</th>
                </tr>
              </thead>
              <tbody>
                {isruProfiles.map((profile) => (
                  <tr key={profile.isru_id} className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-3 font-medium">{profile.resource_type}</td>
                    <td className="py-3 text-gray-300">{profile.production_rate} {profile.unit}</td>
                    <td className="py-3">
                      <span className="text-green-400 font-semibold">{profile.isru_percentage}%</span>
                    </td>
                    <td className="py-3 text-gray-300">{profile.net_stock_day_30} {profile.unit.split('/')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ISRU Production Chart */}
          <div className="mt-6 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
            <h3 className="text-sm font-medium text-gray-400 mb-3">ISRU vs Earth Supply</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>ISRU Production</span>
                  <span className="text-green-400">{mockMetrics.isru_contribution}%</span>
                </div>
                <div className="bg-gray-700/50 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: `${mockMetrics.isru_contribution}%`}}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Earth Supply</span>
                  <span className="text-blue-400">{100 - mockMetrics.isru_contribution}%</span>
                </div>
                <div className="bg-gray-700/50 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: `${100 - mockMetrics.isru_contribution}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Autonomy Rules */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Autonomy Rules</h3>
              {userRole === 'Planner' && (
                <button
                  onClick={() => setShowAddRuleModal(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Rule</span>
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {autonomyRules.slice(0, 3).map((rule) => (
                <div key={rule.rule_id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{rule.resource_type}: {rule.condition}</div>
                    <div className="text-xs text-gray-400">{rule.action}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Priority:</span>
                    <span className={`text-xs font-medium ${
                      rule.priority >= 8 ? 'text-red-400' : rule.priority >= 6 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {rule.priority}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold">System Admin</h2>
            </div>
            {userRole === 'Planner' && (
              <button
                onClick={() => handleExport('logs')}
                disabled={loading === 'Exporting logs'}
                className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors duration-200 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export Logs</span>
              </button>
            )}
          </div>

          {/* Audit Logs */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.log_id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{log.user_id.split('.')[0][0].toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{log.action}</div>
                      <div className="text-xs text-gray-400">by {log.user_id}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div>
            <h3 className="text-lg font-medium mb-4">Usage Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <div className="text-2xl font-bold text-blue-400">15</div>
                <div className="text-sm text-gray-400">Manifests Generated</div>
              </div>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <div className="text-2xl font-bold text-purple-400">8</div>
                <div className="text-sm text-gray-400">Simulations Run</div>
              </div>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <div className="text-2xl font-bold text-green-400">24</div>
                <div className="text-sm text-gray-400">Items Tracked</div>
              </div>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
                <div className="text-2xl font-bold text-yellow-400">12</div>
                <div className="text-sm text-gray-400">Active Rules</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">System Alerts</h2>
          </div>
          <button
            onClick={() => handleExport('report')}
            disabled={loading === 'Exporting report'}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Report</span>
          </button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="text-sm">{alert.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(alert.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900/90 rounded-xl p-8 border border-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="text-lg">{loading}...</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/10 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} CSV</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-700/50 rounded-lg p-8 text-center bg-gray-800/20">
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Drop your CSV file here or click to browse</p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csvUpload"
              />
              <label
                htmlFor="csvUpload"
                className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200 cursor-pointer"
              >
                Select File
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/10 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add New Item</h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Enter item name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mass (kg)</label>
                  <input
                    type="number"
                    value={newItem.mass_kg}
                    onChange={(e) => setNewItem({ ...newItem, mass_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="kWh">kWh</option>
                    <option value="set">set</option>
                    <option value="unit">unit</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Facility</label>
                <input
                  type="text"
                  value={newItem.facility}
                  onChange={(e) => setNewItem({ ...newItem, facility: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g., Moon Station"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sub-Location</label>
                <input
                  type="text"
                  value={newItem.sub_location}
                  onChange={(e) => setNewItem({ ...newItem, sub_location: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g., Bay 1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.facility}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add ISRU Modal */}
      {showAddISRUModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/10 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add ISRU Profile</h3>
              <button
                onClick={() => setShowAddISRUModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Resource Type</label>
                <input
                  type="text"
                  value={newISRU.resource_type}
                  onChange={(e) => setNewISRU({ ...newISRU, resource_type: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="e.g., Water, Oxygen, Methane"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Production Rate</label>
                  <input
                    type="number"
                    value={newISRU.production_rate}
                    onChange={(e) => setNewISRU({ ...newISRU, production_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Unit</label>
                  <select
                    value={newISRU.unit}
                    onChange={(e) => setNewISRU({ ...newISRU, unit: e.target.value })}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <option value="L/day">L/day</option>
                    <option value="kg/day">kg/day</option>
                    <option value="kWh/day">kWh/day</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddISRUModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddISRU}
                disabled={!newISRU.resource_type || newISRU.production_rate <= 0}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/10 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add Autonomy Rule</h3>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Resource Type</label>
                <input
                  type="text"
                  value={newRule.resource_type}
                  onChange={(e) => setNewRule({ ...newRule, resource_type: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="e.g., Oxygen, Water, Power"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Condition</label>
                <input
                  type="text"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="e.g., stock < 20%, depletion < 7 days"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Action</label>
                <input
                  type="text"
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="e.g., Allocate Reserve, Increase Production"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Priority (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newRule.priority}
                  onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) || 5 })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                disabled={!newRule.resource_type || !newRule.condition || !newRule.action}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}