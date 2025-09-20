"use client";

import { Plus, Search, X, Edit2, Save, Phone, Mail, DollarSign, Clock, Users } from "lucide-react";
import { useState } from "react";
import data from "../../dummy.json";

export default function AdminPage() {
  const [clients, setClients] = useState(data.clients);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    contacts: [{ id: 1, name: "", email: "", phone: "" }],
    logo: "",
    cost: 0,
    revenue: 0,
    preferences: {
      periodicity: "every mission",
      users: [1],
    },
  });

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setEditingClient({ ...client });
  };

  const handleSaveClient = () => {
    setClients(clients.map(client => 
      client.id === editingClient.id ? editingClient : client
    ));
    setSelectedClient(editingClient);
  };

  const handleCreateClient = () => {
    const clientId = Math.random().toString(36).substr(2, 9);
    const clientToCreate = {
      ...newClient,
      id: clientId,
      missions: [], // Empty missions array for new clients
    };
    setClients([...clients, clientToCreate]);
    setShowCreateModal(false);
    setNewClient({
      name: "",
      contacts: [{ id: 1, name: "", email: "", phone: "" }],
      logo: "",
      cost: 0,
      revenue: 0,
      preferences: {
        periodicity: "every mission",
        users: [1],
      },
    });
  };

  const addContact = (isEditing = false) => {
    if (isEditing) {
      setEditingClient({
        ...editingClient,
        contacts: [...editingClient.contacts, {
          id: editingClient.contacts.length + 1,
          name: "",
          email: "",
          phone: ""
        }]
      });
    } else {
      setNewClient({
        ...newClient,
        contacts: [...newClient.contacts, {
          id: newClient.contacts.length + 1,
          name: "",
          email: "",
          phone: ""
        }]
      });
    }
  };

  const removeContact = (contactId, isEditing = false) => {
    if (isEditing) {
      setEditingClient({
        ...editingClient,
        contacts: editingClient.contacts.filter(contact => contact.id !== contactId)
      });
    } else {
      setNewClient({
        ...newClient,
        contacts: newClient.contacts.filter(contact => contact.id !== contactId)
      });
    }
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Clients</h1>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-end mb-6 sm:mb-8">
          {/* Find Client */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="w-full sm:w-auto group flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl
                         transition-all duration-200 ease-in-out
                         hover:translate-y-[-2px] hover:shadow-lg
                         border border-transparent text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Find Client <Search className="ml-2" size={15} />
            </button>

            {/* Search Input */}
            {showSearch && (
              <input
                autoFocus
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-purple-500/20 text-white rounded-xl p-3 h-12 shadow-lg border border-blue-500/30 text-sm placeholder-gray-300"
              />
            )}
          </div>

          {/* Create Client */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto group flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl
                       transition-all duration-200 ease-in-out
                       hover:translate-y-[-2px] hover:shadow-lg
                       border border-transparent text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            Create Client <Plus className="ml-2" size={15} />
          </button>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleClientClick(client)}
              className="group p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700/50
                         bg-gradient-to-br from-gray-800/50 to-gray-900/50
                         hover:from-gray-700/50 hover:to-gray-800/50
                         hover:border-blue-500/30 hover:shadow-blue-500/10
                         transition-all duration-300 ease-in-out
                         hover:translate-y-[-4px] cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <img 
                  className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg object-cover" 
                  src={client.logo} 
                  alt={client.name}
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Edit2 size={16} className="text-blue-400" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                {client.name}
              </h3>
              
              <div className="space-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <DollarSign size={12} />
                  <span>Cost: ${client.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={12} />
                  <span>Revenue: ${client.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Details Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img 
                    className="h-12 w-12 rounded-lg object-cover" 
                    src={selectedClient.logo} 
                    alt={selectedClient.name}
                  />
                  <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveClient}
                    className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={editingClient.name}
                      onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                    <input
                      type="text"
                      value={editingClient.logo}
                      onChange={(e) => setEditingClient({...editingClient, logo: e.target.value})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cost</label>
                    <input
                      type="number"
                      value={editingClient.cost}
                      onChange={(e) => setEditingClient({...editingClient, cost: Number(e.target.value)})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Revenue</label>
                    <input
                      type="number"
                      value={editingClient.revenue}
                      onChange={(e) => setEditingClient({...editingClient, revenue: Number(e.target.value)})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users size={20} /> Contacts
                    </h3>
                    <button
                      onClick={() => addContact(true)}
                      className="px-3 py-1 text-sm bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Add Contact
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editingClient.contacts.map((contact, index) => (
                      <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-700/30 rounded-lg">
                        <input
                          type="text"
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => {
                            const updated = editingClient.contacts.map(c =>
                              c.id === contact.id ? {...c, name: e.target.value} : c
                            );
                            setEditingClient({...editingClient, contacts: updated});
                          }}
                          className="p-2 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => {
                            const updated = editingClient.contacts.map(c =>
                              c.id === contact.id ? {...c, email: e.target.value} : c
                            );
                            setEditingClient({...editingClient, contacts: updated});
                          }}
                          className="p-2 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={contact.phone}
                            onChange={(e) => {
                              const updated = editingClient.contacts.map(c =>
                                c.id === contact.id ? {...c, phone: e.target.value} : c
                              );
                              setEditingClient({...editingClient, contacts: updated});
                            }}
                            className="flex-1 p-2 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                          />
                          {editingClient.contacts.length > 1 && (
                            <button
                              onClick={() => removeContact(contact.id, true)}
                              className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock size={20} /> Preferences
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Periodicity</label>
                    <select
                      value={editingClient.preferences.periodicity}
                      onChange={(e) => setEditingClient({
                        ...editingClient,
                        preferences: {...editingClient.preferences, periodicity: e.target.value}
                      })}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="every mission">Every Mission</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>

                {/* Missions (Read-only) */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Missions (Read-only)</h3>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.missions && selectedClient.missions.length > 0 ? (
                        selectedClient.missions.map((mission) => (
                          <span key={`mission-${mission.id}`} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-full text-sm">
                            {mission.name} ({mission.id})
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No missions assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Client Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Create New Client</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                    <input
                      type="text"
                      value={newClient.logo}
                      onChange={(e) => setNewClient({...newClient, logo: e.target.value})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cost</label>
                    <input
                      type="number"
                      value={newClient.cost}
                      onChange={(e) => setNewClient({...newClient, cost: Number(e.target.value)})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Revenue</label>
                    <input
                      type="number"
                      value={newClient.revenue}
                      onChange={(e) => setNewClient({...newClient, revenue: Number(e.target.value)})}
                      className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-300">Contacts</label>
                    <button
                      onClick={() => addContact(false)}
                      className="px-3 py-1 text-sm bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Add Contact
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newClient.contacts.map((contact, index) => (
                      <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <input
                          type="text"
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => {
                            const updated = newClient.contacts.map(c =>
                              c.id === contact.id ? {...c, name: e.target.value} : c
                            );
                            setNewClient({...newClient, contacts: updated});
                          }}
                          className="p-2 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => {
                            const updated = newClient.contacts.map(c =>
                              c.id === contact.id ? {...c, email: e.target.value} : c
                            );
                            setNewClient({...newClient, contacts: updated});
                          }}
                          className="p-2 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={contact.phone}
                            onChange={(e) => {
                              const updated = newClient.contacts.map(c =>
                                c.id === contact.id ? {...c, phone: e.target.value} : c
                              );
                              setNewClient({...newClient, contacts: updated});
                            }}
                            className="flex-1 p-2 rounded bg-gray-600 border border-gray-500 text-white text-sm"
                          />
                          {newClient.contacts.length > 1 && (
                            <button
                              onClick={() => removeContact(contact.id, false)}
                              className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Periodicity</label>
                  <select
                    value={newClient.preferences.periodicity}
                    onChange={(e) => setNewClient({
                      ...newClient,
                      preferences: {...newClient.preferences, periodicity: e.target.value}
                    })}
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="every mission">Every Mission</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50">
                  <button
                    onClick={handleCreateClient}
                    disabled={!newClient.name.trim()}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Client
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}