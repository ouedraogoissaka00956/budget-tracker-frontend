import React, { createContext, useState, useContext, useCallback } from 'react';
import recurringTransactionService from '../services/recurringTransactionService';

const RecurringTransactionContext = createContext();

export const useRecurringTransactions = () => {
  const context = useContext(RecurringTransactionContext);
  if (!context) {
    throw new Error('useRecurringTransactions doit être utilisé dans un RecurringTransactionProvider');
  }
  return context;
};

export const RecurringTransactionProvider = ({ children }) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecurringTransactions = useCallback(async (active = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recurringTransactionService.getAll(active);
      setRecurringTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecurringTransaction = async (data) => {
    setError(null);
    try {
      const newRecurring = await recurringTransactionService.create(data);
      setRecurringTransactions((prev) => [newRecurring, ...prev]);
      return newRecurring;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    }
  };

  const updateRecurringTransaction = async (id, data) => {
    setError(null);
    try {
      const updated = await recurringTransactionService.update(id, data);
      setRecurringTransactions((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteRecurringTransaction = async (id) => {
    setError(null);
    try {
      await recurringTransactionService.delete(id);
      setRecurringTransactions((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const executeRecurringTransaction = async (id) => {
    setError(null);
    try {
      const result = await recurringTransactionService.execute(id);
      setRecurringTransactions((prev) =>
        prev.map((r) => (r._id === id ? result.recurringTransaction : r))
      );
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'exécution');
      throw err;
    }
  };

  const toggleRecurringTransaction = async (id) => {
    setError(null);
    try {
      const updated = await recurringTransactionService.toggle(id);
      setRecurringTransactions((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du basculement');
      throw err;
    }
  };

  const value = {
    recurringTransactions,
    loading,
    error,
    fetchRecurringTransactions,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    executeRecurringTransaction,
    toggleRecurringTransaction,
  };

  return (
    <RecurringTransactionContext.Provider value={value}>
      {children}
    </RecurringTransactionContext.Provider>
  );
};