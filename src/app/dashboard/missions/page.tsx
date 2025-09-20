"use client";

import { useState, useEffect } from "react";
import { 
  Calendar,
  Clock,
  Rocket,
  Users,
  Package,
  MapPin,
  Edit,
  Save,
  X,
  Gauge,
  Volume2,
  Target,
  Timer,
  Plus,
  Search,
  Ship
} from "lucide-react";
import data from "../../dummy.json";
import ManualForm from "./manual";
import CsvForm from "./csv";

interface Mission {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  durationDays: number;
  shipId: string;
  passengerCount: number;
  launchLocation: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

interface Ship {
  id: string;
  name: string;
  image: string;
  cargoCapacity: number;
  volumeCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export default function MissionShipsManager() {
  const [activeTab, setActiveTab] = useState<'missions' | 'ships'>('missions');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [ships, setShips] = useState<Ship[]>([]); 
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Mission | Ship | null>(null);
  const [editingItem, setEditingItem] = useState<Mission | Ship | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMethod, setCreateMethod] = useState<'manual' | 'csv'>('manual');

  // Dummy images
  const missionImages = [
    "https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg",
    "https://images.pexels.com/photos/2159/flight-sky-earth-space.jpg",
    "https://images.pexels.com/photos/2166/flight-sky-earth-space.jpg"
  ];

  const shipImages = [
    "https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg",
    "https://images.pexels.com/photos/87009/earth-moon-space-jupiter-87009.jpeg",
    "https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg"
  ];

  useEffect(() => {
    setMissions(data.missions);
    setShips(data.ships);
  }, []);

  // Filter items based on search term and active tab
  const filteredItems = activeTab === 'missions' 
    ? missions.filter(mission => mission.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : ships.filter(ship => ship.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate countdown for missions
  const getCountdown = (startDate: string) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const difference = start - now;

    if (difference < 0) return "Mission Started";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleItemClick = (item: Mission | Ship) => {
    setSelectedItem(item);
    setEditingItem({ ...item });
  };

  const handleSaveItem = () => {
    if (!editingItem || !selectedItem) return;

    if (activeTab === 'missions') {
      setMissions(missions.map(mission => 
        mission.id === (selectedItem as Mission).id 
          ? { ...editingItem, updatedAt: new Date().toISOString() } as Mission
          : mission
      ));
    } else {
      setShips(ships.map(ship => 
        ship.id === (selectedItem as Ship).id 
          ? { ...editingItem, updatedAt: new Date().toISOString() } as Ship
          : ship
      ));
    }
    setSelectedItem(editingItem);
  };

  const handleCreateItems = (items: Mission[] | Ship[]) => {
    if (activeTab === 'missions') {
      const newMissions = (items as Mission[]).map(item => ({
        ...item,
        id: `mission-${Date.now()}-${Math.random()}`,
        coverImage: item.coverImage || missionImages[Math.floor(Math.random() * missionImages.length)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setMissions([...missions, ...newMissions]);
    } else {
      const newShips = (items as Ship[]).map(item => ({
        ...item,
        id: `ship-${Date.now()}-${Math.random()}`,
        image: item.image || shipImages[Math.floor(Math.random() * shipImages.length)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setShips([...ships, ...newShips]);
    }
    setShowCreateModal(false);
  };

  const isMission = (item: Mission | Ship): item is Mission => {
    return 'destination' in item;
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              {activeTab === 'missions' ? 'Missions' : 'Ships'}
            </h1>
            <p className="text-gray-400">
              {activeTab === 'missions' ? 'Manage and monitor space missions' : 'Manage spacecraft fleet'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white'
            }`}
          >
            <Rocket size={16} className="inline mr-2" />
            Missions
          </button>
          <button
            onClick={() => setActiveTab('ships')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'ships'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white'
            }`}
          >
            <Ship size={16} className="inline mr-2" />
            Ships
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-end mb-6 sm:mb-8">
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-full sm:w-auto group flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl
                         transition-all duration-200 ease-in-out
                         hover:translate-y-[-2px] hover:shadow-lg
                         border border-transparent text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10"
            >
              Find {activeTab === 'missions' ? 'Mission' : 'Ship'} 
            </button>

            {showSearch && (
              <input
                autoFocus
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-purple-500/20 text-white rounded-xl p-3 h-12 shadow-lg border border-blue-500/30 text-sm placeholder-gray-300"
              />
            )}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto group flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl
                       transition-all duration-200 ease-in-out
                       hover:translate-y-[-2px] hover:shadow-lg
                       border border-transparent text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10"
          >
            Create {activeTab === 'missions' ? 'Mission' : 'Ship'}
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const isMissionItem = isMission(item);
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700/50
                           bg-gradient-to-br from-gray-800/50 to-gray-900/50
                           hover:from-gray-700/50 hover:to-gray-800/50
                           hover:border-blue-500/30 hover:shadow-blue-500/10
                           transition-all duration-300 ease-in-out
                           hover:translate-y-[-4px] cursor-pointer backdrop-blur-sm"
              >
                {/* Item Image */}
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={isMissionItem ? item.coverImage : item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {isMissionItem && (
                    <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs font-medium text-white">{getCountdown(item.startDate)}</span>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <h3 className="text-lg font-semibold mb-2 text-white truncate">{item.name}</h3>
                
                <div className="space-y-2 text-sm">
                  {isMissionItem ? (
                    <>
                      <div className="flex items-center text-gray-300">
                        <Target className="mr-2 text-purple-400" size={14} />
                        <span className="truncate">{item.destination}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-300">
                          <Users className="mr-1 text-cyan-400" size={14} />
                          <span>{item.passengerCount}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Clock className="mr-1 text-yellow-400" size={14} />
                          <span>{item.durationDays}d</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-300">
                          <Package className="mr-1 text-orange-400" size={14} />
                          <span>{item.cargoCapacity} kg</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Volume2 className="mr-1 text-green-400" size={14} />
                          <span>{item.volumeCapacity} m³</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Edit indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-4 right-4">
                  <Edit className="text-blue-400" size={16} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{selectedItem.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveItem}
                    className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Item Image */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <img 
                    src={isMission(selectedItem) ? selectedItem.coverImage : selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Edit Form */}
                {isMission(selectedItem) ? (
                  // Mission Edit Form
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={(editingItem as Mission)?.name || ''}
                        onChange={(e) => setEditingItem({...editingItem!, name: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                      <input
                        type="text"
                        value={(editingItem as Mission)?.destination || ''}
                        onChange={(e) => setEditingItem({...editingItem!, destination: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <input
                        type="datetime-local"
                        value={(editingItem as Mission)?.startDate?.slice(0, 16) || ''}
                        onChange={(e) => setEditingItem({...editingItem!, startDate: e.target.value + ':00Z'})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
                      <input
                        type="number"
                        value={(editingItem as Mission)?.durationDays || ''}
                        onChange={(e) => setEditingItem({...editingItem!, durationDays: parseInt(e.target.value)})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Ship ID</label>
                      <input
                        type="text"
                        value={(editingItem as Mission)?.shipId || ''}
                        onChange={(e) => setEditingItem({...editingItem!, shipId: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Passenger Count</label>
                      <input
                        type="number"
                        value={(editingItem as Mission)?.passengerCount || ''}
                        onChange={(e) => setEditingItem({...editingItem!, passengerCount: parseInt(e.target.value)})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Launch Location</label>
                      <input
                        type="text"
                        value={(editingItem as Mission)?.launchLocation || ''}
                        onChange={(e) => setEditingItem({...editingItem!, launchLocation: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
                      <input
                        type="text"
                        value={(editingItem as Mission)?.coverImage || ''}
                        onChange={(e) => setEditingItem({...editingItem!, coverImage: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  // Ship Edit Form
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={(editingItem as Ship)?.name || ''}
                        onChange={(e) => setEditingItem({...editingItem!, name: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                      <input
                        type="text"
                        value={(editingItem as Ship)?.image || ''}
                        onChange={(e) => setEditingItem({...editingItem!, image: e.target.value})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cargo Capacity (kg)</label>
                      <input
                        type="number"
                        value={(editingItem as Ship)?.cargoCapacity || ''}
                        onChange={(e) => setEditingItem({...editingItem!, cargoCapacity: parseFloat(e.target.value)})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Volume Capacity (m³)</label>
                      <input
                        type="number"
                        value={(editingItem as Ship)?.volumeCapacity || ''}
                        onChange={(e) => setEditingItem({...editingItem!, volumeCapacity: parseFloat(e.target.value)})}
                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  Create New {activeTab === 'missions' ? 'Mission' : 'Ship'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* Method Selection */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setCreateMethod('manual')}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                      createMethod === 'manual'
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                        : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    Manual Entry
                  </button>
                  <button
                    onClick={() => setCreateMethod('csv')}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                      createMethod === 'csv'
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                        : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    CSV Upload
                  </button>
                </div>

                {/* Render Form Component */}
                {createMethod === 'manual' ? (
                  <ManualForm
                    activeTab={activeTab}
                    onSubmit={handleCreateItems}
                    onCancel={() => setShowCreateModal(false)}
                  />
                ) : (
                  <CsvForm
                    activeTab={activeTab}
                    onSubmit={handleCreateItems}
                    onCancel={() => setShowCreateModal(false)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}