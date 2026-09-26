import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminLogin, adminLogout, getStoredAdminUser, AdminSessionUser } from '@/services/api/auth';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminSessionUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // A synchronous localStorage read — no network round-trip needed just
    // to restore a session on page load.
    const storedUser = getStoredAdminUser();
    if (storedUser) {
      setIsAuthenticated(true);
      setAdminUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const result = await adminLogin(email, pass);
    setIsLoading(false);

    if (!result.success || !result.user) {
      return { success: false, error: result.error || 'Invalid credentials. Please enter correct Email and Password.' };
    }

    setIsAuthenticated(true);
    setAdminUser(result.user);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    adminLogout();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Protected Route Component for Admin Dashboard
export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0C1015] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#C5A059]">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
