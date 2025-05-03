import React, { useContext, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { StaffProvider } from '../context/StaffContext';
import Sidebar from '../components/common/Sidebar';
import StaffDashboard from '../components/staff/StaffDashboard';

const StaffPortal = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'staff')) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { 
      path: '/staff/dashboard', 
      label: 'Dashboard', 
      icon: 'fas fa-home',
      description: 'Overview of clinic activities'
    },
    { 
      path: '/staff/patients', 
      label: 'Patients', 
      icon: 'fas fa-users',
      description: 'Manage patient records'
    },
    { 
      path: '/staff/appointments', 
      label: 'Appointments', 
      icon: 'fas fa-calendar-alt',
      description: 'Schedule and manage appointments'
    },
    { 
      path: '/staff/transactions', 
      label: 'Transactions', 
      icon: 'fas fa-file-invoice-dollar',
      description: 'Handle payments and billing'
    }
  ];

  return (
    <StaffProvider>
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
            title="Staff Portal"
            navLinks={navLinks}
            user={user}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {location.pathname === '/staff/dashboard' ? (
                <StaffDashboard />
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
    </StaffProvider>
  );
};

export default StaffPortal;
