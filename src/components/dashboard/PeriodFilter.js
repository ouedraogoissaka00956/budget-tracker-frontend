import React, { useState } from 'react';
import { getMonthRange } from '../../utils/helpers';

const PeriodFilter = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handleQuickFilter = (filterType) => {
    setActiveFilter(filterType);
    const today = new Date();
    let startDate, endDate;

    switch (filterType) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;

      case 'week':
        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - diffToMonday);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        const monthRange = getMonthRange(today);
        startDate = monthRange.firstDay;
        endDate = monthRange.lastDay;
        break;

      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;

      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;

      case 'all':
        startDate = null;
        endDate = null;
        break;

      default:
        return;
    }

    onFilterChange({
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      period: filterType
    });
  };

  const handleCustomFilter = () => {
    if (customStartDate && customEndDate) {
      setActiveFilter('custom');
      onFilterChange({
        startDate: new Date(customStartDate).toISOString(),
        endDate: new Date(customEndDate).toISOString(),
        period: 'custom'
      });
    }
  };

  const filters = [
    { value: 'today', label: "Aujourd'hui", icon: ' ' },
    { value: 'week', label: 'Cette semaine', icon: ' ' },
    { value: 'month', label: 'Ce mois', icon: ' ️' },
    { value: 'quarter', label: 'Ce trimestre', icon: ' ' },
    { value: 'year', label: 'Cette année', icon: ' ' },
    { value: 'all', label: 'Tout', icon: ' ' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Période de visualisation
      </h3>

      {/* Filtres rapides */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleQuickFilter(filter.value)}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeFilter === filter.value
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl block mb-1">{filter.icon}</span>
            <span className="text-xs">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Filtre personnalisé */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Période personnalisée
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date de début</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date de fin</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCustomFilter}
              disabled={!customStartDate || !customEndDate}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodFilter;