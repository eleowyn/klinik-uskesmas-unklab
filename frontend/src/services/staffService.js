import api from './authService';

// Staff Profile
export const getStaffProfile = async () => {
  try {
    const response = await api.get('/staff/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching staff profile:', error);
    throw error.response?.data?.message || 'Failed to fetch staff profile';
  }
};

// Patient Management
export const getAllPatients = async () => {
  try {
    const response = await api.get('/staff/patients');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error.response?.data?.message || 'Failed to fetch patients';
  }
};

export const getPatientDetails = async (patientId) => {
  try {
    const response = await api.get(`/staff/patients/${patientId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw error.response?.data?.message || 'Failed to fetch patient details';
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await api.post('/staff/patients', patientData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error.response?.data?.message || 'Failed to create patient';
  }
};

export const updatePatient = async (patientId, updateData) => {
  try {
    const response = await api.put(`/staff/patients/${patientId}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error.response?.data?.message || 'Failed to update patient';
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await api.delete(`/staff/patients/${patientId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error.response?.data?.message || 'Failed to delete patient';
  }
};

// Transaction Management
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/staff/transactions', transactionData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error.response?.data?.message || 'Failed to create transaction';
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get('/staff/transactions');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error.response?.data?.message || 'Failed to fetch transactions';
  }
};

export const getTransactionDetails = async (transactionId) => {
  try {
    const response = await api.get(`/staff/transactions/${transactionId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error.response?.data?.message || 'Failed to fetch transaction details';
  }
};

export const updateTransaction = async (transactionId, updateData) => {
  try {
    const response = await api.put(`/staff/transactions/${transactionId}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error.response?.data?.message || 'Failed to update transaction';
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await api.delete(`/staff/transactions/${transactionId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error.response?.data?.message || 'Failed to delete transaction';
  }
};

// Appointment Management
export const getUpcomingAppointments = async () => {
  try {
    const response = await api.get('/staff/appointments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error.response?.data?.message || 'Failed to fetch appointments';
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/staff/appointments', appointmentData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error.response?.data?.message || 'Failed to create appointment';
  }
};

export const getAppointmentDetails = async (appointmentId) => {
  try {
    const response = await api.get(`/staff/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    throw error.response?.data?.message || 'Failed to fetch appointment details';
  }
};

export const updateAppointment = async (appointmentId, updateData) => {
  try {
    const response = await api.put(`/staff/appointments/${appointmentId}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error.response?.data?.message || 'Failed to update appointment';
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/staff/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error.response?.data?.message || 'Failed to delete appointment';
  }
};

// Doctor Management
export const getDoctors = async () => {
  try {
    const response = await api.get('/staff/doctors');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error.response?.data?.message || 'Failed to fetch doctors';
  }
};

const staffService = {
  getStaffProfile,
  getAllPatients,
  getPatientDetails,
  createPatient,
  updatePatient,
  deletePatient,
  createTransaction,
  getTransactions,
  getTransactionDetails,
  updateTransaction,
  deleteTransaction,
  getUpcomingAppointments,
  createAppointment,
  getAppointmentDetails,
  updateAppointment,
  deleteAppointment,
  getDoctors
};

export default staffService;
