import React, { useState } from 'react';
import { Zap, CheckCircle, Users, TrendingUp, Bell, Plus } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export const AdminDashboard: React.FC = () => {
  const { setCurrentScreen } = useAdmin();
  const [timeRange, setTimeRange] = useState('7days');

  const stats = [
    {
      icon: Zap,
      label: 'Total Stations',
      value: '1,247',
      change: '+12%',
      color: 'emerald',
      bgColor: 'emerald-100',
    },
    {
      icon: CheckCircle,
      label: 'Available Now',
      value: '892',
      change: '+8%',
      color: 'blue',
      bgColor: 'blue-100',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '45.2K',
      change: '+24%',
      color: 'purple',
      bgColor: 'purple-100',
    },
    {
      icon: TrendingUp,
      label: 'Revenue (MTD)',
      value: '$128K',
      change: '+18%',
      color: 'orange',
      bgColor: 'orange-100',
    },
  ];

  const stationStatus = [
    { status: 'Available', count: 892, percentage: 71, color: 'emerald' },
    { status: 'In Use', count: 284, percentage: 23, color: 'blue' },
    { status: 'Maintenance', count: 48, percentage: 4, color: 'orange' },
    { status: 'Offline', count: 23, percentage: 2, color: 'red' },
  ];

  const activities = [
    {
      icon: Plus,
      type: 'New station added',
      description: 'Tesla Supercharger at Downtown Mall is now live',
      time: '2 hours ago',
      color: 'emerald',
    },
    {
      icon: Bell,
      type: 'Maintenance required',
      description: 'ChargePoint Station #4521 needs inspection',
      time: '5 hours ago',
      color: 'orange',
    },
    {
      icon: CheckCircle,
      type: 'System update completed',
      description: 'All stations updated to firmware v2.4.1',
      time: '1 day ago',
      color: 'blue',
    },
  ];

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition">
              <Bell className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentScreen('add-station')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Add Station
            </button>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClass = {
              emerald: 'text-emerald-600 bg-emerald-100',
              blue: 'text-blue-600 bg-blue-100',
              purple: 'text-purple-600 bg-purple-100',
              orange: 'text-orange-600 bg-orange-100',
            };

            return (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass[stat.color as keyof typeof colorClass]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-medium ${stat.color === 'emerald' ? 'text-emerald-600 bg-emerald-50' : stat.color === 'blue' ? 'text-blue-600 bg-blue-50' : stat.color === 'purple' ? 'text-purple-600 bg-purple-50' : 'text-orange-600 bg-orange-50'} px-2 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Usage Analytics</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 p-4 bg-gray-50 rounded-xl">
              {[65, 45, 78, 55, 82, 70, 88].map((height, i) => (
                <div key={i} className="flex-1 bg-emerald-600 rounded-t-lg hover:bg-emerald-700 transition" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Station Status</h3>
              <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">View All</button>
            </div>
            <div className="space-y-4">
              {stationStatus.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.status}</span>
                    <span className={`text-sm font-bold ${item.color === 'emerald' ? 'text-emerald-600' : item.color === 'blue' ? 'text-blue-600' : item.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color === 'emerald' ? 'bg-emerald-600' : item.color === 'blue' ? 'bg-blue-600' : item.color === 'orange' ? 'bg-orange-600' : 'bg-red-600'}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              const colorMap: Record<string, string> = {
                emerald: 'emerald',
                orange: 'orange',
                blue: 'blue',
              };

              return (
                <div key={index} className="p-6 hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activity.color === 'emerald'
                          ? 'bg-emerald-100'
                          : activity.color === 'orange'
                            ? 'bg-orange-100'
                            : 'bg-blue-100'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          activity.color === 'emerald'
                            ? 'text-emerald-600'
                            : activity.color === 'orange'
                              ? 'text-orange-600'
                              : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.type}</h4>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
