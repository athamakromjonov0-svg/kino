import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing token on mount
  const checkAuth = useCallback(async () => {
    const storedToken = authService.getToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
      setToken(storedToken);
    } catch (error) {
      // If token is invalid or expired, clear it
      console.warn("Token validation failed:", error.message);
      authService.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for 401 expired event from axios interceptor
    const handleExpired = () => {
      setUser(null);
      setToken(null);
      toast.error("Sessiya muddati tugadi. Iltimos, qaytadan tizimga kiring.");
    };

    window.addEventListener('auth:session-expired', handleExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleExpired);
    };
  }, [checkAuth]);

  /**
   * Login user with credentials
   */
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const newToken = authService.getToken();
      setToken(newToken);

      // Fetch user profile immediately
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (meErr) {
        // If getMe is slightly different, fallback gracefully to any returned user object or basic info
        const fallbackUser = response.user || response.data?.user || { email: credentials.email };
        setUser(fallbackUser);
      }

      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      return { success: true };
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      return { success: true, data: response };
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user and clear stored state
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    toast.success("Tizimdan muvaffaqiyatli chiqdingiz.");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
