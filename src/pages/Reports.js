import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { useTransactions } from '../context/TransactionContext';
import { FileText, Download, Calendar, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import {BarChart,Bar,PieChart as RechartsPie, Pie,Cell,XAxis,YAxis,CartesianGrid,Tooltip,Legend, ResponsiveContainer,} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const navigate = useNavigate();
  const { fetchStatistics } = useTransactions();

  const [reportType, setReportType] = useState('month');
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDateRange = (type, custom) => {
    const now = new Date();
    let startDate, endDate;

    switch (type) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      
      case 'custom':
        startDate = custom.startDate ? new Date(custom.startDate) : null;
        endDate = custom.endDate ? new Date(custom.endDate) : null;
        break;
      
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
  };

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(reportType, customDates);
      
      const filters = {};
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) filters.endDate = endDate.toISOString();

      const stats = await fetchStatistics(filters);
      setReportData(stats);
    } catch (err) {
      console.error('Erreur chargement rapport:', err);
      setError('Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  }, [reportType, customDates, fetchStatistics]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyCustomDates = () => {
    if (customDates.startDate && customDates.endDate) {
      setReportType('custom');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('Rapport Financier', 14, 20);
    
    // Période
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const periodLabel = reportType === 'month' ? 'Mensuel' : reportType === 'year' ? 'Annuel' : 'Personnalisé';
    doc.text(`Période : ${periodLabel}`, 14, 30);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 14, 36);
    
    // Statistiques principales
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Résumé', 14, 50);
    
    const summaryData = [
      ['Revenus totaux', `${reportData?.totalIncome?.toLocaleString() || 0} F CFA`],
      ['Dépenses totales', `${reportData?.totalExpense?.toLocaleString() || 0} F CFA`],
      ['Solde', `${reportData?.balance?.toLocaleString() || 0} F CFA`],
      ['Nombre de transactions', reportData?.transactionCount || 0]
    ];
    
    doc.autoTable({
      startY: 55,
      head: [['Indicateur', 'Valeur']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });
    
    // Dépenses par catégorie
    if (reportData?.byCategory && Object.keys(reportData.byCategory).length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Dépenses par Catégorie', 14, doc.lastAutoTable.finalY + 15);
      
      const categoryData = Object.entries(reportData.byCategory).map(([name, data]) => [
        name,
        `${data.expense?.toLocaleString() || 0} F CFA`,
        `${((data.expense / reportData.totalExpense) * 100).toFixed(1)}%`
      ]);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Catégorie', 'Montant', 'Pourcentage']],
        body: categoryData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} / ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    doc.save(`rapport-${periodLabel}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Préparer les données pour les graphiques
  const categoryData = reportData?.byCategory
    ? Object.entries(reportData.byCategory).map(([name, data]) => ({
        name,
        revenus: data.income || 0,
        dépenses: data.expense || 0,
      }))
    : [];

  const pieData = reportData?.byCategory
    ? Object.entries(reportData.byCategory)
        .filter(([_, data]) => data.expense > 0)
        .map(([name, data]) => ({
          name,
          value: data.expense,
        }))
    : [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  const getReportTitle = () => {
    switch (reportType) {
      case 'month':
        return 'Rapport Mensuel';
      case 'year':
        return 'Rapport Annuel';
      case 'custom':
        return 'Rapport Personnalisé';
      default:
        return 'Rapport';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText size={32} className="text-primary-600" />
              <span>{getReportTitle()}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analyse détaillée de vos finances
            </p>
          </div>
          <Button onClick={exportPDF} variant="primary" icon={Download} disabled={!reportData}>
            Exporter PDF
          </Button>
        </div>

        {/* Messages */}
        {error && <Alert type="error" message={error} />}

        {/* Sélecteur de période */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar size={20} className="mr-2" />
            Période du rapport
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setReportType('month')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                reportType === 'month'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Rapport Mensuel
            </button>
            <button
              onClick={() => setReportType('year')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                reportType === 'year'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Rapport Annuel
            </button>
            <button
              onClick={() => setReportType('custom')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                reportType === 'custom'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Période Personnalisée
            </button>
          </div>

          {/* Période personnalisée */}
          {reportType === 'custom' && (
            <div className="border-t dark:border-gray-600 pt-4">
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={applyCustomDates}
                    variant="primary"
                    disabled={!customDates.startDate || !customDates.endDate}
                  >
                    Générer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques principales */}
        {reportData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100">Revenus Totaux</span>
                  <TrendingUp size={24} />
                </div>
                <p className="text-3xl font-bold">{reportData.totalIncome?.toLocaleString() || 0} F CFA</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-100">Dépenses Totales</span>
                  <TrendingDown size={24} />
                </div>
                <p className="text-3xl font-bold">{reportData.totalExpense?.toLocaleString() || 0} F CFA</p>
              </div>

              <div className={`bg-gradient-to-br rounded-xl shadow-md p-6 text-white ${
                reportData.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100">Solde</span>
                  <PieChart size={24} />
                </div>
                <p className="text-3xl font-bold">{reportData.balance?.toLocaleString() || 0} F CFA</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-100">Transactions</span>
                  <FileText size={24} />
                </div>
                <p className="text-3xl font-bold">{reportData.transactionCount || 0}</p>
              </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique en barres */}
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
                      <Legend />
                      <Bar dataKey="revenus" fill="#10B981" name="Revenus" />
                      <Bar dataKey="dépenses" fill="#EF4444" name="Dépenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Graphique circulaire */}
              {pieData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Répartition des dépenses
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
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
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Tableau des catégories */}
            {categoryData.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Détail par Catégorie
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Revenus
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Dépenses
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          % Dépenses
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryData.map((cat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {cat.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                            {cat.revenus.toLocaleString()} F CFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">
                            {cat.dépenses.toLocaleString()} F CFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                            {reportData.totalExpense > 0
                              ? ((cat.dépenses / reportData.totalExpense) * 100).toFixed(1)
                              : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
