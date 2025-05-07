import api from './api';

const prescriptionService = {
  getAll: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },

  getById: async (id) => {
    console.log('prescriptionService.getById called with ID:', id); // Tambahkan log
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  },

  getMedicalRecords: async () => {
    const response = await api.get('/medical-records');
    return response.data;
  },

  getDoctors: async () => {
    const response = await api.get('/staff?role=doctor');
    return response.data;
  },
};

export default prescriptionService;