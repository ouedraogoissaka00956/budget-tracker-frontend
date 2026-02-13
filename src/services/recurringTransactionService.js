import api from './api';

const recurringTransactionService = {
  getAll: async (active = null) => {
    const params = active !== null ? `?active=${active}` : '';
    const response = await api.get(`/recurring-transactions${params}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/recurring-transactions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/recurring-transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recurring-transactions/${id}`);
    return response.data;
  },

  execute: async (id) => {
    const response = await api.post(`/recurring-transactions/${id}/execute`);
    return response.data;
  },

  toggle: async (id) => {
    const response = await api.put(`/recurring-transactions/${id}/toggle`);
    return response.data;
  },
};

export default recurringTransactionService;