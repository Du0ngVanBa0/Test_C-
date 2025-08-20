import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import apiService from '../services/apiService';
import { AuthContext } from './auth-context';
import { extractUserFromToken, isTokenExpired } from '../utils/jwtUtils';
import { tokenService } from '../utils/tokenService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    tokenService.setTokenRefreshCallback((userData) => {
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
        window.location.href = '/login';
      }
    });

    return () => {
      tokenService.stopAutomaticRefresh();
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        localStorage.removeItem('user');
        
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (accessToken && refreshToken) {
          if (isTokenExpired(accessToken)) {
            try {
              const response = await apiService.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              
              const userData = extractUserFromToken(response.data.accessToken);
              setUser(userData);
              
              tokenService.startAutomaticRefresh();
            } catch (error) {
              console.error('Failed to refresh token on startup:', error);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } else {
            const userData = extractUserFromToken(accessToken);
            setUser(userData);
            
            tokenService.startAutomaticRefresh();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      const { accessToken, refreshToken } = response.data;
      
      const userData = extractUserFromToken(accessToken);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      
      tokenService.startAutomaticRefresh();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.googleLogin({ GoogleToken: credential });
      const { accessToken, refreshToken } = response.data;
      
      const userData = extractUserFromToken(accessToken);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      
      tokenService.startAutomaticRefresh();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.register(email, password, name);
      const { accessToken, refreshToken } = response.data;
      
      const userData = extractUserFromToken(accessToken);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      
      tokenService.startAutomaticRefresh();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshAuthToken = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiService.refreshToken(refreshToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      const userData = extractUserFromToken(response.data.accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh token manually:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      tokenService.stopAutomaticRefresh();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const logoutAllDevices = async (): Promise<void> => {
    try {
      tokenService.stopAutomaticRefresh();
      await apiService.logoutAllDevices();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout all devices error:', error);
      tokenService.stopAutomaticRefresh();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    logoutAllDevices,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
