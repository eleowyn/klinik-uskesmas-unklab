import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    doctorProfile: null,
    patients: [],
    prescriptions: [],
    appointments: []
  });

  // Use ref to track if data has been loaded
  const dataLoadedRef = useRef(false);

  // Memoize the update function to prevent unnecessary re-renders
  const updateDashboardData = useCallback((newData) => {
    console.log('DoctorContext - Updating dashboard data');
    setDashboardData(prevData => {
      // Only update if data has actually changed
      if (JSON.stringify(prevData) === JSON.stringify(newData)) {
        console.log('DoctorContext - Data unchanged, skipping update');
        return prevData;
      }
      console.log('DoctorContext - Data changed, updating state');
      dataLoadedRef.current = true;
      return newData;
    });
  }, []);

  // Memoize individual data updates
  const updatePatients = useCallback((patients) => {
    console.log('DoctorContext - Updating patients');
    setDashboardData(prev => ({
      ...prev,
      patients: patients || []
    }));
  }, []);

  const updatePrescriptions = useCallback((prescriptions) => {
    console.log('DoctorContext - Updating prescriptions');
    setDashboardData(prev => ({
      ...prev,
      prescriptions: prescriptions || []
    }));
  }, []);

  const updateAppointments = useCallback((appointments) => {
    console.log('DoctorContext - Updating appointments');
    setDashboardData(prev => ({
      ...prev,
      appointments: appointments || []
    }));
  }, []);

  const updateProfile = useCallback((profile) => {
    console.log('DoctorContext - Updating profile');
    setDashboardData(prev => ({
      ...prev,
      doctorProfile: profile
    }));
  }, []);

  // Check if data has been loaded
  const isDataLoaded = useCallback(() => {
    return dataLoadedRef.current;
  }, []);

  // Reset data loaded state
  const resetDataLoaded = useCallback(() => {
    console.log('DoctorContext - Resetting data loaded state');
    dataLoadedRef.current = false;
  }, []);

  const value = {
    dashboardData,
    updateDashboardData,
    updatePatients,
    updatePrescriptions,
    updateAppointments,
    updateProfile,
    isDataLoaded,
    resetDataLoaded
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctorContext must be used within a DoctorProvider');
  }
  return context;
};

export default DoctorContext;
