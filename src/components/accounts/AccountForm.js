import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const AccountForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    currency: 'XOF',
    bankName: '',
    accountNumber: '',
    icon: '🏦',
    color: '#3B82F6',
    isDefault: false,
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        balance: initialData.balance,
        currency: initialData.currency,
        bankName: initialData.bankName || '',
        accountNumber: initialData.accountNumber || '',
        icon: initialData.icon || '🏦',
        color: initialData.color || '#3B82F6',
        isDefault: initialData.isDefault || false,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const typeOptions = [
    { value: 'checking', label: '💳 Compte courant' },
    { value: 'savings', label: '💰 Compte épargne' },
    { value: 'credit', label: '💳 Carte de crédit' },
    { value: 'cash', label: '💵 Espèces' },
    { value: 'investment', label: '  Investissement' },
    { value: 'other', label: '🏦 Autre' },
  ];

  const currencyOptions = [
    { value: 'XOF', label: 'XOF - Franc CFA' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'USD', label: 'USD - Dollar américain' },
    { value: 'GBP', label: 'GBP - Livre sterling' },
  ];

  const iconOptions = [
    '🏦', '💳', '💰', '💵', '💸', ' ',
    '🏧', '💎', '🪙', '💴', '💶', '💷'
  ];

  const colorOptions = [
    { value: '#EF4444', label: '🔴 Rouge' },
    { value: '#F59E0B', label: '🟠 Orange' },
    { value: '#10B981', label: '🟢 Vert' },
    { value: '#3B82F6', label: '🔵 Bleu' },
    { value: '#6366F1', label: '🟣 Indigo' },
    { value: '#8B5CF6', label: '🟣 Violet' },
    { value: '#EC4899', label: '🌸 Rose' },
    { value: '#14B8A6', label: '🐚 Turquoise' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom du compte"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Compte principal"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Type de compte"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
        />

        <Select
          label="Devise"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          options={currencyOptions}
        />
      </div>

      <Input
        label="Solde initial"
        type="number"
        name="balance"
        value={formData.balance}
        onChange={handleChange}
        placeholder="0"
        step="0.01"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom de la banque (optionnel)"
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Ex: Bank of Africa"
        />

        <Input
          label="Numéro de compte (optionnel)"
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Ex: 1234567890"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Notes sur ce compte..."
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Sélecteur d'icône */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Icône
        </label>
        <div className="grid grid-cols-6 gap-2">
          {iconOptions.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData({ ...formData, icon })}
              className={`p-3 text-2xl rounded-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                formData.icon === icon
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <Select
        label="Couleur"
        name="color"
        value={formData.color}
        onChange={handleChange}
        options={colorOptions}
      />

      {/* Compte par défaut */}
      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Définir comme compte par défaut
        </label>
      </div>

      {/* Prévisualisation */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prévisualisation
        </p>
        <div
          className="p-4 rounded-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${formData.color} 0%, ${formData.color}dd 100%)`
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl">
              {formData.icon}
            </div>
            <div>
              <p className="font-semibold">{formData.name || 'Nom du compte'}</p>
              <p className="text-sm opacity-90">{formData.bankName || 'Banque'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
};

export default AccountForm;