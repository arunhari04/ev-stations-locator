import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export const AdminAddStation: React.FC = () => {
  const { setCurrentScreen } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    chargerType: 'DC Fast',
    powerOutput: '',
    totalChargers: '',
    pricePerKwh: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    latitude: '',
    longitude: '',
    open24: true,
    openingTime: '06:00',
    closingTime: '22:00',
    amenities: {
      wifi: false,
      restrooms: false,
      food: false,
      shopping: false,
      parking: false,
      covered: false,
      lighting: false,
      security: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (amenity: keyof typeof formData.amenities) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setCurrentScreen('stations');
  };

  const amenityList = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'restrooms', label: 'Restrooms' },
    { key: 'food', label: 'Food' },
    { key: 'shopping', label: 'Shopping' },
    { key: 'parking', label: 'Parking' },
    { key: 'covered', label: 'Covered' },
    { key: 'lighting', label: 'Lighting' },
    { key: 'security', label: 'Security' },
  ];

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen('stations')}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Station</h1>
            <p className="text-gray-600">Create a new charging station</p>
          </div>
        </div>
      </header>

      <div className="p-8">
        <form className="max-w-4xl" onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Tesla Supercharger"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Station ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="ST-001"
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Charger Type</label>
                <select
                  name="chargerType"
                  value={formData.chargerType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                  <option>DC Fast Charging</option>
                  <option>Level 2 (AC)</option>
                  <option>Tesla Supercharger</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Power Output (kW)</label>
                <input
                  type="number"
                  name="powerOutput"
                  placeholder="150"
                  value={formData.powerOutput}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Chargers</label>
                <input
                  type="number"
                  name="totalChargers"
                  placeholder="8"
                  value={formData.totalChargers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per kWh</label>
                <input
                  type="number"
                  step="0.01"
                  name="pricePerKwh"
                  placeholder="0.28"
                  value={formData.pricePerKwh}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Location Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  placeholder="123 Main Street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Downtown"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    placeholder="94102"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    placeholder="37.7749"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    placeholder="-122.4194"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Operating Hours</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="open24"
                  checked={formData.open24}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-3 text-gray-700 font-medium">Open 24/7</span>
              </label>
              {!formData.open24 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenityList.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center p-3 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities[key as keyof typeof formData.amenities]}
                    onChange={() => handleAmenityChange(key as keyof typeof formData.amenities)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentScreen('stations')}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Create Station
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
