import React from 'react';
import { formatCurrency, calculatePercentage } from '../../utils/helpers';

const BudgetProgress = ({ budget, spent }) => {
  const percentage = calculatePercentage(spent, budget);
  const remaining = budget - spent;

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Budget mensuel</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Dépensé</span>
          <span className={`text-sm font-bold ${getTextColor()}`}>
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${getProgressColor()} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Budget total :</span>
          <span className="font-bold text-gray-900">{formatCurrency(budget)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Dépensé :</span>
          <span className="font-bold text-red-600">{formatCurrency(spent)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-gray-600">Restant :</span>
          <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {percentage >= 90 && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">
            ⚠️ Attention ! Vous avez dépassé 90% de votre budget mensuel.
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;