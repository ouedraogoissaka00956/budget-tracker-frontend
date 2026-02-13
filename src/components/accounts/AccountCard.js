import React from 'react';
import { formatCurrency } from '../../utils/helpers';

const AccountCard = ({ account, onEdit, onDelete, onSelect }) => {
  const getTypeLabel = (type) => {
    const labels = {
      checking: 'Compte courant',
      savings: 'Compte épargne',
      credit: 'Carte de crédit',
      cash: 'Espèces',
      investment: 'Investissement',
      other: 'Autre'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      checking: '💳',
      savings: '💰',
      credit: '💳',
      cash: '💵',
      investment: ' ',
      other: '🏦'
    };
    return icons[type] || '🏦';
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border-l-4 ${
        account.active ? 'opacity-100' : 'opacity-60'
      }`}
      style={{ borderLeftColor: account.color }}
      onClick={() => onSelect && onSelect(account)}
    >
      {/* En-tête avec gradient */}
      <div 
        className="p-6 text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${account.color} 0%, ${account.color}dd 100%)`
        }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
              {account.icon || getTypeIcon(account.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{account.name}</h3>
              <p className="text-sm opacity-90">{getTypeLabel(account.type)}</p>
            </div>
          </div>
          
          {account.isDefault && (
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
              ⭐ Par défaut
            </span>
          )}
        </div>

        {/* Pattern décoratif */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="150" cy="50" r="80" fill="white" />
            <circle cx="180" cy="120" r="60" fill="white" />
          </svg>
        </div>
      </div>

      {/* Corps */}
      <div className="p-6">
        {/* Solde */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solde actuel</p>
          <p className={`text-3xl font-bold ${
            account.balance >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(account.balance, account.currency)}
          </p>
        </div>

        {/* Informations supplémentaires */}
        {account.bankName && (
          <div className="mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Banque</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {account.bankName}
            </p>
          </div>
        )}

        {account.accountNumber && (
          <div className="mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Numéro de compte</p>
            <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
              •••• {account.accountNumber.slice(-4)}
            </p>
          </div>
        )}

        {account.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {account.description}
            </p>
          </div>
        )}

        {/* Badge statut */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            account.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {account.active ? '✓ Actif' : '✕ Inactif'}
          </span>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(account);
              }}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
              title="Modifier"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(account._id);
              }}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;