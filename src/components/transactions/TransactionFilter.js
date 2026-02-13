import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { getMonthRange } from '../../utils/helpers';

const TransactionFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        cleanFilters[key] = filters[key];
      }
    });
    onFilter(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      category: '',
    });
    onFilter({});
  };

  const setThisMonth = () => {
    const { firstDay, lastDay } = getMonthRange();
    setFilters({
      ...filters,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0],
    });
  };

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'income', label: 'Revenus' },
    { value: 'expense', label: 'Dépenses' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Date de début"
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />

        <Input
          label="Date de fin"
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />

        <Select
          label="Type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={typeOptions}
        />

        <Input
          label="Catégorie"
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Ex: Alimentation"
        />

        <div className="md:col-span-4 flex space-x-3">
          <Button type="submit" variant="primary">
            Appliquer les filtres
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button type="button" variant="outline" onClick={setThisMonth}>
            Ce mois
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionFilter;