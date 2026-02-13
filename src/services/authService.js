import api from './api';

const authService = {
  register: async (userData) => {
    console.log('AuthService - Register:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('AuthService - Register response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('AuthService - Token saved:', response.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    console.log('AuthService - Login:', credentials);
    const response = await api.post('/auth/login', credentials);
    console.log('AuthService - Login response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('AuthService - Token saved');
    } else {
      console.error('AuthService - No token in response!');
    }
    
    return response.data;
  },

  logout: () => {
    console.log('AuthService - Logout');
    localStorage.removeItem('token');
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  uploadProfilePicture: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post('/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  deleteProfilePicture: async () => {
    const response = await api.delete('/auth/profile-picture');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyPIN: async (email, pin) => {
    const response = await api.post('/auth/verify-pin', { email, pin });
    return response.data;
  },

  resetPasswordWithPIN: async (email, pin, password) => {
    const response = await api.post('/auth/reset-password-pin', { email, pin, password });
    return response.data;
  },
};

export default authService;