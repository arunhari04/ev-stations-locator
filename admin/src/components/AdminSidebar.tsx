import React from 'react';
import { Zap, Home, Plug, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAdmin, AdminScreen } from '../contexts/AdminContext';

const menuItems = [
  { icon: Home, label: 'Dashboard', screen: 'dashboard' as AdminScreen },
  { icon: Plug, label: 'Stations', screen: 'stations' as AdminScreen },
  { icon: Users, label: 'Users', screen: 'users' as AdminScreen },
  { icon: BarChart3, label: 'Analytics', screen: 'analytics' as AdminScreen },
  { icon: Settings, label: 'Settings', screen: 'settings' as AdminScreen },
];

export const AdminSidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, logout, adminUser } = useAdmin();

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">ChargePoint</h2>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ icon: Icon, label, screen }) => (
          <button
            key={screen}
            onClick={() => setCurrentScreen(screen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
              currentScreen === screen
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {adminUser?.name.split(' ').map(n => n[0]).join('') || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{adminUser?.name || 'Admin User'}</div>
            <div className="text-xs text-gray-400 truncate">{adminUser?.email}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-xl font-medium transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
