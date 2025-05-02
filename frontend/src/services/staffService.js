import api from './authService';

// Staff Profile Services
export const getStaffProfile = async () => {
  try {
    const response = await api.get('/staff/profile');
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch staff profile';
  }
};

// Patient Services
export const getPatients = async () => {
  try {
    const response = await api.get('/staff/patients');
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch patients';
  }
};

// Single Patient
export const getPatient = async (patientId) => {
  try {
    const response = await api.get(`/staff/patients/${patientId}`);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch patient';
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await api.post('/staff/patients', patientData);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create patient';
  }
};

export const updatePatient = async (patientId, updateData) => {
  try {
    const response = await api.put(`/staff/patients/${patientId}`, updateData);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update patient';
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await api.delete(`/staff/patients/${patientId}`);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete patient';
  }
};

// Transaction Services
export const getTransactions = async () => {
  try {
    const response = await api.get('/staff/transactions');
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transactions';
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/staff/transactions', transactionData);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create transaction';
  }
};

export const getTransactionDetails = async (transactionId) => {
  try {
    const response = await api.get(`/staff/transactions/${transactionId}`);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transaction details';
  }
};

export const updateTransaction = async (transactionId, updateData) => {
  try {
    const response = await api.put(`/staff/transactions/${transactionId}`, updateData);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update transaction';
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await api.delete(`/staff/transactions/${transactionId}`);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete transaction';
  }
};

// Appointment Services
export const getAppointments = async () => {
  try {
    const response = await api.get('/staff/appointments');
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch appointments';
  }
};

export const getAppointment = async (appointmentId) => {
  try {
    const response = await api.get(`/staff/appointments/${appointmentId}`);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch appointment';
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/staff/appointments', appointmentData);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create appointment';
  }
};

export const updateAppointment = async (appointmentId, updateData) => {
  try {
    const response = await api.put(`/staff/appointments/${appointmentId}`, updateData);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update appointment';
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/staff/appointments/${appointmentId}`);
    return response.data?.data || null;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete appointment';
  }
};

export const getPatientTransactions = async (patientId) => {
  try {
    const response = await api.get(`/staff/patients/${patientId}/transactions`);
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch patient transactions';
  }
};

// Doctor Services
export const getDoctors = async () => {
  try {
    const response = await api.get('/staff/doctors');
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch doctors';
  }
};

// Export the api instance for direct axios usage if needed
export default api;
