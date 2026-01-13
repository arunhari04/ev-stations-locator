import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

interface User {
  id: string;
  name: string;
  code: string;
  email: string;
  status: 'active' | 'inactive';
  sessions: number;
  joined: string;
  avatar: string;
  color: string;
}

export const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      code: '#USR-001',
      email: 'john.doe@example.com',
      status: 'active',
      sessions: 24,
      joined: 'Jan 15, 2024',
      avatar: 'JD',
      color: 'emerald',
    },
    {
      id: '2',
      name: 'Sarah Miller',
      code: '#USR-002',
      email: 'sarah.m@example.com',
      status: 'active',
      sessions: 18,
      joined: 'Feb 3, 2024',
      avatar: 'SM',
      color: 'blue',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      code: '#USR-003',
      email: 'm.johnson@example.com',
      status: 'inactive',
      sessions: 12,
      joined: 'Dec 8, 2023',
      avatar: 'MJ',
      color: 'purple',
    },
    {
      id: '4',
      name: 'Emily Chen',
      code: '#USR-004',
      email: 'emily.chen@example.com',
      status: 'active',
      sessions: 32,
      joined: 'Jan 1, 2024',
      avatar: 'EC',
      color: 'orange',
    },
    {
      id: '5',
      name: 'David Smith',
      code: '#USR-005',
      email: 'david.smith@example.com',
      status: 'active',
      sessions: 15,
      joined: 'Feb 20, 2024',
      avatar: 'DS',
      color: 'green',
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAvatarColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'bg-emerald-600',
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      orange: 'bg-orange-600',
      green: 'bg-green-600',
    };
    return colors[color] || 'bg-gray-600';
  };

  const stats = [
    { label: 'Total Users', value: '45,231', color: 'purple', icon: '👥' },
    { label: 'Active Users', value: '42,847', color: 'emerald', icon: '✓' },
    { label: 'New This Month', value: '1,284', color: 'blue', icon: '+' },
    { label: 'Active Sessions', value: '8,492', color: 'orange', icon: '⏱' },
  ];

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">View and manage user accounts</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Users
          </button>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const bgColors: Record<string, string> = {
              purple: 'bg-purple-100',
              emerald: 'bg-emerald-100',
              blue: 'bg-blue-100',
              orange: 'bg-orange-100',
            };
            const textColors: Record<string, string> = {
              purple: 'text-purple-600',
              emerald: 'text-emerald-600',
              blue: 'text-blue-600',
              orange: 'text-orange-600',
            };

            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${bgColors[stat.color]} rounded-xl flex items-center justify-center text-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
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
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sessions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getAvatarColor(user.color)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'} text-xs font-medium rounded-full capitalize`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{user.sessions}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{user.joined}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing 1 to {filteredUsers.length} of {users.length} users</div>
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
