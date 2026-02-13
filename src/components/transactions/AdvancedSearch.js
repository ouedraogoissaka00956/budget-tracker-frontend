import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const AdvancedSearch = ({ onSearch, onReset }) => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: '',
    category: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        filters[key] = searchParams[key];
      }
    });

    onSearch(filters);
  };

  const handleReset = () => {
    setSearchParams({
      keyword: '',
      type: '',
      category: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
    onReset();
  };

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'income', label: 'Revenus' },
    { value: 'expense', label: 'Dépenses' },
  ];

  const sortByOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Montant' },
    { value: 'category', label: 'Catégorie' },
    { value: 'type', label: 'Type' },
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Décroissant' },
    { value: 'asc', label: 'Croissant' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="text-2xl mr-2"> </span>
          Recherche avancée
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
        >
          {isExpanded ? '▲ Réduire' : '▼ Développer'}
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Recherche rapide par mot-clé */}
        <div className="relative">
          <Input
            label="Recherche rapide"
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="Rechercher dans les descriptions et catégories..."
          />
          {searchParams.keyword && (
            <button
              type="button"
              onClick={() => setSearchParams({ ...searchParams, keyword: '' })}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres avancés */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
            <Select
              label="Type"
              name="type"
              value={searchParams.type}
              onChange={handleChange}
              options={typeOptions}
            />

            <Input
              label="Catégorie"
              type="text"
              name="category"
              value={searchParams.category}
              onChange={handleChange}
              placeholder="Ex: Alimentation"
            />

            <Input
              label="Montant minimum"
              type="number"
              name="minAmount"
              value={searchParams.minAmount}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />

            <Input
              label="Montant maximum"
              type="number"
              name="maxAmount"
              value={searchParams.maxAmount}
              onChange={handleChange}
              placeholder="1000000"
              min="0"
            />

            <Input
              label="Date de début"
              type="date"
              name="startDate"
              value={searchParams.startDate}
              onChange={handleChange}
            />

            <Input
              label="Date de fin"
              type="date"
              name="endDate"
              value={searchParams.endDate}
              onChange={handleChange}
            />

            <Select
              label="Trier par"
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleChange}
              options={sortByOptions}
            />

            <Select
              label="Ordre"
              name="sortOrder"
              value={searchParams.sortOrder}
              onChange={handleChange}
              options={sortOrderOptions}
            />
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
              Rechercher
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset} className="flex-1">
              Réinitialiser
          </Button>
        </div>

        {/* Indicateur de filtres actifs */}
        {Object.values(searchParams).some(val => val && val !== 'date' && val !== 'desc') && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
              Filtres actifs:
            </p>
            <div className="flex flex-wrap gap-2">
              {searchParams.keyword && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Mot-clé: "{searchParams.keyword}"
                </span>
              )}
              {searchParams.type && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Type: {searchParams.type === 'income' ? 'Revenus' : 'Dépenses'}
                </span>
              )}
              {searchParams.category && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Catégorie: {searchParams.category}
                </span>
              )}
              {searchParams.minAmount && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Min: {searchParams.minAmount} XOF
                </span>
              )}
              {searchParams.maxAmount && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Max: {searchParams.maxAmount} XOF
                </span>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearch;