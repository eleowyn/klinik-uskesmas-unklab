import api from './authService';

export const getPatientProfile = async () => {
  try {
    const response = await api.get('/patients/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch patient profile';
  }
};

export const getPatientPrescriptions = async () => {
  try {
    const response = await api.get('/patients/prescriptions');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch prescriptions';
  }
};

export const updatePatientProfile = async (updateData) => {
  try {
    const response = await api.put('/patients/profile', updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update profile';
  }
};

export const getClinicInfo = async () => {
  try {
    const response = await api.get('/clinic');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch clinic info';
  }
};