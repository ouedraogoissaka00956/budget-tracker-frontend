import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext - Initialisation');
    const token = localStorage.getItem('token');
    console.log('AuthContext - Token trouvé:', token ? 'Oui' : 'Non');
    
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      console.log('AuthContext - Fetching user...');
      const response = await api.get('/auth/me');
      console.log('AuthContext - User data:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('AuthContext - Erreur chargement utilisateur:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext - Register:', userData);
      const data = await authService.register(userData);
      console.log('AuthContext - Register response:', data);
      setUser(data);
      return data;
    } catch (error) {
      console.error('AuthContext - Erreur register:', error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext - Login:', credentials.email);
      const data = await authService.login(credentials);
      console.log('AuthContext - Login response:', data);
      
      // Vérifier que le token existe
      if (!data.token) {
        throw new Error('Token manquant dans la réponse');
      }
      
      // Définir l'utilisateur
      setUser(data);
      console.log('AuthContext - User set:', data);
      
      return data;
    } catch (error) {
      console.error('AuthContext - Erreur login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext - Logout');
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updatedUser = await authService.updateProfile(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  const uploadProfilePicture = async (file, onProgress) => {
    const result = await authService.uploadProfilePicture(file, onProgress);
    setUser({ ...user, ...result });
    return result;
  };

  const deleteProfilePicture = async () => {
    await authService.deleteProfilePicture();
    setUser({ ...user, profilePicture: null, profilePicturePublicId: null });
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
  };

  console.log('AuthContext - Current state:', { user, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};