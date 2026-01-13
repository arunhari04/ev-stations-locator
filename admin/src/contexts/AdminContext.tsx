import React, { createContext, useContext, useState } from 'react';

export type AdminScreen = 'login' | 'dashboard' | 'stations' | 'add-station' | 'users' | 'analytics' | 'settings';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin';
}

interface AdminContextType {
  currentScreen: AdminScreen;
  setCurrentScreen: (screen: AdminScreen) => void;
  isLoggedIn: boolean;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const logout = () => {
    setIsLoggedIn(false);
    setAdminUser(null);
    setCurrentScreen('login');
  };

  return (
    <AdminContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isLoggedIn,
        adminUser,
        setAdminUser,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
