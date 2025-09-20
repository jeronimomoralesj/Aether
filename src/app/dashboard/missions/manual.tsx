import { useState } from "react";

interface Mission {
  name: string;
  destination: string;
  startDate: string;
  durationDays: number;
  shipId: string;
  passengerCount: number;
  launchLocation: string;
  coverImage: string;
}

interface Ship {
  name: string;
  image: string;
  cargoCapacity: number;
  volumeCapacity: number;
}

interface ManualFormProps {
  activeTab: 'missions' | 'ships';
  onSubmit: (items: Mission[] | Ship[]) => void;
  onCancel: () => void;
}

export default function ManualForm({ activeTab, onSubmit, onCancel }: ManualFormProps) {
  const [formData, setFormData] = useState<Mission | Ship>(
    activeTab === 'missions'
      ? {
          name: '',
          destination: '',
          startDate: '',
          durationDays: 0,
          shipId: '',
          passengerCount: 0,
          launchLocation: '',
          coverImage: ''
        } as Mission
      : {
          name: '',
          image: '',
          cargoCapacity: 0,
          volumeCapacity: 0
        } as Ship
  );

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    if (activeTab === 'missions') {
      const missionData = formData as Mission;
      if (!missionData.destination.trim() || !missionData.startDate) {
        alert('Destination and Start Date are required for missions');
        return;
      }
    }

    onSubmit([formData] as Mission[] | Ship[]);
  };

  return (
    <div>
      {activeTab === 'missions' ? (
        // Mission Form
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mission Name *
            </label>
            <input
              type="text"
              placeholder="Mission Name"
              value={(formData as Mission).name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Destination *
            </label>
            <input
              type="text"
              placeholder="Destination"
              value={(formData as Mission).destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date *
            </label>
            <input
              type="datetime-local"
              value={(formData as Mission).startDate?.slice(0, 16) || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value + ':00Z')}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (days)
            </label>
            <input
              type="number"
              placeholder="Duration in days"
              value={(formData as Mission).durationDays || ''}
              onChange={(e) => handleInputChange('durationDays', parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ship ID
            </label>
            <input
              type="text"
              placeholder="Ship ID"
              value={(formData as Mission).shipId}
              onChange={(e) => handleInputChange('shipId', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passenger Count
            </label>
            <input
              type="number"
              placeholder="Number of passengers"
              value={(formData as Mission).passengerCount || ''}
              onChange={(e) => handleInputChange('passengerCount', parseInt(e.target.value) || 0)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Launch Location
            </label>
            <input
              type="text"
              placeholder="Launch Location"
              value={(formData as Mission).launchLocation}
              onChange={(e) => handleInputChange('launchLocation', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image URL
            </label>
            <input
              type="text"
              placeholder="Cover Image URL (optional)"
              value={(formData as Mission).coverImage}
              onChange={(e) => handleInputChange('coverImage', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        // Ship Form
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ship Name *
            </label>
            <input
              type="text"
              placeholder="Ship Name"
              value={(formData as Ship).name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              placeholder="Ship Image URL (optional)"
              value={(formData as Ship).image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cargo Capacity (kg)
            </label>
            <input
              type="number"
              placeholder="Cargo capacity in kg"
              value={(formData as Ship).cargoCapacity || ''}
              onChange={(e) => handleInputChange('cargoCapacity', parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Volume Capacity (m³)
            </label>
            <input
              type="number"
              placeholder="Volume capacity in m³"
              value={(formData as Ship).volumeCapacity || ''}
              onChange={(e) => handleInputChange('volumeCapacity', parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50">
        <button
          onClick={handleSubmit}
          disabled={!formData.name?.trim()}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create {activeTab === 'missions' ? 'Mission' : 'Ship'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors"
        >
          Cancelcccc
        </button>
      </div>
    </div>
  );
}