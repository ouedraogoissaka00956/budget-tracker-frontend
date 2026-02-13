import React from 'react';
import Button from '../common/Button';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">Aucune catégorie trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category._id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4"
          style={{ borderLeftColor: category.color }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.type === 'income' ? (
                  <TrendingUp size={24} style={{ color: category.color }} />
                ) : (
                  <TrendingDown size={24} style={{ color: category.color }} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: category.color + '20',
                    color: category.color,
                  }}
                >
                  {category.type === 'income' ? 'Revenu' : 'Dépense'}
                </span>
              </div>
            </div>
          </div>

          {category.budget > 0 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Budget mensuel</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.budget.toLocaleString()} F CFA
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={() => onEdit(category)}
              variant="secondary"
              size="sm"
              icon={Edit}
              className="flex-1"
            >
              Modifier
            </Button>
            <Button
              onClick={() => onDelete(category._id)}
              variant="danger"
              size="sm"
              icon={Trash2}
              className="flex-1"
            >
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;