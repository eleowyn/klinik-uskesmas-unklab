import api from './api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/staff/login', { username, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/staff/me'); // Sesuaikan endpoint jika berbeda
    return response.data;
  },

  logout: async () => {
    await api.post('/staff/logout'); // Sesuaikan endpoint jika ada
    localStorage.removeItem('token');
  },
};

export default authService;