import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';

const GoalCard = ({ goal, onEdit, onDelete, onAddAmount }) => {
  const [isAddAmountModalOpen, setIsAddAmountModalOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = goal.deadline 
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const handleAddAmount = async (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      await onAddAmount(goal._id, parseFloat(amount));
      setAmount('');
      setIsAddAmountModalOpen(false);
    }
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4"
        style={{ borderLeftColor: goal.color }}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              {goal.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor()}`}>
            {goal.priority === 'high' ? 'Haute' : goal.priority === 'medium' ? 'Moyenne' : 'Basse'}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progression
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`${getProgressColor()} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Montants */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Actuel</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Objectif</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>Reste: {formatCurrency(remaining)}</span>
          {daysLeft !== null && (
            <span className={daysLeft < 0 ? 'text-red-600 dark:text-red-400' : ''}>
              {daysLeft < 0 ? 'Échéance dépassée' : `${daysLeft} jours restants`}
            </span>
          )}
        </div>

        {/* Badge complété */}
        {goal.completed && (
          <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-center">
            <span className="text-green-800 dark:text-green-200 font-semibold text-sm">
              ✓ Objectif atteint !
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsAddAmountModalOpen(true)}
            variant="primary"
            size="sm"
            className="flex-1"
            disabled={goal.completed}
          >
            + Ajouter
          </Button>
          <button
            onClick={() => onEdit(goal)}
            className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Modal Ajouter un montant */}
      <Modal
        isOpen={isAddAmountModalOpen}
        onClose={() => setIsAddAmountModalOpen(false)}
        title="Ajouter un montant"
        size="sm"
      >
        <form onSubmit={handleAddAmount} className="space-y-4">
          <Input
            label="Montant à ajouter"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            required
            min="1"
            step="0.01"
          />
          <div className="flex space-x-3">
            <Button type="submit" variant="primary" className="flex-1">
              Ajouter
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddAmountModalOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GoalCard;