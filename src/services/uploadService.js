import api from './api';

const uploadService = {
  uploadReceipt: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await api.post('/upload/receipt', formData, {
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

  deleteReceipt: async (publicId) => {
    const response = await api.delete(`/upload/receipt/${publicId}`);
    return response.data;
  },
};

export default uploadService;