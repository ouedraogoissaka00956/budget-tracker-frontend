import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import MonthlyReportCard from '../components/reports/MonthlyReportCard';
import YearlyReportCard from '../components/reports/YearlyReportCard';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import reportService from '../services/reportService';
import exportService from '../services/exportService';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('monthly'); // monthly, yearly
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [yearlyReport, setYearlyReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sélecteurs de période
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  // Générer les options d'années (5 dernières années)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentDate.getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  const monthOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  useEffect(() => {
    loadReport();
  }, [reportType, selectedYear, selectedMonth]);

  const loadReport = async () => {
    setLoading(true);
    setError('');
    try {
      if (reportType === 'monthly') {
        const data = await reportService.getMonthlyReport(selectedYear, selectedMonth);
        setMonthlyReport(data);
      } else {
        const data = await reportService.getYearlyReport(selectedYear);
        setYearlyReport(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
  if (reportType === 'monthly' && monthlyReport) {
    const monthName = monthOptions.find(m => m.value === selectedMonth)?.label;
    
    exportService.exportMonthlyReportToPDF(
      monthlyReport,
      `${monthName} ${selectedYear}`,
      `rapport_mensuel_${selectedYear}_${selectedMonth}.pdf`
    );
    
    setSuccessMessage('Rapport exporté en PDF avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  } else if (reportType === 'yearly' && yearlyReport) {
    // Pour le rapport annuel, on peut créer une fonction similaire si nécessaire
    alert('Export PDF annuel à venir');
  } else {
    setError('Aucune donnée à exporter');
  }
};

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Rapports financiers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analysez vos finances en détail
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleExportPDF} variant="outline">
              📥 Exporter PDF
            </Button>
            <Button onClick={loadReport} variant="primary">
                Actualiser
            </Button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Sélecteurs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type de rapport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de rapport
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setReportType('monthly')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    reportType === 'monthly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                    Mensuel
                </button>
                <button
                  onClick={() => setReportType('yearly')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    reportType === 'yearly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                    Annuel
                </button>
              </div>
            </div>

            {/* Année */}
            <Select
              label="Année"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              options={yearOptions}
            />

            {/* Mois (seulement pour rapport mensuel) */}
            {reportType === 'monthly' && (
              <Select
                label="Mois"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                options={monthOptions}
              />
            )}

            {/* Bouton de navigation rapide */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Navigation rapide
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (reportType === 'monthly') {
                      if (selectedMonth === 1) {
                        setSelectedMonth(12);
                        setSelectedYear(selectedYear - 1);
                      } else {
                        setSelectedMonth(selectedMonth - 1);
                      }
                    } else {
                      setSelectedYear(selectedYear - 1);
                    }
                  }}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Période précédente"
                >
                  ◀
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    setSelectedYear(now.getFullYear());
                    if (reportType === 'monthly') {
                      setSelectedMonth(now.getMonth() + 1);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  title="Période actuelle"
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => {
                    if (reportType === 'monthly') {
                      if (selectedMonth === 12) {
                        setSelectedMonth(1);
                        setSelectedYear(selectedYear + 1);
                      } else {
                        setSelectedMonth(selectedMonth + 1);
                      }
                    } else {
                      setSelectedYear(selectedYear + 1);
                    }
                  }}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Période suivante"
                  disabled={
                    (reportType === 'yearly' && selectedYear >= currentDate.getFullYear()) ||
                    (reportType === 'monthly' && 
                     selectedYear === currentDate.getFullYear() && 
                     selectedMonth >= currentDate.getMonth() + 1)
                  }
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du rapport */}
        {loading ? (
          <Loader />
        ) : reportType === 'monthly' ? (
          monthlyReport ? (
            <MonthlyReportCard report={monthlyReport} />
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <span className="text-6xl mb-4 block"> </span>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Aucune donnée disponible
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Aucune transaction pour cette période
              </p>
            </div>
          )
        ) : (
          yearlyReport ? (
            <YearlyReportCard report={yearlyReport} />
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <span className="text-6xl mb-4 block"> </span>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Aucune donnée disponible
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Aucune transaction pour cette année
              </p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default Reports;