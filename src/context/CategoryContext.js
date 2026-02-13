import React, { createContext, useState, useContext, useCallback } from 'react';
import categoryService from '../services/categoryService';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories doit être utilisé dans un CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (type = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll(type);
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (categoryData) => {
    setError(null);
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    setError(null);
    try {
      const updated = await categoryService.update(id, categoryData);
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    setError(null);
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const value = {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};