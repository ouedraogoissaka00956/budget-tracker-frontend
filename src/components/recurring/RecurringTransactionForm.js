import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const RecurringTransactionForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dayOfMonth: '',
    dayOfWeek: '',
    autoCreate: true,
    notifyBefore: 1,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description || '',
        frequency: initialData.frequency,
        startDate: new Date(initialData.startDate).toISOString().split('T')[0],
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        dayOfMonth: initialData.dayOfMonth || '',
        dayOfWeek: initialData.dayOfWeek !== undefined ? initialData.dayOfWeek : '',
        autoCreate: initialData.autoCreate !== undefined ? initialData.autoCreate : true,
        notifyBefore: initialData.notifyBefore || 1,
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
    { value: 'expense', label: 'Dépense' },
    { value: 'income', label: 'Revenu' },
  ];

  const frequencyOptions = [
    { value: 'daily', label: '  Quotidien' },
    { value: 'weekly', label: '  Hebdomadaire' },
    { value: 'biweekly', label: ' ️ Bimensuel (toutes les 2 semaines)' },
    { value: 'monthly', label: '  Mensuel' },
    { value: 'quarterly', label: '  Trimestriel' },
    { value: 'yearly', label: '  Annuel' },
  ];

  const dayOfWeekOptions = [
    { value: '', label: 'Sélectionner un jour' },
    { value: 0, label: 'Dimanche' },
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
  ];

  const showDayOfMonth = ['monthly', 'quarterly', 'yearly'].includes(formData.frequency);
  const showDayOfWeek = ['weekly', 'biweekly'].includes(formData.frequency);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom de la transaction récurrente"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Loyer mensuel"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
          required
        />

        <Input
          label="Montant"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="50000"
          required
          min="0"
          step="0.01"
        />
      </div>

      <Input
        label="Catégorie"
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Ex: Logement"
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Notes supplémentaires..."
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <Select
        label="Fréquence"
        name="frequency"
        value={formData.frequency}
        onChange={handleChange}
        options={frequencyOptions}
        required
      />

      {/* Jour du mois pour mensuel, trimestriel, annuel */}
      {showDayOfMonth && (
        <Input
          label="Jour du mois (1-31)"
          type="number"
          name="dayOfMonth"
          value={formData.dayOfMonth}
          onChange={handleChange}
          placeholder="Ex: 1 pour le premier du mois"
          min="1"
          max="31"
        />
      )}

      {/* Jour de la semaine pour hebdomadaire, bimensuel */}
      {showDayOfWeek && (
        <Select
          label="Jour de la semaine"
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          options={dayOfWeekOptions}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date de début"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <Input
          label="Date de fin (optionnel)"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>

      {/* Options */}
      <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoCreate"
            name="autoCreate"
            checked={formData.autoCreate}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="autoCreate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Créer automatiquement les transactions
          </label>
        </div>

        <Input
          label="Notifier avant (jours)"
          type="number"
          name="notifyBefore"
          value={formData.notifyBefore}
          onChange={handleChange}
          min="0"
          max="30"
        />
      </div>

      {/* Aperçu */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          📋 Aperçu de la récurrence
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          {formData.type === 'income' ? 'Revenu' : 'Dépense'} de{' '}
          <strong>{formData.amount || '0'} XOF</strong> pour{' '}
          <strong>{formData.category || 'catégorie'}</strong>,{' '}
          {frequencyOptions.find(f => f.value === formData.frequency)?.label.replace(/[   ️   ]/g, '').trim().toLowerCase()}
          {formData.autoCreate ? ', avec création automatique' : ', création manuelle requise'}.
        </p>
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

export default RecurringTransactionForm;