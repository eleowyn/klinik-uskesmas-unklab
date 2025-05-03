import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAlert } from './AlertContext';
import staffService from '../services/staffService';

const StaffContext = createContext(null);

export const StaffProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    staffProfile: null,
    patients: [],
    appointments: [],
    transactions: [],
    doctors: []
  });

  const updateDashboardData = useCallback((newData) => {
    setDashboardData(newData);
  }, []);

  const refreshDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [profile, patients, appointments, transactions, doctors] = await Promise.all([
        staffService.getStaffProfile(),
        staffService.getAllPatients(),
        staffService.getUpcomingAppointments(),
        staffService.getTransactions(),
        staffService.getDoctors()
      ]);

      const newData = {
        staffProfile: profile,
        patients: Array.isArray(patients) ? patients : [],
        appointments: Array.isArray(appointments) ? appointments : [],
        transactions: Array.isArray(transactions) ? transactions : [],
        doctors: Array.isArray(doctors) ? doctors : []
      };

      setDashboardData(newData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err.message || 'Failed to refresh dashboard data');
      showAlert(err.message || 'Failed to refresh dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Patient Management
  const addPatient = useCallback(async (patientData) => {
    try {
      const newPatient = await staffService.createPatient(patientData);
      setDashboardData(prev => ({
        ...prev,
        patients: [...prev.patients, newPatient]
      }));
      showAlert('Patient added successfully', 'success');
      return newPatient;
    } catch (err) {
      showAlert(err.message || 'Failed to add patient', 'error');
      throw err;
    }
  }, [showAlert]);

  // Transaction Management
  const addTransaction = useCallback(async (transactionData) => {
    try {
      const newTransaction = await staffService.createTransaction(transactionData);
      setDashboardData(prev => ({
        ...prev,
        transactions: [...prev.transactions, newTransaction]
      }));
      showAlert('Transaction created successfully', 'success');
      return newTransaction;
    } catch (err) {
      showAlert(err.message || 'Failed to create transaction', 'error');
      throw err;
    }
  }, [showAlert]);

  // Appointment Management
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      const newAppointment = await staffService.createAppointment(appointmentData);
      setDashboardData(prev => ({
        ...prev,
        appointments: [...prev.appointments, newAppointment]
      }));
      showAlert('Appointment scheduled successfully', 'success');
      return newAppointment;
    } catch (err) {
      showAlert(err.message || 'Failed to schedule appointment', 'error');
      throw err;
    }
  }, [showAlert]);

  const updateAppointment = useCallback(async (appointmentId, updateData) => {
    try {
      const updatedAppointment = await staffService.updateAppointment(appointmentId, updateData);
      setDashboardData(prev => ({
        ...prev,
        appointments: prev.appointments.map(apt => 
          apt._id === appointmentId ? updatedAppointment : apt
        )
      }));
      showAlert('Appointment updated successfully', 'success');
      return updatedAppointment;
    } catch (err) {
      showAlert(err.message || 'Failed to update appointment', 'error');
      throw err;
    }
  }, [showAlert]);

  const value = {
    loading,
    error,
    dashboardData,
    updateDashboardData,
    refreshDashboardData,
    addPatient,
    addTransaction,
    addAppointment,
    updateAppointment
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaffContext = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaffContext must be used within a StaffProvider');
  }
  return context;
};
