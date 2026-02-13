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
  Line,
  AreaChart,
  Area
} from 'recharts';

const YearlyReportCard = ({ report }) => {
  if (!report) return null;

  const { summary, monthlyStats, insights } = report;

  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  const chartData = monthlyStats.map((stat) => ({
    month: monthNames[stat.month - 1],
    Revenus: stat.income,
    Dépenses: stat.expense,
    Solde: stat.balance,
  }));

  return (
    <div className="space-y-6">
      {/* Résumé annuel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Revenus totaux</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.totalIncome)}</p>
          <p className="text-sm mt-2 opacity-90">
            Moy: {formatCurrency(summary.avgMonthlyIncome)}/mois
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Dépenses totales</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.totalExpense)}</p>
          <p className="text-sm mt-2 opacity-90">
            Moy: {formatCurrency(summary.avgMonthlyExpense)}/mois
          </p>
        </div>

        <div className={`bg-gradient-to-br ${summary.totalBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl shadow-md p-6 text-white`}>
          <p className="text-sm opacity-90 mb-1">Solde annuel</p>
          <p className="text-3xl font-bold">{formatCurrency(summary.totalBalance)}</p>
          <p className="text-sm mt-2 opacity-90">
            Taux d'épargne: {summary.totalIncome > 0 ? ((summary.totalBalance / summary.totalIncome) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Transactions</p>
          <p className="text-3xl font-bold">{summary.transactionCount}</p>
          <p className="text-sm mt-2 opacity-90">
            Moy: {Math.round(summary.transactionCount / 12)}/mois
          </p>
        </div>
      </div>

      {/* Meilleur et pire mois */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Meilleur mois 🏆
            </h3>
            <span className="text-3xl"> </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {monthNames[insights.bestMonth.month - 1]} {report.year}
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(insights.bestMonth.balance)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Solde le plus élevé de l'année
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mois à améliorer  
            </h3>
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {monthNames[insights.worstMonth.month - 1]} {report.year}
            </p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(insights.worstMonth.balance)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Solde le plus faible de l'année
            </p>
          </div>
        </div>
      </div>

      {/* Graphique en barres - Revenus vs Dépenses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenus vs Dépenses par mois
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Revenus" fill="#10B981" />
            <Bar dataKey="Dépenses" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique en ligne - Évolution du solde */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Évolution du solde mensuel
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Solde" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique en aires - Vue d'ensemble */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Vue d'ensemble annuelle
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="Revenus" 
              stackId="1"
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="Dépenses" 
              stackId="2"
              stroke="#EF4444" 
              fill="#EF4444" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau détaillé par mois */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Détails mensuels
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Mois
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Revenus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Dépenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Transactions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {monthlyStats.map((stat) => (
                <tr key={stat.month} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {monthNames[stat.month - 1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                    {formatCurrency(stat.income)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                    {formatCurrency(stat.expense)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    stat.balance >= 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {formatCurrency(stat.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {stat.transactionCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YearlyReportCard;