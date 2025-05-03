import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import { DoctorProvider, useDoctorContext } from '../context/DoctorContext';
import Sidebar from '../components/common/Sidebar';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import doctorService from '../services/doctorService';

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

const DoctorContent = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const { updateDashboardData } = useDoctorContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    doctorProfile: null,
    patients: [],
    prescriptions: [],
    appointments: []
  });

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'doctor') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get doctor profile
      const profile = await doctorService.getDoctorProfile();
      
      let newData = {
        doctorProfile: profile,
        patients: [],
        prescriptions: [],
        appointments: []
      };

      // Fetch all data in parallel for better performance
      const [patients, prescriptions, appointments] = await Promise.all([
        doctorService.getDoctorPatients(),
        doctorService.getDoctorPrescriptions(),
        doctorService.getDoctorAppointments()
      ]);

      newData = {
        ...newData,
        patients: Array.isArray(patients) ? patients : [],
        prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
        appointments: Array.isArray(appointments) ? appointments : []
      };

      setDashboardData(newData);
      updateDashboardData(newData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      showAlert(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, updateDashboardData, showAlert]);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh data every 30 seconds
    const refreshInterval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(refreshInterval);
  }, [fetchDashboardData]);

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
      path: '/doctor/schedule', 
      label: 'Schedule', 
      icon: 'fas fa-calendar',
      description: 'Manage your appointments'
    }
  ];

  return (
    <DoctorProvider>
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
                <DoctorContent />
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
    </DoctorProvider>
  );
};

export default DoctorPortal;
