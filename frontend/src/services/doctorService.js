import api from './authService';

// Cache for profile data
let profileCache = null;
let lastProfileFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const handleResponse = (response) => {
  if (response.data?.status === 'success') {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'An error occurred');
};

export const getDoctorProfile = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (profileCache && (now - lastProfileFetch < CACHE_DURATION)) {
      console.log('Using cached profile data');
      return profileCache;
    }

    console.log('Fetching doctor profile');
    const response = await api.get('/doctors/profile');
    const data = handleResponse(response);
    
    // Update cache
    profileCache = data;
    lastProfileFetch = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

export const getDoctorPatients = async () => {
  try {
    console.log('Fetching doctor patients');
    const response = await api.get('/doctors/patients');
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    throw error;
  }
};

export const getDoctorPrescriptions = async () => {
  try {
    console.log('Fetching doctor prescriptions');
    const response = await api.get('/doctors/prescriptions');
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    throw error;
  }
};

export const getDoctorAppointments = async () => {
  try {
    console.log('Fetching doctor appointments');
    const response = await api.get('/doctors/appointments');
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
};

export const createPrescription = async (prescriptionData) => {
  try {
    console.log('Creating prescription');
    const response = await api.post('/doctors/prescriptions', prescriptionData);
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

export const getPrescriptionDetails = async (prescriptionId) => {
  try {
    console.log('Fetching prescription details:', prescriptionId);
    const response = await api.get(`/doctors/prescriptions/${prescriptionId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching prescription details:', error);
    throw error;
  }
};

export const updatePrescription = async (prescriptionId, updateData) => {
  try {
    console.log('Updating prescription:', prescriptionId);
    const response = await api.put(`/doctors/prescriptions/${prescriptionId}`, updateData);
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

export const getPatientDetails = async (patientId) => {
  try {
    console.log('Fetching patient details:', patientId);
    const response = await api.get(`/doctors/patients/${patientId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    console.log('Creating appointment');
    const response = await api.post('/doctors/appointments', appointmentData);
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId, updateData) => {
  try {
    console.log('Updating appointment:', appointmentId);
    const response = await api.put(`/doctors/appointments/${appointmentId}`, updateData);
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const getAppointmentDetails = async (appointmentId) => {
  try {
    console.log('Fetching appointment details:', appointmentId);
    const response = await api.get(`/doctors/appointments/${appointmentId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    throw error;
  }
};

export default {
  getDoctorProfile,
  getDoctorPatients,
  getDoctorPrescriptions,
  getDoctorAppointments,
  createPrescription,
  getPrescriptionDetails,
  updatePrescription,
  getPatientDetails,
  createAppointment,
  updateAppointment,
  getAppointmentDetails
};
