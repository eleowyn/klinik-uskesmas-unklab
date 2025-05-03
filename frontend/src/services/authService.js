import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Changed from true since we're using token-based auth
});

// Debug function
const logRequestDetails = (config) => {
  console.log('Request Details:', {
    url: config.url,
    method: config.method,
    headers: {
      ...config.headers,
      Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : 'No token'
    }
  });
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token present:', !!token);
    
    // Token format must match what your auth middleware expects
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    logRequestDetails(config);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, {
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error for:', error.config?.url, {
        status: error.response.status,
        message: error.response.data?.message
      });

      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized - clearing auth data and redirecting to login');
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access denied:', error.response.data.message);
          break;
        default:
          console.error('API Error:', error.response.data.message);
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (credentials) => {
  try {
    console.log('Attempting login...');
    const response = await api.post('/auth/login', credentials);
    const { data } = response.data;
    
    if (!data || !data.token || !data.user) {
      console.error('Invalid login response format:', response.data);
      throw new Error('Invalid response format from server');
    }

    console.log('Login successful, storing auth data');
    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Attempting registration...');
    const response = await api.post('/auth/register', userData);
    const { data } = response.data;
    
    if (!data || !data.token || !data.user) {
      console.error('Invalid registration response format:', response.data);
      throw new Error('Invalid response format from server');
    }

    console.log('Registration successful, storing auth data');
    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const logout = () => {
  console.log('Logging out, clearing auth data');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = async () => {
  try {
    console.log('Fetching current user...');
    const response = await api.get('/auth/me');
    const { data } = response.data;
    
    if (!data || !data.user) {
      console.error('Invalid getCurrentUser response format:', response.data);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Current user fetched successfully');
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    console.log('Updating profile...');
    const response = await api.put('/auth/profile', userData);
    const { data } = response.data;
    
    if (!data) {
      console.error('Invalid updateProfile response format:', response.data);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Profile updated successfully');
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    console.log('Changing password...');
    const response = await api.put('/auth/change-password', passwordData);
    console.log('Password changed successfully');
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export default api;
