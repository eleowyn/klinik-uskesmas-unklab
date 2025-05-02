import React, { useContext } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import Sidebar from '../components/common/Sidebar';
import ProtectedRoute from '../components/common/ProtectedRoute';

const StaffPortal = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if user is authenticated and has staff role with profile
  if (!isAuthenticated || !user || user.role !== 'staff' || !user.staffProfile) {
    showAlert('Access denied. Staff profile required.', 'error');
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { path: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: 'patients', icon: 'fas fa-procedures', label: 'Patients' },
    { path: 'transactions', icon: 'fas fa-receipt', label: 'Transactions' },
    { path: 'appointments', icon: 'fas fa-calendar-alt', label: 'Appointments' },
  ];

  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar 
          title="Staff Portal" 
          navLinks={navLinks} 
          user={{
            ...user,
            name: user.staffProfile?.fullName || user.username,
            role: 'Staff Member',
            position: user.staffProfile?.position || 'Staff'
          }}
          onLogout={handleLogout} 
        />
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome, {user.staffProfile?.fullName || user.username}
              </h1>
              <p className="text-gray-600">
                {user.staffProfile?.position || 'Staff Member'}
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StaffPortal;
