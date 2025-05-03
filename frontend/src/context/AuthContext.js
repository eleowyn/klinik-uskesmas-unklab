import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import { useAlert } from './AlertContext';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { user } = await authService.login(credentials.email, credentials.password);
      setUser(user);

      // Navigate based on role
      switch (user.role) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/');
      }

      showAlert('Login successful', 'success');
    } catch (error) {
      showAlert(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const { user } = await authService.register(userData);
      setUser(user);
      navigate(`/${user.role}/dashboard`);
      showAlert('Registration successful', 'success');
    } catch (error) {
      showAlert(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.logout();
    showAlert('Logged out successfully', 'success');
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedProfile = await authService.updateProfile(profileData);
      setUser(prev => ({ ...prev, profile: updatedProfile }));
      showAlert('Profile updated successfully', 'success');
    } catch (error) {
      showAlert(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    role: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
