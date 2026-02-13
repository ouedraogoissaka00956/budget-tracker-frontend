import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const GoalForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    description: '',
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom de l'objectif"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Vacances d'été, Nouveau téléphone..."
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Montant cible"
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Ex: 500000"
          required
        />

        <Input
          label="Montant actuel"
          type="number"
          name="currentAmount"
          value={formData.currentAmount}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Ex: 50000"
        />
      </div>

      <Input
        label="Date limite (optionnel)"
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          placeholder="Pourquoi cet objectif est important pour vous..."
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? 'Modifier' : 'Créer l\'objectif'}
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

export default GoalForm;