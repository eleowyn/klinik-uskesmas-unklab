import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Navigate, Outlet, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertContext } from '../context/AlertContext';
import { DoctorProvider, useDoctorContext } from '../context/DoctorContext';
import Sidebar from '../components/common/Sidebar';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import doctorService from '../services/doctorService';

const DoctorContent = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const { updateDashboardData } = useDoctorContext();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    doctorProfile: null,
    patients: [],
    prescriptions: [],
    appointments: []
  });

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'doctor' || dataLoaded) {
      console.log('Skipping data fetch:', {
        isAuthenticated,
        hasUser: !!user,
        role: user?.role,
        dataLoaded
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Starting sequential data fetch...');
      setLoading(true);

      // First, get the profile
      const profile = await doctorService.getDoctorProfile();
      if (!profile) {
        throw new Error('Failed to load doctor profile');
      }

      let newData = {
        doctorProfile: profile,
        patients: [],
        prescriptions: [],
        appointments: []
      };

      // Then, get patients
      try {
        const patients = await doctorService.getDoctorPatients();
        newData.patients = patients || [];
      } catch (error) {
        console.error('Failed to load patients:', error);
        showAlert('Failed to load patients', 'warning');
      }

      // Then, get prescriptions
      try {
        const prescriptions = await doctorService.getDoctorPrescriptions();
        newData.prescriptions = prescriptions || [];
      } catch (error) {
        console.error('Failed to load prescriptions:', error);
        showAlert('Failed to load prescriptions', 'warning');
      }

      // Finally, get appointments
      try {
        const appointments = await doctorService.getDoctorAppointments();
        newData.appointments = appointments || [];
      } catch (error) {
        console.error('Failed to load appointments:', error);
        showAlert('Failed to load appointments', 'warning');
      }

      console.log('All data fetched successfully');
      setDashboardData(newData);
      updateDashboardData(newData);
      setDataLoaded(true);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showAlert('Failed to load doctor profile', 'error');
      // Set empty data on error
      setDashboardData({
        doctorProfile: null,
        patients: [],
        prescriptions: [],
        appointments: []
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, updateDashboardData, showAlert, dataLoaded]);

  useEffect(() => {
    console.log('DoctorContent useEffect - Auth state:', {
      isAuthenticated,
      userRole: user?.role,
      dataLoaded
    });
    
    // Reset dataLoaded when auth state changes
    if (!isAuthenticated || !user) {
      setDataLoaded(false);
    }
    
    // Only fetch data if not already loaded
    if (!dataLoaded) {
      fetchDashboardData();
    }

    // Cleanup function
    return () => {
      // No cleanup needed
    };
  }, [fetchDashboardData, isAuthenticated, user, dataLoaded]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route index element={<DoctorDashboard dashboardData={dashboardData} />} />
      <Route path="/*" element={<Outlet />} />
    </Routes>
  );
};

const DoctorPortal = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  console.log('DoctorPortal - Auth state:', {
    isAuthenticated,
    isLoading,
    userRole: user?.role
  });

  // Show loading state
  if (isLoading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  // Redirect if not authenticated or not a doctor
  if (!isAuthenticated || (user && user.role !== 'doctor')) {
    console.log('Redirecting to login - Not authenticated or not a doctor');
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { path: '/doctor', label: 'Dashboard', icon: 'fas fa-home' },
    { path: '/doctor/patients', label: 'Patients', icon: 'fas fa-user-injured' },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: 'fas fa-prescription' },
    { path: '/doctor/schedule', label: 'Schedule', icon: 'fas fa-calendar' }
  ];

  return (
    <DoctorProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          title="Doctor Portal"
          navLinks={navLinks}
          user={user}
        />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <DoctorContent />
          </div>
        </div>
      </div>
    </DoctorProvider>
  );
};

export default DoctorPortal;
