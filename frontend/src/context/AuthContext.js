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
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext - Loading user state:', {
        hasToken: !!token,
        hasUser: !!user,
        isAuthenticated
      });

      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('AuthContext - User data loaded:', {
            role: userData?.role,
            hasProfile: !!userData?.profile
          });

          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error('Failed to get user data');
          }
        } catch (err) {
          console.error('AuthContext - Load user error:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('AuthContext - No token found');
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (formData) => {
    try {
      console.log('AuthContext - Attempting registration');
      const response = await authService.register(formData);
      
      if (response.status === 'success' && response.data) {
        const { token: newToken, user: newUser } = response.data;
        
        // Check if user has the required profile for their role
        const hasRequiredProfile = (
          (newUser.role === 'staff' && newUser.staffProfile) ||
          (newUser.role === 'doctor' && newUser.doctorProfile) ||
          (newUser.role === 'patient' && newUser.patientProfile)
        );

        if (!hasRequiredProfile) {
          throw new Error('Profile not found. Please contact administrator.');
        }

        console.log('AuthContext - Registration successful:', {
          role: newUser.role,
          hasProfile: hasRequiredProfile
        });

        // Store token and user data
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { 
          success: true,
          data: {
            user: newUser
          }
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('AuthContext - Registration error:', error);
      
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.'
      };
    }
  };

  const login = async (formData) => {
    try {
      console.log('AuthContext - Attempting login');
      const response = await authService.login(formData);
      
      if (response.status === 'success' && response.data) {
        const { token: newToken, user: newUser } = response.data;
        
        // Check if user has the required profile for their role
        const hasRequiredProfile = (
          (newUser.role === 'staff' && newUser.staffProfile) ||
          (newUser.role === 'doctor' && newUser.doctorProfile) ||
          (newUser.role === 'patient' && newUser.patientProfile)
        );

        if (!hasRequiredProfile) {
          throw new Error('Profile not found. Please contact administrator.');
        }

        console.log('AuthContext - Login successful:', {
          role: newUser.role,
          hasProfile: hasRequiredProfile
        });

        // Store token and user data
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { 
          success: true,
          data: {
            user: newUser
          }
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
