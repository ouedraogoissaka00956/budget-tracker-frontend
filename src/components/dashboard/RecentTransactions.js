import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Transactions récentes</h3>
        <Link
          to="/transactions"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Voir tout →
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <span className="text-2xl">
                    {transaction.type === 'income' ? ' ' : ' '}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{transaction.category}</p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <span className="text-5xl mb-4 block"> </span>
          <p>Aucune transaction pour le moment</p>
          <Link
            to="/transactions"
            className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
          >
            Ajouter une transaction
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;