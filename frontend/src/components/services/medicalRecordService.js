import api from './api';

const medicalRecordService = {
  getAll: async () => {
    const response = await api.get('/medical-records');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/medical-records', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/medical-records/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/medical-records/${id}`);
    return response.data;
  },

  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  getDoctors: async () => {
    const response = await api.get('/staff?role=doctor');
    return response.data;
  },
};

export default medicalRecordService;