import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminStations } from './components/AdminStations';
import { AdminAddStation } from './components/AdminAddStation';
import { AdminUsers } from './components/AdminUsers';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminSettings } from './components/AdminSettings';

const AdminContent = () => {
  const { isLoggedIn, currentScreen, setAdminUser } = useAdmin();

  if (!isLoggedIn && currentScreen === 'login') {
    return <AdminLogin />;
  }

  if (isLoggedIn) {
    setAdminUser({
      id: 'admin-001',
      email: 'admin@chargepoint.com',
      name: 'Admin User',
      role: 'super-admin',
    });
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      {currentScreen === 'dashboard' && <AdminDashboard />}
      {currentScreen === 'stations' && <AdminStations />}
      {currentScreen === 'add-station' && <AdminAddStation />}
      {currentScreen === 'users' && <AdminUsers />}
      {currentScreen === 'analytics' && <AdminAnalytics />}
      {currentScreen === 'settings' && <AdminSettings />}
    </div>
  );
};

function App() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}

export default App;
