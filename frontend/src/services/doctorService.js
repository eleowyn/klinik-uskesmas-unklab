import api from './authService';

export const getDoctorProfile = async () => {
  try {
    const response = await api.get('/doctors/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch doctor profile';
  }
};

export const getDoctorPrescriptions = async () => {
  try {
    const response = await api.get('/doctors/prescriptions');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch prescriptions';
  }
};

export const createPrescription = async (prescriptionData) => {
  try {
    const response = await api.post('/doctors/prescriptions', prescriptionData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create prescription';
  }
};

export const getPrescriptionDetails = async (prescriptionId) => {
  try {
    const response = await api.get(`/doctors/prescriptions/${prescriptionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch prescription details';
  }
};

export const updatePrescription = async (prescriptionId, updateData) => {
  try {
    const response = await api.put(`/doctors/prescriptions/${prescriptionId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update prescription';
  }
};

// Add this if you need a default export
export default {
  getDoctorProfile,
  getDoctorPrescriptions,
  createPrescription,
  getPrescriptionDetails,
  updatePrescription
};