import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    if (token) {
      localStorage.setItem('token', token);
      // Store user data including the profile
      const userData = {
        ...user,
        profile: user[`${user.role}Profile`]
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data?.message || 'Failed to login';
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data.data;
    if (token) {
      localStorage.setItem('token', token);
      // Store user data including the profile
      const userData = {
        ...user,
        profile: user[`${user.role}Profile`]
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error.response?.data?.message || 'Failed to register';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    const { user } = response.data.data;
    
    // Store user data including the profile
    const updatedUserData = {
      ...user,
      profile: user[`${user.role}Profile`]
    };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    return updatedUserData;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data?.message || 'Failed to update profile';
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error.response?.data?.message || 'Failed to change password';
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error.response?.data?.message || 'Failed to process forgot password request';
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error.response?.data?.message || 'Failed to reset password';
  }
};

// Export the axios instance for other services to use
export default api;
