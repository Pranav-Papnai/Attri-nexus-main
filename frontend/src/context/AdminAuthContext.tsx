import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  adminLogin,
  adminLogout,
  completeMfaLogin,
  getStoredAdminUser,
  AdminSessionUser,
  LoginResult
} from '@/services/api/auth';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminSessionUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  verifyMfa: (mfaToken: string, code: string) => Promise<LoginResult>;
  // Re-reads the stored session after something else wrote it (password
  // reset, two-factor changes).
  refreshSession: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(() => {
    // A synchronous localStorage read — no network round-trip needed.
    const storedUser = getStoredAdminUser();
    setIsAuthenticated(Boolean(storedUser));
    setAdminUser(storedUser);
  }, []);

  useEffect(() => {
    refreshSession();
    setIsLoading(false);
  }, [refreshSession]);

  const finish = (result: LoginResult): LoginResult => {
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setAdminUser(result.user);
    }
    return result;
  };

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    setIsLoading(true);
    const result = await adminLogin(email, pass);
    setIsLoading(false);
    return finish(result);
  };

  const verifyMfa = async (mfaToken: string, code: string): Promise<LoginResult> => {
    setIsLoading(true);
    const result = await completeMfaLogin(mfaToken, code);
    setIsLoading(false);
    return finish(result);
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
        verifyMfa,
        refreshSession,
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
