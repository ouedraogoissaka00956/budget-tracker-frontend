import React, { createContext, useState, useContext, useCallback } from 'react';
import accountService from '../services/accountService';

const AccountContext = createContext();

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts doit être utilisé dans un AccountProvider');
  }
  return context;
};

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async (active = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountService.getAll(active);
      setAccounts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTotalBalance = useCallback(async () => {
    try {
      const data = await accountService.getTotalBalance();
      setTotalBalance(data.totalBalance);
    } catch (err) {
      console.error('Erreur lors du calcul du solde total:', err);
    }
  }, []);

  const createAccount = async (data) => {
    setError(null);
    try {
      const newAccount = await accountService.create(data);
      setAccounts((prev) => [newAccount, ...prev]);
      await fetchTotalBalance();
      return newAccount;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    }
  };

  const updateAccount = async (id, data) => {
    setError(null);
    try {
      const updated = await accountService.update(id, data);
      setAccounts((prev) => prev.map((a) => (a._id === id ? updated : a)));
      await fetchTotalBalance();
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteAccount = async (id) => {
    setError(null);
    try {
      await accountService.delete(id);
      setAccounts((prev) => prev.filter((a) => a._id !== id));
      await fetchTotalBalance();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const transferBetweenAccounts = async (fromAccountId, toAccountId, amount, description) => {
    setError(null);
    try {
      const result = await accountService.transfer(fromAccountId, toAccountId, amount, description);
      
      // Mettre à jour les comptes
      setAccounts((prev) =>
        prev.map((a) => {
          if (a._id === fromAccountId) return result.fromAccount;
          if (a._id === toAccountId) return result.toAccount;
          return a;
        })
      );
      
      await fetchTotalBalance();
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du transfert');
      throw err;
    }
  };

  const value = {
    accounts,
    totalBalance,
    loading,
    error,
    fetchAccounts,
    fetchTotalBalance,
    createAccount,
    updateAccount,
    deleteAccount,
    transferBetweenAccounts,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};