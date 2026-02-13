import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

const TransferForm = ({ accounts, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fromAccountId || !formData.toAccountId || !formData.amount) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      setError('Les comptes source et destination doivent être différents');
      return;
    }

    const fromAccount = accounts.find(a => a._id === formData.fromAccountId);
    if (fromAccount && fromAccount.balance < parseFloat(formData.amount)) {
      setError('Solde insuffisant dans le compte source');
      return;
    }

    onSubmit(formData);
  };

  const accountOptions = accounts
    .filter(a => a.active)
    .map(a => ({
      value: a._id,
      label: `${a.icon} ${a.name} (${formatCurrency(a.balance, a.currency)})`
    }));

  const fromAccount = accounts.find(a => a._id === formData.fromAccountId);
  const toAccount = accounts.find(a => a._id === formData.toAccountId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <Select
        label="Depuis le compte"
        name="fromAccountId"
        value={formData.fromAccountId}
        onChange={handleChange}
        options={[
          { value: '', label: 'Sélectionner un compte source' },
          ...accountOptions
        ]}
        required
      />

      {fromAccount && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Solde disponible: <strong>{formatCurrency(fromAccount.balance, fromAccount.currency)}</strong>
          </p>
        </div>
      )}

      <Select
        label="Vers le compte"
        name="toAccountId"
        value={formData.toAccountId}
        onChange={handleChange}
        options={[
          { value: '', label: 'Sélectionner un compte destination' },
          ...accountOptions
        ]}
        required
      />

      <Input
        label="Montant"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="0"
        required
        min="0.01"
        step="0.01"
      />

      <Input
        label="Description (optionnel)"
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Ex: Virement mensuel"
      />

      {/* Résumé du transfert */}
      {formData.fromAccountId && formData.toAccountId && formData.amount && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📋 Résumé du transfert
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">De:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {fromAccount?.name}
              </span>
            </div>
            <div className="flex items-center justify-center text-2xl">
              ⬇️
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vers:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {toAccount?.name}
              </span>
            </div>
            <div className="pt-2 border-t border-primary-200 dark:border-primary-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(parseFloat(formData.amount) || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          💸 Effectuer le transfert
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default TransferForm;