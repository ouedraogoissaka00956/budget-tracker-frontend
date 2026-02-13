import api from './api';

const notificationService = {
  getAll: async (read = null, limit = 50) => {
    const params = new URLSearchParams();
    if (read !== null) params.append('read', read);
    params.append('limit', limit);
    
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  create: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  deleteAllRead: async () => {
    const response = await api.delete('/notifications/read');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};

export default notificationService;