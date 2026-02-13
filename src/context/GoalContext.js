import React, { createContext, useState, useContext, useCallback } from 'react';
import goalService from '../services/goalService';

const GoalContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals doit être utilisé dans un GoalProvider');
  }
  return context;
};

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async (completed = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalService.getAll(completed);
      setGoals(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = async (goalData) => {
    setError(null);
    try {
      const newGoal = await goalService.create(goalData);
      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    }
  };

  const updateGoal = async (id, goalData) => {
    setError(null);
    try {
      const updated = await goalService.update(id, goalData);
      setGoals((prev) => prev.map((g) => (g._id === id ? updated : g)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    setError(null);
    try {
      await goalService.delete(id);
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  const addAmountToGoal = async (id, amount) => {
    setError(null);
    try {
      const updated = await goalService.addAmount(id, amount);
      setGoals((prev) => prev.map((g) => (g._id === id ? updated : g)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du montant');
      throw err;
    }
  };

  const value = {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addAmountToGoal,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};