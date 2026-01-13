import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const analyticsData = [
    { label: 'Total Sessions', value: '12,547', change: '+18%', period: 'vs last week' },
    { label: 'Average Duration', value: '45 min', change: '+5%', period: 'vs last week' },
    { label: 'Peak Hours', value: '6-8 PM', change: 'Consistent', period: 'pattern' },
    { label: 'Revenue per Session', value: '$8.42', change: '+2%', period: 'improvement' },
  ];

  const topStations = [
    { name: 'Tesla Supercharger - Downtown', sessions: 2847, revenue: '$23,542', utilization: 85 },
    { name: 'ChargePoint Station - Midtown', sessions: 1923, revenue: '$15,984', utilization: 72 },
    { name: 'EVgo Fast Charger - Uptown', sessions: 1654, revenue: '$14,285', utilization: 68 },
    { name: 'Blink Charging - Westside', sessions: 1342, revenue: '$11,987', utilization: 62 },
    { name: 'Electrify America - Eastside', sessions: 987, revenue: '$8,542', utilization: 45 },
  ];

  const hourlyData = [
    { hour: '00:00', sessions: 45, revenue: 380 },
    { hour: '04:00', sessions: 23, revenue: 195 },
    { hour: '08:00', sessions: 156, revenue: 1318 },
    { hour: '12:00', sessions: 234, revenue: 1974 },
    { hour: '16:00', sessions: 289, revenue: 2441 },
    { hour: '18:00', sessions: 456, revenue: 3854 },
    { hour: '20:00', sessions: 387, revenue: 3274 },
    { hour: '22:00', sessions: 145, revenue: 1227 },
  ];

  const maxSessions = Math.max(...hourlyData.map(d => d.sessions));

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Detailed insights into charging network performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{item.change}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{item.value}</div>
              <div className="text-sm text-gray-600 mb-1">{item.label}</div>
              <div className="text-xs text-gray-500">{item.period}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Session Activity by Hour</h3>
            <div className="h-64 flex items-end justify-between gap-3 p-6 bg-gray-50 rounded-xl">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-emerald-600 rounded-t-lg hover:bg-emerald-700 transition" style={{ height: `${(data.sessions / maxSessions) * 200}px` }} />
                  <span className="text-xs text-gray-600 whitespace-nowrap">{data.hour}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Distribution</h3>
            <div className="space-y-4">
              {[
                { label: 'Peak Hours (6-8 PM)', percentage: 35, color: 'emerald' },
                { label: 'Off-Peak (8 PM-6 AM)', percentage: 25, color: 'blue' },
                { label: 'Business Hours', percentage: 30, color: 'orange' },
                { label: 'Evening (8-10 PM)', percentage: 10, color: 'purple' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    <span className="text-sm font-bold text-emerald-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color === 'emerald' ? 'bg-emerald-600' : item.color === 'blue' ? 'bg-blue-600' : item.color === 'orange' ? 'bg-orange-600' : 'bg-purple-600'}`}
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
            <h3 className="text-lg font-bold text-gray-900">Top Performing Stations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Station</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sessions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topStations.map((station, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{station.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{station.sessions.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{station.revenue}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${station.utilization}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{station.utilization}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};
