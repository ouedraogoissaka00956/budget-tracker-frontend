import React from 'react';
import { formatCurrency } from '../../utils/helpers';

const StatCard = ({ title, amount, icon, color }) => {
  const isNumber = typeof amount === 'number';
  
  return (
    <div className={`rounded-xl shadow-md p-6 ${color} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {isNumber ? formatCurrency(amount) : amount}
          </p>
        </div>
        <div className="bg-white/50 dark:bg-gray-700/50 rounded-full p-4">
          <div className="text-gray-700 dark:text-gray-300">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;