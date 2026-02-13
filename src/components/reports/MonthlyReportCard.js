import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const MonthlyReportCard = ({ report }) => {
  if (!report) return null;

  const { summary, comparison, categoryStats, topExpenses, dailyAverage, projection, goals } = report;

  // Données pour le graphique de catégories
  const categoryChartData = Object.entries(categoryStats).map(([name, values]) => ({
    name,
    Dépenses: values.expense,
    Revenus: values.income,
  }));

  const getChangeIcon = (value) => {
    if (value > 0) return ' ';
    if (value < 0) return ' ';
    return '➡️';
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-red-600 dark:text-red-400';
    if (value < 0) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Résumé principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Revenus</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.income)}</p>
          <div className={`text-sm mt-2 flex items-center ${comparison.incomeChange >= 0 ? 'opacity-90' : 'opacity-75'}`}>
            <span className="mr-1">{getChangeIcon(comparison.incomeChange)}</span>
            <span>{Math.abs(comparison.incomeChange).toFixed(1)}% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Dépenses</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.expense)}</p>
          <div className={`text-sm mt-2 flex items-center ${comparison.expenseChange <= 0 ? 'opacity-90' : 'opacity-75'}`}>
            <span className="mr-1">{getChangeIcon(comparison.expenseChange)}</span>
            <span>{Math.abs(comparison.expenseChange).toFixed(1)}% vs mois dernier</span>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl shadow-md p-6 text-white`}>
          <p className="text-sm opacity-90 mb-1">Solde</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.balance)}</p>
          <p className="text-sm mt-2 opacity-90">
            Taux d'épargne: {summary.savingsRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Transactions</p>
          <p className="text-3xl font-bold">{summary.transactionCount}</p>
          <p className="text-sm mt-2 opacity-90">
            Objectifs complétés: {goals.completed}/{goals.total}
          </p>
        </div>
      </div>

      {/* Moyennes quotidiennes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Moyennes quotidiennes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenus/jour</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(dailyAverage.income)}
              </p>
            </div>
            <span className="text-4xl"> </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dépenses/jour</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(dailyAverage.expense)}
              </p>
            </div>
            <span className="text-4xl"> </span>
          </div>
        </div>
      </div>

      {/* Projection de fin de mois */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Projection de fin de mois
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Dépenses estimées</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(projection.estimatedMonthlyExpense)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Budget restant estimé</span>
            <span className={`font-bold ${projection.remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(projection.remainingBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 dépenses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 5 des dépenses
        </h3>
        <div className="space-y-3">
          {topExpenses.map((expense, index) => (
            <div 
              key={expense._id} 
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {expense.category}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {expense.description}
                  </p>
                </div>
              </div>
              <span className="font-bold text-red-600 dark:text-red-400">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique par catégorie */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Dépenses et revenus par catégorie
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Revenus" fill="#10B981" />
            <Bar dataKey="Dépenses" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyReportCard;