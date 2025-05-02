import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token && !!user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error('Failed to get user data');
          }
        } catch (err) {
          console.error('Load user error:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (formData) => {
    try {
      const response = await authService.register(formData);
      
      if (response.status === 'success' && response.data) {
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        
        return { 
          success: true,
          data: {
            user
          }
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.'
      };
    }
  };

  const login = async (formData) => {
    try {
      const response = await authService.login(formData);
      
      if (response.status === 'success' && response.data) {
        const { token, user } = response.data;
        
        // Check if user has the required profile for their role
        const hasRequiredProfile = (
          (user.role === 'staff' && user.staffProfile) ||
          (user.role === 'doctor' && user.doctorProfile) ||
          (user.role === 'patient' && user.patientProfile)
        );

        if (!hasRequiredProfile) {
          throw new Error('Profile not found. Please contact administrator.');
        }

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        
        return { 
          success: true,
          data: {
            user
          }
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
