import React from 'react';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4"
      style={{ borderLeftColor: category.color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
            <span className={`text-sm px-2 py-1 rounded-full ${
              category.type === 'income' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.type === 'income' ? 'Revenu' : 'Dépense'}
            </span>
            {category.budgetLimit && (
              <p className="text-sm text-gray-500 mt-1">
                Limite: {category.budgetLimit.toLocaleString()} XOF
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(category._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;