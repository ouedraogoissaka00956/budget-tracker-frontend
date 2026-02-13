import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Button from '../common/Button';

const RecurringTransactionCard = ({ recurring, onEdit, onDelete, onExecute, onToggle }) => {
  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      biweekly: 'Bimensuel',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel'
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyIcon = (frequency) => {
    const icons = {
      daily: ' ',
      weekly: ' ',
      biweekly: ' ️',
      monthly: ' ',
      quarterly: ' ',
      yearly: ' '
    };
    return icons[frequency] || ' ';
  };

  const daysUntilNext = recurring.nextExecution 
    ? Math.ceil((new Date(recurring.nextExecution) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${
        recurring.active ? 'border-l-green-500' : 'border-l-gray-400'
      } ${!recurring.active ? 'opacity-60' : ''}`}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl">
            {getFrequencyIcon(recurring.frequency)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {recurring.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recurring.description}
            </p>
          </div>
        </div>
        
        {/* Badge actif/inactif */}
        <button
          onClick={() => onToggle(recurring._id)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            recurring.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          {recurring.active ? '✓ Actif' : '✕ Inactif'}
        </button>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Type</p>
          <p className={`text-lg font-bold ${
            recurring.type === 'income' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {recurring.type === 'income' ? '  Revenu' : '  Dépense'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Montant</p>
          <p className={`text-lg font-bold ${
            recurring.type === 'income' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(recurring.amount)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fréquence</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {getFrequencyLabel(recurring.frequency)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Catégorie</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {recurring.category}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Date de début:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(recurring.startDate)}
          </span>
        </div>
        
        {recurring.lastExecuted && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Dernière exécution:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(recurring.lastExecuted)}
            </span>
          </div>
        )}
        
        {recurring.nextExecution && recurring.active && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Prochaine exécution:</span>
            <span className={`font-medium ${
              daysUntilNext <= 3 
                ? 'text-orange-600 dark:text-orange-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {formatDate(recurring.nextExecution)}
              {daysUntilNext !== null && (
                <span className="text-xs ml-1">
                  ({daysUntilNext === 0 ? 'Aujourd\'hui' : `dans ${daysUntilNext}j`})
                </span>
              )}
            </span>
          </div>
        )}

        {recurring.endDate && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Date de fin:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(recurring.endDate)}
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded">
        <span>
          {recurring.autoCreate ? '✓ Création automatique' : '✕ Création manuelle'}
        </span>
        {recurring.notifyBefore > 0 && (
          <span>
            🔔 Notification {recurring.notifyBefore}j avant
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          onClick={() => onExecute(recurring._id)}
          variant="primary"
          size="sm"
          className="flex-1"
          disabled={!recurring.active}
        >
            Exécuter maintenant
        </Button>
        <button
          onClick={() => onEdit(recurring)}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          title="Modifier"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(recurring._id)}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default RecurringTransactionCard;