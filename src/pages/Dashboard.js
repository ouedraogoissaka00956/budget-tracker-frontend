import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useTransactions } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import { useAuth } from '../context/AuthContext';
import { 
  Hand, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Lightbulb,
  ArrowRight 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { loading: transactionsLoading, fetchTransactions, fetchStatistics } = useTransactions();
  const { accounts, fetchAccounts } = useAccounts();
  const { user } = useAuth();

  const [period, setPeriod] = useState('month');
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
    byCategory: {}
  });

  // Calculer les dates en fonction de la période sélectionnée
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        startDate = weekStart;
        endDate = new Date();
        break;
      
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
        break;
      
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      
      case 'all':
        startDate = null;
        endDate = null;
        break;
      
      case 'custom':
        startDate = customDates.startDate ? new Date(customDates.startDate) : null;
        endDate = customDates.endDate ? new Date(customDates.endDate) : null;
        break;
      
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
  }, [period, customDates]);

  // Charger les données
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const loadData = async () => {
      const { startDate, endDate } = getDateRange();
      
      const filters = {};
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) filters.endDate = endDate.toISOString();

      console.log(' Chargement des données pour:', { period, startDate, endDate });

      try {
        await fetchTransactions(filters);
        const stats = await fetchStatistics(filters);
        setStatistics(stats);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    loadData();
  }, [period, customDates, fetchTransactions, fetchStatistics, getDateRange]);

  // Calculer le solde total des comptes
  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

  // Préparer les données pour les graphiques
  const categoryData = Object.entries(statistics.byCategory || {}).map(([name, data]) => ({
    name,
    revenus: data.income || 0,
    dépenses: data.expense || 0,
  }));

  const pieData = Object.entries(statistics.byCategory || {})
    .filter(([_, data]) => data.expense > 0)
    .map(([name, data]) => ({
      name,
      value: data.expense,
    }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyCustomDates = () => {
    if (customDates.startDate && customDates.endDate) {
      setPeriod('custom');
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return "Aujourd'hui";
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'quarter': return 'Ce trimestre';
      case 'year': return 'Cette année';
      case 'all': return 'Tout';
      case 'custom': return 'Période personnalisée';
      default: return 'Ce mois';
    }
  };

  if (transactionsLoading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête avec salutation */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center space-x-3">
            <Hand size={32} />
            <div>
              <h1 className="text-3xl font-bold">Bonjour, {user?.username} !</h1>
              <p className="text-primary-100 mt-1">Voici un résumé de vos finances pour {getPeriodLabel().toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Sélecteur de période */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Période de visualisation
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
            <button
              onClick={() => setPeriod('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'today'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'week'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Cette semaine
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'month'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ce mois
            </button>
            <button
              onClick={() => setPeriod('quarter')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'quarter'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Ce trimestre
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'year'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Cette année
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'all'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tout
            </button>
          </div>

          {/* Période personnalisée */}
          <div className="border-t dark:border-gray-600 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Période personnalisée
            </h4>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={customDates.startDate}
                  onChange={handleCustomDateChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={customDates.endDate}
                  onChange={handleCustomDateChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={applyCustomDates}
                  variant="primary"
                  disabled={!customDates.startDate || !customDates.endDate}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Solde"
            value={`${totalBalance.toLocaleString()} F CFA`}
            icon={Wallet}
            color="green"
          />
          <StatCard
            title="Revenus"
            value={`${statistics.totalIncome.toLocaleString()} F CFA`}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Dépenses"
            value={`${statistics.totalExpense.toLocaleString()} F CFA`}
            icon={TrendingDown}
            color="red"
          />
          <StatCard
            title="Transactions"
            value={statistics.transactionCount}
            icon={BarChart3}
            color="purple"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en barres par catégorie */}
          {categoryData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Revenus vs Dépenses par catégorie
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
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
                  <Legend 
                    wrapperStyle={{
                      color: '#9CA3AF'
                    }}
                  />
                  <Bar dataKey="revenus" fill="#10B981" name="Revenus" />
                  <Bar dataKey="dépenses" fill="#EF4444" name="Dépenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Graphique circulaire des dépenses */}
          {pieData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Répartition des dépenses
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.95)',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Conseils */}
        {statistics.totalExpense > statistics.totalIncome && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Lightbulb size={24} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  💡 Conseil financier
                </h3>
                <p className="text-yellow-700 dark:text-yellow-200">
                  Vos dépenses dépassent vos revenus ce mois-ci. Pensez à réduire les dépenses non essentielles et à établir un budget strict.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Liens rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/transactions"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Voir toutes les transactions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Gérez vos transactions
                </p>
              </div>
              <ArrowRight className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/reports"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Rapports détaillés
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Analyses approfondies
                </p>
              </div>
              <ArrowRight className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/goals"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Objectifs d'épargne
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Suivez vos objectifs
                </p>
              </div>
              <ArrowRight className="text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
