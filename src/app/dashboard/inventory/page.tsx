"use client";

import React, { useState, useMemo } from 'react'
import { Plus, Upload, MapPin, Filter, X, Search, Download, Warehouse, Building, Home, Factory, Store, Package } from 'lucide-react';
import data from "../../dummy.json";
// Mock data
const mockData = data;

function InventoryManagement() {
  const [data, setData] = useState(mockData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMethod, setCreateMethod] = useState('manual'); // 'manual', 'csv', 'location'
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const iconOptions = [
  { value: 'Warehouse', label: 'Warehouse', icon: Warehouse },
  { value: 'Building', label: 'Building', icon: Building },
  { value: 'Home', label: 'Home', icon: Home },
  { value: 'Factory', label: 'Factory', icon: Factory },
  { value: 'Store', label: 'Store', icon: Store },
  { value: 'Package', label: 'Package', icon: Package }
];
  const [locationFormData, setLocationFormData] = useState({
  name: '',
  icon: ''
});
const [editingLocation, setEditingLocation] = useState(null);
const getLocationDetails = (placeIdData) => {
  if (!placeIdData) return { name: "Unknown location", details: [] };
  
  // Handle both array and single object cases
  const placeIdArray = Array.isArray(placeIdData) ? placeIdData : [placeIdData];
  
  const details = placeIdArray.map(place => {
    const location = locations.find(l => l.id === place.value);
    return {
      locationName: location ? location.name : "Unknown location",
      locationIcon: location ? location.icon : null,
      date: place.date,
      responsible: place.responsible,
      image: place.image
    };
  });
  
  return { details };
};
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    mission: '',
    client: '',
    criticality: ''
  });

  // Form state for manual creation
  const [formData, setFormData] = useState({
    name: '',
    mass: '',
    volume: '',
    criticality: '',
    placeId: '',
    subLocation: '',
    case: '',
    status: 'Stored',
    clientId: '',
    missionId: ''
  });

  const inventory = data.inventory;
  const clients = data.clients;
  const missions = data.missions;
  const locations = data.locations;

  // Helper functions
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Personal";
  };

  const getMissionName = (missionId) => {
    const mission = missions.find(c => c.id === missionId);
    return mission ? mission.name : "Unknown Mission";
  };

  const getLocationName = (locationId) => {
    const location = locations.find(c => c.id === locationId);
    return location ? location.name : "Unknown location";
  };

  // Stats calculations
  const deliveredCount = inventory.filter(item => item.status === "Delivered").length;
  const shippedCount = inventory.filter(item => item.status === "Shipped").length;
  const storedCount = inventory.filter(item => item.status === "Stored").length;

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesLocation = !filters.location || 
  (Array.isArray(item.placeId) 
    ? item.placeId.some(place => place.value === filters.location)
    : item.placeId?.value === filters.location);
      const matchesMission = !filters.mission || item.missionId === filters.mission;
      const matchesClient = !filters.client || item.clientId === filters.client;
      const matchesCriticality = !filters.criticality || 
        (filters.criticality === 'null' ? !item.criticality : 
         filters.criticality === 'high' ? item.criticality >= 7 :
         filters.criticality === 'medium' ? item.criticality >= 4 && item.criticality < 7 :
         item.criticality < 4);

      return matchesSearch && matchesStatus && matchesLocation && matchesMission && 
             matchesClient && matchesCriticality;
    });
  }, [inventory, searchTerm, filters]);

  const handleCreateItem = (e) => {
    e.preventDefault();
    
    if (createMethod === 'manual') {
      const newItem = {
        id: 'new_' + Date.now(),
        ...formData,
        mass: parseFloat(formData.mass) || 0,
        volume: parseFloat(formData.volume) || 0,
        criticality: formData.criticality ? parseFloat(formData.criticality) : null,
        createdAt: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        inventory: [...prev.inventory, newItem]
      }));
      
      setFormData({
        name: '',
        mass: '',
        volume: '',
        criticality: '',
        placeId: '',
        subLocation: '',
        case: '',
        status: 'Stored',
        clientId: '',
        missionId: ''
      });
    }
    
    setShowCreateModal(false);
  };

  const handleCreateLocation = (e) => {
  e.preventDefault();
  const newLocation = {
    id: 'loc_' + Date.now(),
    ...locationFormData
  };
  
  setData(prev => ({
    ...prev,
    locations: [...prev.locations, newLocation]
  }));
  
  setLocationFormData({ name: '', icon: '' });
};

const handleUpdateLocation = (e) => {
  e.preventDefault();
  setData(prev => ({
    ...prev,
    locations: prev.locations.map(loc => 
      loc.id === editingLocation.id 
        ? { ...editingLocation, ...locationFormData }
        : loc
    )
  }));
  
  setEditingLocation(null);
  setLocationFormData({ name: '', icon: '' });
};

const handleDeleteLocation = (locationId) => {
  if (confirm('Are you sure you want to delete this location?')) {
    setData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== locationId)
    }));
  }
};

  const resetFilters = () => {
    setFilters({
      status: '',
      location: '',
      mission: '',
      client: '',
      criticality: ''
    });
    setSearchTerm('');
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Delivered': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Shipped': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Stored': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`;
  };

  const getCriticalityBadge = (criticality) => {
    if (!criticality) return <span className="text-gray-500">N/A</span>;
    
    const color = criticality >= 7 ? 'text-red-400' : 
                  criticality >= 4 ? 'text-yellow-400' : 'text-green-400';
    
    return <span className={`font-medium ${color}`}>{criticality}</span>;
  };

  return (
    <div className='min-h-screen text-white p-4 sm:p-6 lg:p-8'>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Inventory Management
            </h1>
            <p className="text-gray-400">Manage your space mission inventory</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 p-6 rounded-2xl'>
            <h3 className="text-blue-400 text-sm font-medium mb-2">Total Items</h3>
            <p className="text-3xl font-bold">{inventory.length}</p>
          </div>
          <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 p-6 rounded-2xl'>
            <h3 className="text-green-400 text-sm font-medium mb-2">Delivered</h3>
            <p className="text-3xl font-bold">{deliveredCount}</p>
          </div>
          <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 p-6 rounded-2xl'>
            <h3 className="text-purple-400 text-sm font-medium mb-2">Shipped</h3>
            <p className="text-3xl font-bold">{shippedCount}</p>
          </div>
          <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 p-6 rounded-2xl'>
            <h3 className="text-yellow-400 text-sm font-medium mb-2">Stored</h3>
            <p className="text-3xl font-bold">{storedCount}</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl hover:bg-slate-700/50 transition-colors flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Reset All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">All Status</option>
                <option value="Stored">Stored</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>

              <select
                value={filters.mission}
                onChange={(e) => setFilters(prev => ({...prev, mission: e.target.value}))}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">All Missions</option>
                {missions.map(mission => (
                  <option key={mission.id} value={mission.id}>{mission.name}</option>
                ))}
              </select>

              <select
                value={filters.client}
                onChange={(e) => setFilters(prev => ({...prev, client: e.target.value}))}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">All Clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>

              <select
                value={filters.criticality}
                onChange={(e) => setFilters(prev => ({...prev, criticality: e.target.value}))}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="">All Criticality</option>
                <option value="high">High (7+)</option>
                <option value="medium">Medium (4-6)</option>
                <option value="low">Low (0-3)</option>
                <option value="null">Not Set</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className='w-full'>
              <thead className="bg-slate-700/30">
                <tr>
                  <th className='text-left p-4 font-medium text-gray-300'>ID</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Name</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Mass</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Volume</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Criticality</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Location Details</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Sub Location</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Mission</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Status</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Client</th>
                  <th className='text-left p-4 font-medium text-gray-300'>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className='p-4 text-blue-400 font-mono text-sm'>{item.id}</td>
                    <td className='p-4 font-medium'>{item.name}</td>
                    <td className='p-4 text-gray-300'>{item.mass?.toLocaleString() || 0} kg</td>
                    <td className='p-4 text-gray-300'>{item.volume?.toLocaleString() || 0} m³</td>
                    <td className='p-4'>{getCriticalityBadge(item.criticality)}</td>
                    <td className='p-4 text-gray-300'>
                    <td className='p-4 text-gray-300'>
                      <div className="space-y-2">
                        {(() => {
                          const { details } = getLocationDetails(item.placeId);
                          return details.map((detail, index) => (
                            <div key={index} className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30">
                              <div className="flex items-center gap-2 mb-2">
                                {(() => {
                                  const IconComponent = iconOptions.find(opt => opt.value === detail.locationIcon)?.icon;
                                  return IconComponent ? <IconComponent size={16} className="text-gray-400" /> : null;
                                })()}
                                <span className="font-medium text-blue-400">{detail.locationName}</span>
                              </div>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">Date:</span>
                                  <span className="text-gray-300">{new Date(detail.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">Responsible:</span>
                                  <span className="text-gray-300">{detail.responsible}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">Image:</span>
                                  <span className="text-gray-300 hover:cursor-pointer"><a target='_blank' href={detail.image}>View</a></span>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </td>
                  </td>
                    <td className='p-4 text-gray-300'>{item.subLocation}</td>
                    <td className='p-4 text-gray-300'>{getMissionName(item.missionId)}</td>
                    <td className='p-4'>
                      <span className={getStatusBadge(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className='p-4 text-gray-300'>{getClientName(item.clientId)}</td>
                    <td className='p-4 text-gray-400 text-sm'>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/95 backdrop-blur border border-slate-600/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Add New Item</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3 text-gray-300">Creation Method</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setCreateMethod('manual')}
                      className={`p-4 rounded-xl border transition-colors ${
                        createMethod === 'manual' 
                          ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' 
                          : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <Plus className="mx-auto mb-2" size={24} />
                      <div className="text-sm font-medium">Manual Entry</div>
                    </button>
                    <button
                      onClick={() => setCreateMethod('csv')}
                      className={`p-4 rounded-xl border transition-colors ${
                        createMethod === 'csv' 
                          ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' 
                          : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <Upload className="mx-auto mb-2" size={24} />
                      <div className="text-sm font-medium">CSV Upload</div>
                    </button>
                    <button
                      onClick={() => setCreateMethod('location')}
                      className={`p-4 rounded-xl border transition-colors ${
                        createMethod === 'location' 
                          ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' 
                          : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <MapPin className="mx-auto mb-2" size={24} />
                      <div className="text-sm font-medium">By Location</div>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreateItem}>
                  {createMethod === 'manual' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Item Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                          >
                            <option value="Stored">Stored</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Mass (kg)</label>
                          <input
                            type="number"
                            value={formData.mass}
                            onChange={(e) => setFormData({...formData, mass: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Volume (m³)</label>
                          <input
                            type="number"
                            value={formData.volume}
                            onChange={(e) => setFormData({...formData, volume: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
                          <select
                            value={formData.placeId}
                            onChange={(e) => setFormData({...formData, placeId: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                          >
                            <option value="">Select location</option>
                            {locations.map(location => (
                              <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Sub Location</label>
                          <input
                            type="text"
                            value={formData.subLocation}
                            onChange={(e) => setFormData({...formData, subLocation: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="e.g., Bin A1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Mission</label>
                          <select
                            value={formData.missionId}
                            onChange={(e) => setFormData({...formData, missionId: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                          >
                            <option value="">Select mission</option>
                            {missions.map(mission => (
                              <option key={mission.id} value={mission.id}>{mission.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Client</label>
                          <select
                            value={formData.clientId}
                            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                          >
                            <option value="">Select client</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Criticality (0-10)</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={formData.criticality}
                            onChange={(e) => setFormData({...formData, criticality: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Case</label>
                          <input
                            type="text"
                            value={formData.case}
                            onChange={(e) => setFormData({...formData, case: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            placeholder="Case identifier"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {createMethod === 'csv' && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-600/50 rounded-lg">
                      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                      <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                      <p className="text-gray-400 mb-4">Drag and drop your CSV file or click to browse</p>
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        id="csv-upload"
                      />
                      <label
                        htmlFor="csv-upload"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                      <div className="mt-4 text-sm text-gray-400">
                        <p>CSV should include columns: name, mass, volume, criticality, location, subLocation, case, status, client, mission</p>
                      </div>
                    </div>
                  )}

                  {createMethod === 'location' && (
                    <div className="space-y-6">
                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <MapPin className="text-blue-400" size={20} />
                          Location Management
                        </h3>
                        
                        {/* Add/Edit Location Form */}
                          <div className="mb-6">               
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Location Name</label>
                              <input
                                type="text"
                                required
                                value={locationFormData.name}
                                onChange={(e) => setLocationFormData({...locationFormData, name: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                                placeholder="Enter location name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Icon</label>
                              <select
                              value={locationFormData.icon}
                              onChange={(e) => setLocationFormData({...locationFormData, icon: e.target.value})}
                              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                            >
                              <option value="">Select icon</option>
                              {iconOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={editingLocation ? handleUpdateLocation : handleCreateLocation}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                            >
                              {editingLocation ? 'Update Location' : 'Add Location'}
                            </button>
                            {editingLocation && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLocation(null);
                                  setLocationFormData({ name: '', icon: '' });
                                }}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Locations List */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="font-medium mb-3">All Locations ({locations.length})</h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {locations.map(location => (
                              <div key={location.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {(() => {
                                    const IconComponent = iconOptions.find(opt => opt.value === location.icon)?.icon;
                                    return IconComponent ? <IconComponent size={23} className="text-gray-400" /> : null;
                                  })()}
                                  <span className="text-sm font-medium">{location.name}</span>
                                  <span className="text-xs text-gray-400 bg-slate-600/30 px-2 py-1 rounded">
                                    {location.icon || 'No icon'}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setEditingLocation(location);
                                      setLocationFormData({ name: location.name, icon: location.icon || '' });
                                    }}
                                    className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1 rounded hover:bg-slate-600/30"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteLocation(location.id)}
                                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-slate-600/30"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                            {locations.length === 0 && (
                              <div className="text-center py-8 text-gray-400">
                                No locations available. Add your first location above.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createMethod !== 'manual'}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      {createMethod === 'manual' ? 'Create Item' : createMethod === 'csv' ? 'Upload & Process' : 'Add Selected Items'}
                    </button>
                  </div>
                </form>

                {/* Show results count */}
                {filteredInventory.length !== inventory.length && (
                  <div className="mt-4 text-center text-sm text-gray-400">
                    Showing {filteredInventory.length} of {inventory.length} items
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm || Object.values(filters).some(f => f) ? 'No items match your filters' : 'No inventory items found'}
            </div>
            {(searchTerm || Object.values(filters).some(f => f)) && (
              <button
                onClick={resetFilters}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryManagement