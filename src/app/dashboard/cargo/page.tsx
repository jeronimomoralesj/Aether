"use client";
import React, { useState } from "react";
import { 
  Plus, 
  X, 
  Package, 
  Download, 
  Calendar,
  MapPin,
  Users,
  Rocket,
  Upload,
  Search,
  Filter
} from "lucide-react";
import CargoPlanner from "./inventory";
import Csv from "./csv";
import all from "../../dummy.json";

// Mock data based on your JSON structure
const data = all;

// Define TypeScript interfaces
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
  cargo: string[];
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  id: string;
  missionId: string;
  name: string;
  mass: number;
  volume: number;
  criticality: number | null;
  status: string;
  clientId: string | null;
  createdAt: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Modal Component - Updated with proper scrolling
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-gray-800/50 rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50" />
        <div className="relative flex flex-col h-full overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-800/50 rounded-lg z-10"
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

// Inventory Selection Component
const InventorySelection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const availableInventory = data.inventory.filter(item => !item.missionId);
  
  const filteredInventory = availableInventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">      
      <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
  <CargoPlanner inModal={true} />
</div>
    </div>
  );
};

// CSV Upload Component
const CsvUpload: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-2">Upload Cargo CSV</h3>
        <p className="text-gray-400 text-sm">Upload a CSV file to add multiple cargo items at once</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <Csv />
      </div>
    </div>
  );
};

// Mission Details Modal Component - Updated with proper scrolling
interface MissionDetailsModalProps {
  mission: Mission;
  onClose: () => void;
}

const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({ mission, onClose }) => {
  const missionInventory = data.inventory.filter(item => item.missionId === mission.id);
  const totalMass = missionInventory.reduce((sum, item) => sum + item.mass, 0);
  const totalVolume = missionInventory.reduce((sum, item) => sum + item.volume, 0);

  const handleDownloadManifest = () => {
    // Mock PDF download functionality
    console.log("Downloading manifest for mission:", mission.name);
    // In real implementation, you'd generate and download a PDF here
    alert(`Downloading manifest for ${mission.name}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-800/50">
        <div className="flex items-start space-x-4">
          <img 
            src={mission.coverImage} 
            alt={mission.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{mission.name}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-2 text-blue-400" />
                Destination: {mission.destination}
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar size={16} className="mr-2 text-purple-400" />
                Start: {new Date(mission.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-300">
                <Users size={16} className="mr-2 text-green-400" />
                Passengers: {mission.passengerCount}
              </div>
              <div className="flex items-center text-gray-300">
                <Rocket size={16} className="mr-2 text-orange-400" />
                Duration: {mission.durationDays} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cargo Summary - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Cargo Manifest</h3>
          <button
            onClick={handleDownloadManifest}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <Download size={18} />
            <span>Download Manifest</span>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Total Items</p>
            <p className="text-2xl font-bold text-white">{missionInventory.length}</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Total Mass</p>
            <p className="text-2xl font-bold text-blue-400">{totalMass.toLocaleString()} kg</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Total Volume</p>
            <p className="text-2xl font-bold text-purple-400">{totalVolume.toLocaleString()} m³</p>
          </div>
        </div>
      </div>

      {/* Inventory List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <h4 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-gradient-to-b from-gray-900 via-black to-transparent pb-2">
          Assigned Inventory
        </h4>
        {missionInventory.length > 0 ? (
          <div className="space-y-3">
            {missionInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Package size={18} className="text-blue-400" />
                  <div>
                    <h5 className="text-white font-medium">{item.name}</h5>
                    <p className="text-gray-400 text-sm">
                      Mass: {item.mass.toLocaleString()}kg • Volume: {item.volume}m³
                      {item.criticality && <span className="ml-2 text-red-400">Critical: {item.criticality}/10</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Shipped' ? 'bg-green-900/50 text-green-400' :
                    item.status === 'Stored' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-gray-900/50 text-gray-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No cargo assigned to this mission yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

function Page() {
  const [openCargoModal, setOpenCargoModal] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<string>("inventory");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
  };

  const handleCloseCargoModal = () => {
    setOpenCargoModal(false);
    // Reset to default mode when closing modal
    setSelectedMode("inventory");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Cargo Management</h1>
        <button
          onClick={() => setOpenCargoModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          <Plus size={20} />
          <span>Assign Cargo</span>
        </button>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.missions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => handleMissionClick(mission)}
            className="group cursor-pointer bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-gray-800/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
          >
            {/* Mission Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={mission.coverImage} 
                alt={mission.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-blue-600/90 text-white text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>

            {/* Mission Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{mission.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin size={14} className="mr-2 text-blue-400" />
                  {mission.destination}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar size={14} className="mr-2 text-purple-400" />
                  {new Date(mission.startDate).toLocaleDateString()}
                </div>
              </div>

              {/* Cargo Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-blue-400" />
                  <span className="text-gray-300 text-sm">
                    {mission.cargo?.length > 0 ? `${mission.cargo.length} items` : "No cargo"}
                  </span>
                </div>
                <div className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors duration-200">
                  View Details →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Cargo Modal */}
      <Modal isOpen={openCargoModal} onClose={handleCloseCargoModal}>
        <div className="flex flex-col h-full">
          {/* Modal Header - Fixed */}
          <div className="flex-shrink-0 p-6 border-b border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-4">Assign Cargo</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedMode("inventory")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedMode === "inventory"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Select from Inventory
              </button>
              <button
                onClick={() => setSelectedMode("csv")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedMode === "csv"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Upload CSV
              </button>
            </div>
          </div>
          
          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-hidden">
            {selectedMode === "inventory" ? <InventorySelection /> : <CsvUpload />}
          </div>
        </div>
      </Modal>

      {/* Mission Details Modal */}
      <Modal isOpen={!!selectedMission} onClose={() => setSelectedMission(null)}>
        {selectedMission && (
          <MissionDetailsModal 
            mission={selectedMission} 
            onClose={() => setSelectedMission(null)} 
          />
        )}
      </Modal>
    </div>
  );
}

export default Page;