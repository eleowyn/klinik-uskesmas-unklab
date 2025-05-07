import api from './api';

const transactionService = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  getMedicalRecords: async () => {
    const response = await api.get('/medical-records');
    return response.data;
  },
};

export default transactionService;