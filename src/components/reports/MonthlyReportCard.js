import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MonthlyReportCard = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">Aucune donnée disponible</p>
      </div>
    );
  }

  const chartData = data.byCategory
    ? Object.entries(data.byCategory).map(([name, values]) => ({
        name,
        revenus: values.income || 0,
        dépenses: values.expense || 0,
      }))
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Rapport Mensuel
        </h2>
        
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenus</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.totalIncome?.toLocaleString() || 0} F CFA
                </p>
              </div>
              <TrendingUp size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dépenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {data.totalExpense?.toLocaleString() || 0} F CFA
                </p>
              </div>
              <TrendingDown size={32} className="text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Solde</p>
              <p className={`text-2xl font-bold ${
                data.balance >= 0 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {data.balance?.toLocaleString() || 0} F CFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique */}
      {chartData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenus vs Dépenses par catégorie
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.95)',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Bar dataKey="revenus" fill="#10B981" name="Revenus" />
              <Bar dataKey="dépenses" fill="#EF4444" name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tableau des transactions */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Nombre total de transactions : <span className="font-semibold">{data.transactionCount || 0}</span>
        </p>
      </div>
    </div>
  );
};

export default MonthlyReportCard;
