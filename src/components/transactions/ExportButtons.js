import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import exportService from '../../services/exportService';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { Download, FileText, Table } from 'lucide-react';

const ExportButtons = ({ transactions }) => {
  const { user } = useAuth();
  const { statistics } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportType, setExportType] = useState('csv');

  const handleExport = () => {
    const timestamp = new Date().getTime();
    
    if (exportType === 'csv') {
      exportService.exportToCSV(transactions, `transactions_${timestamp}.csv`);
    } else if (exportType === 'pdf-transactions') {
      exportService.exportToPDF(transactions, statistics, user, `rapport_${timestamp}.pdf`);
    } else if (exportType === 'pdf-stats') {
      exportService.exportStatsToPDF(statistics, 'Toutes périodes', `statistiques_${timestamp}.pdf`);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        icon={Download}
      >
        Exporter
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Exporter les données"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Sélectionnez le format d'export souhaité
          </p>

          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="exportType"
                value="csv"
                checked={exportType === 'csv'}
                onChange={(e) => setExportType(e.target.value)}
                className="mr-3"
              />
              <Table size={24} className="mr-3 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">CSV - Feuille de calcul</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Format compatible Excel, Google Sheets
                </p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="exportType"
                value="pdf-transactions"
                checked={exportType === 'pdf-transactions'}
                onChange={(e) => setExportType(e.target.value)}
                className="mr-3"
              />
              <FileText size={24} className="mr-3 text-red-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">PDF - Rapport complet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rapport détaillé avec statistiques et transactions
                </p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="exportType"
                value="pdf-stats"
                checked={exportType === 'pdf-stats'}
                onChange={(e) => setExportType(e.target.value)}
                className="mr-3"
              />
              <FileText size={24} className="mr-3 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">PDF - Statistiques uniquement</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Résumé par catégorie
                </p>
              </div>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleExport} variant="primary" icon={Download} className="flex-1">
              Télécharger
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExportButtons;