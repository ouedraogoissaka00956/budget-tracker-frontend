import React, { createContext, useState, useContext, useCallback } from 'react';
import transactionService from '../services/transactionService';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions doit être utilisé dans un TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll(filters);
      
      if (data.transactions) {
        setTransactions(data.transactions);
      } else if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des transactions:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async (filters = {}) => {
    try {
      const data = await transactionService.getStatistics(filters);
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      throw err;
    }
  }, []);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      const newTransaction = await transactionService.create(transactionData);
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return newTransaction;
    } catch (err) {
      console.error('Erreur création transaction:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTransaction = await transactionService.update(id, transactionData);
      
      setTransactions(prev => 
        prev.map(t => t._id === id ? updatedTransaction : t)
      );
      
      return updatedTransaction;
    } catch (err) {
      console.error('Erreur mise à jour transaction:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await transactionService.delete(id);
      
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Erreur suppression transaction:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchStatistics,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};