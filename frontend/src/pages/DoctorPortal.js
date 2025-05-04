import React, { useContext, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDoctorContext } from '../context/DoctorContext';
import Sidebar from '../components/common/Sidebar';
import { useEffect } from 'react';
import DoctorDashboard from '../components/doctor/DoctorDashboard';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-red-500 bg-red-100 p-4 rounded-lg shadow flex items-center">
      <i className="fas fa-exclamation-circle mr-2 text-xl"></i>
      <span>{message}</span>
    </div>
  </div>
);

const DashboardContent = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { loading, error, dashboardData, refreshDashboardData } = useDoctorContext();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'doctor') {
      refreshDashboardData();

      // Auto-refresh data every 5 seconds for more real-time updates
      const refreshInterval = setInterval(refreshDashboardData, 5000);
      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, user, refreshDashboardData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return <DoctorDashboard dashboardData={dashboardData} />;
};

const DoctorPortal = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'doctor')) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { 
      path: '/doctor/dashboard', 
      label: 'Dashboard', 
      icon: 'fas fa-home',
      description: 'Overview of your activities'
    },
    { 
      path: '/doctor/patients', 
      label: 'Patients', 
      icon: 'fas fa-user-injured',
      description: 'Manage your patients'
    },
    { 
      path: '/doctor/prescriptions', 
      label: 'Prescriptions', 
      icon: 'fas fa-prescription',
      description: 'View and create prescriptions'
    },
    { 
      path: '/doctor/appointments', 
      label: 'Appointments', 
      icon: 'fas fa-calendar-check',
      description: 'View and manage appointments'
    },
    { 
      path: '/doctor/schedule', 
      label: 'Schedule', 
      icon: 'fas fa-calendar',
      description: 'View calendar schedule'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
        {/* Sidebar Toggle Button for Mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-500 text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
        </button>

        {/* Sidebar */}
        <div className={`
          lg:relative fixed inset-y-0 left-0 z-40
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}>
          <Sidebar 
            title="Doctor Portal"
            navLinks={navLinks}
            user={user}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {location.pathname === '/doctor/dashboard' ? (
                <DashboardContent />
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
  );
};

export default DoctorPortal;
