import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Add debug logs
  console.log('ProtectedRoute Debug:', {
    user,
    isAuthenticated,
    loading,
    allowedRoles,
    hasRole: user && allowedRoles.includes(user.role)
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('User role not allowed:', user.role);
    return <Navigate to="/" replace />;
  }

  // Check for role-specific profile
  if (user.role === 'staff' && !user.staffProfile) {
    console.log('Staff profile not found');
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'doctor' && !user.doctorProfile) {
    console.log('Doctor profile not found');
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'patient' && !user.patientProfile) {
    console.log('Patient profile not found');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
