import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAlert } from './AlertContext';
import doctorService from '../services/doctorService';

const DoctorContext = createContext(null);

export const DoctorProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    doctorProfile: null,
    patients: [],
    prescriptions: [],
    appointments: []
  });

  const updateDashboardData = useCallback((newData) => {
    setDashboardData(newData);
  }, []);

  const refreshDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < maxRetries && !success) {
      try {
        // Get all data in parallel for better performance
        const [profile, patients, prescriptions, appointments] = await Promise.all([
          doctorService.getDoctorProfile(),
          doctorService.getDoctorPatients(),
          doctorService.getDoctorPrescriptions(),
          doctorService.getDoctorAppointments()
        ]);

        // Enhanced debugging
        console.log('Doctor Profile:', profile);
        console.log('Raw Patients Data:', patients);
        console.log('Doctor Data:', {
          doctorId: profile?._id,
          patientsCount: patients?.length,
          prescriptionsCount: prescriptions?.length,
          appointmentsCount: appointments?.length
        });

        const newData = {
          doctorProfile: profile,
          patients: Array.isArray(patients) ? patients : [],
          prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
          appointments: Array.isArray(appointments) ? appointments : []
        };

        // Log the data we're setting
        console.log('Setting Dashboard Data:', {
          patientsCount: newData.patients.length,
          prescriptionsCount: newData.prescriptions.length,
          appointmentsCount: newData.appointments.length
        });

        setDashboardData(newData);
        setError(null);
        success = true;
      } catch (err) {
        lastError = err;
        attempt++;
        console.error(`Attempt ${attempt} failed to refresh dashboard data:`, err);
        if (attempt >= maxRetries) {
          setError(err.message || 'Failed to refresh dashboard data');
          showAlert(err.message || 'Failed to refresh dashboard data', 'error');
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    setLoading(false);
  }, [showAlert]);

  // Patient Management
  const addPatient = useCallback(async (patientData) => {
    try {
      const newPatient = await doctorService.addPatient(patientData);
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

  // Prescription Management
  const addPrescription = useCallback(async (prescriptionData) => {
    try {
      const newPrescription = await doctorService.createPrescription(prescriptionData);
      setDashboardData(prev => ({
        ...prev,
        prescriptions: [...prev.prescriptions, newPrescription]
      }));
      showAlert('Prescription created successfully', 'success');
      return newPrescription;
    } catch (err) {
      showAlert(err.message || 'Failed to create prescription', 'error');
      throw err;
    }
  }, [showAlert]);

  // Appointment Management
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      const newAppointment = await doctorService.createAppointment(appointmentData);
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
      const updatedAppointment = await doctorService.updateAppointment(appointmentId, updateData);
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
    addPrescription,
    addAppointment,
    updateAppointment
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
