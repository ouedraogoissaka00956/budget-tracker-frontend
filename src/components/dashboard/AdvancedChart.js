import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import Button from '../common/Button';

const AdvancedChart = ({ data, period = 'month' }) => {
  const [chartType, setChartType] = useState('pie'); // pie, bar, line, area
  const [viewType, setViewType] = useState('expense'); // expense, income, both

  const COLORS = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6',
    '#F97316', '#84CC16', '#06B6D4', '#8B5CF6'
  ];

  // Préparer les données pour les graphiques
  const chartData = useMemo(() => {
    return Object.entries(data).map(([category, values], index) => {
      let value = 0;
      
      if (viewType === 'expense') {
        value = values.expense;
      } else if (viewType === 'income') {
        value = values.income;
      } else {
        value = values.income + values.expense;
      }

      return {
        name: category,
        value: value,
        expense: values.expense,
        income: values.income,
        color: COLORS[index % COLORS.length],
      };
    }).filter(item => item.value > 0);
  }, [data, viewType]);

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
          {viewType === 'both' ? (
            <>
              <p className="text-green-600 text-sm">
                Revenus: {formatCurrency(payload[0].payload.income)}
              </p>
              <p className="text-red-600 text-sm">
                Dépenses: {formatCurrency(payload[0].payload.expense)}
              </p>
              <p className="text-primary-600 font-bold text-sm mt-1">
                Total: {formatCurrency(payload[0].value)}
              </p>
            </>
          ) : (
            <p className={`font-bold ${viewType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(payload[0].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Rendu du graphique circulaire
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  // Rendu du graphique en barres
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {viewType === 'both' ? (
          <>
            <Bar dataKey="income" fill="#10B981" name="Revenus" />
            <Bar dataKey="expense" fill="#EF4444" name="Dépenses" />
          </>
        ) : (
          <Bar 
            dataKey="value" 
            fill={viewType === 'income' ? '#10B981' : '#EF4444'}
            name={viewType === 'income' ? 'Revenus' : 'Dépenses'}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  // Rendu du graphique linéaire
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {viewType === 'both' ? (
          <>
            <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Revenus" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Dépenses" />
          </>
        ) : (
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={viewType === 'income' ? '#10B981' : '#EF4444'}
            strokeWidth={2}
            name={viewType === 'income' ? 'Revenus' : 'Dépenses'}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  // Rendu du graphique en aires
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {viewType === 'both' ? (
          <>
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Revenus" />
            <Area type="monotone" dataKey="expense" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Dépenses" />
          </>
        ) : (
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={viewType === 'income' ? '#10B981' : '#EF4444'}
            fill={viewType === 'income' ? '#10B981' : '#EF4444'}
            fillOpacity={0.6}
            name={viewType === 'income' ? 'Revenus' : 'Dépenses'}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return renderPieChart();
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      default:
        return renderPieChart();
    }
  };

  const chartTypes = [
    { value: 'pie', label: 'Circulaire', icon: ' ' },
    { value: 'bar', label: 'Barres', icon: ' ' },
    { value: 'line', label: 'Lignes', icon: ' ' },
    { value: 'area', label: 'Aires', icon: ' ' },
  ];

  const viewTypes = [
    { value: 'expense', label: 'Dépenses', color: 'bg-red-600' },
    { value: 'income', label: 'Revenus', color: 'bg-green-600' },
    { value: 'both', label: 'Les deux', color: 'bg-blue-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Visualisation par catégorie
        </h3>

        {/* Sélecteur de type de vue */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de données
          </label>
          <div className="flex space-x-2">
            {viewTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setViewType(type.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === type.value
                    ? `${type.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de type de graphique */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de graphique
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  chartType === type.value
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl block mb-1">{type.icon}</span>
                <span className="text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Graphique */}
      {chartData.length > 0 ? (
        <div className="mt-4">
          {renderChart()}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <span className="text-5xl mb-3 block"> </span>
            <p>Aucune donnée disponible pour cette période</p>
          </div>
        </div>
      )}

      {/* Légende détaillée */}
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-600">
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedChart;