import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const CategoryForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#3B82F6',
    budget: '',
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

  const typeOptions = [
    { value: 'income', label: 'Revenu' },
    { value: 'expense', label: 'Dépense' },
  ];

  const colorOptions = [
    { value: '#3B82F6', label: '🔵 Bleu' },
    { value: '#10B981', label: '🟢 Vert' },
    { value: '#EF4444', label: '🔴 Rouge' },
    { value: '#F59E0B', label: '🟠 Orange' },
    { value: '#8B5CF6', label: '🟣 Violet' },
    { value: '#EC4899', label: '🩷 Rose' },
    { value: '#06B6D4', label: '🔷 Cyan' },
    { value: '#F97316', label: '🟧 Orange foncé' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom de la catégorie"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Alimentation, Transport..."
        required
      />

      <Select
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={typeOptions}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Couleur
        </label>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: option.value })}
              className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                formData.color === option.value
                  ? 'border-gray-900 dark:border-white shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              style={{ backgroundColor: option.value }}
            >
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {option.label.split(' ')[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Budget mensuel (optionnel)"
        type="number"
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        min="0"
        step="0.01"
        placeholder="Ex: 50000"
      />

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? 'Modifier' : 'Créer la catégorie'}
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

export default CategoryForm;