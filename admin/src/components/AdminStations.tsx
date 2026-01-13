import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface Station {
  id: string;
  name: string;
  code: string;
  location: string;
  city: string;
  type: string;
  status: 'active' | 'maintenance' | 'offline';
  available: string;
  price: string;
  icon: string;
}

export const AdminStations: React.FC = () => {
  const { setCurrentScreen } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const stations: Station[] = [
    {
      id: '1',
      name: 'Tesla Supercharger',
      code: '#ST-001',
      location: '123 Main Street',
      city: 'Downtown, CA',
      type: 'DC Fast',
      status: 'active',
      available: '4 / 8',
      price: '$0.28/kWh',
      icon: '⚡',
    },
    {
      id: '2',
      name: 'ChargePoint Station',
      code: '#ST-002',
      location: '456 Oak Avenue',
      city: 'Midtown, CA',
      type: 'Level 2',
      status: 'active',
      available: '2 / 4',
      price: '$0.32/kWh',
      icon: '🔌',
    },
    {
      id: '3',
      name: 'EVgo Fast Charger',
      code: '#ST-003',
      location: '789 Pine Street',
      city: 'Uptown, CA',
      type: 'DC Fast',
      status: 'maintenance',
      available: '0 / 6',
      price: '$0.35/kWh',
      icon: '⚡',
    },
    {
      id: '4',
      name: 'Blink Charging Station',
      code: '#ST-004',
      location: '321 Elm Road',
      city: 'Westside, CA',
      type: 'Level 2',
      status: 'active',
      available: '3 / 5',
      price: '$0.30/kWh',
      icon: '🔌',
    },
    {
      id: '5',
      name: 'Electrify America',
      code: '#ST-005',
      location: '654 Maple Drive',
      city: 'Eastside, CA',
      type: 'DC Fast',
      status: 'offline',
      available: '0 / 8',
      price: '$0.33/kWh',
      icon: '⚡',
    },
  ];

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || station.status === statusFilter;
    const matchesType = typeFilter === 'all' || station.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'maintenance':
        return { bg: 'bg-orange-50', text: 'text-orange-600' };
      case 'offline':
        return { bg: 'bg-red-50', text: 'text-red-600' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DC Fast':
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'Level 2':
        return { bg: 'bg-purple-50', text: 'text-purple-600' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
            <p className="text-gray-600">Manage all charging stations</p>
          </div>
          <button
            onClick={() => setCurrentScreen('add-station')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Station
          </button>
        </div>
      </header>

      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              >
                <option value="all">All Types</option>
                <option value="DC Fast">DC Fast</option>
                <option value="Level 2">Level 2</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Station</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStations.map((station) => {
                  const statusColors = getStatusColor(station.status);
                  const typeColors = getTypeColor(station.type);
                  return (
                    <tr key={station.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">
                            {station.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{station.name}</div>
                            <div className="text-sm text-gray-600">{station.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{station.location}</div>
                        <div className="text-sm text-gray-600">{station.city}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${typeColors.bg} ${typeColors.text} text-xs font-medium rounded-full`}>
                          {station.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${statusColors.bg} ${statusColors.text} text-xs font-medium rounded-full capitalize`}>
                          {station.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{station.available}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{station.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing 1 to {filteredStations.length} of {stations.length} stations</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Previous
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
                  {currentPage}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  {currentPage + 1}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  {currentPage + 2}
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
