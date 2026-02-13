import api from './api';

const accountService = {
  getAll: async (active = null) => {
    const params = active !== null ? `?active=${active}` : '';
    const response = await api.get(`/accounts${params}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/accounts', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },

  transfer: async (fromAccountId, toAccountId, amount, description) => {
    const response = await api.post('/accounts/transfer', {
      fromAccountId,
      toAccountId,
      amount,
      description
    });
    return response.data;
  },

  getTotalBalance: async () => {
    const response = await api.get('/accounts/total-balance');
    return response.data;
  },
};

export default accountService;