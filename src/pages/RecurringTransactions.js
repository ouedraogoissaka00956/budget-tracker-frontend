import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import RecurringTransactionCard from '../components/recurring/RecurringTransactionCard';
import RecurringTransactionForm from '../components/recurring/RecurringTransactionForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useRecurringTransactions } from '../context/RecurringTransactionContext';
import { Plus, Repeat, CheckCircle, XCircle, Clock } from 'lucide-react';

const RecurringTransactions = () => {
  const {
    recurringTransactions,
    loading,
    error,
    fetchRecurringTransactions,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    executeRecurringTransaction,
    toggleRecurringTransaction,
  } = useRecurringTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecurringTransactions();
  }, [fetchRecurringTransactions]);

  const handleCreate = async (data) => {
    try {
      await createRecurringTransaction(data);
      setIsModalOpen(false);
      setSuccessMessage('Transaction récurrente créée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (recurring) => {
    setEditingRecurring(recurring);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      await updateRecurringTransaction(editingRecurring._id, data);
      setIsModalOpen(false);
      setEditingRecurring(null);
      setSuccessMessage('Transaction récurrente mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction récurrente ?')) {
      try {
        await deleteRecurringTransaction(id);
        setSuccessMessage('Transaction récurrente supprimée avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleExecute = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir exécuter cette transaction maintenant ?')) {
      try {
        await executeRecurringTransaction(id);
        setSuccessMessage('Transaction créée avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleRecurringTransaction(id);
      setSuccessMessage('Statut modifié avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingRecurring(null);
    setIsModalOpen(true);
  };

  const filteredRecurring = recurringTransactions.filter((r) => {
    if (filter === 'active') return r.active;
    if (filter === 'inactive') return !r.active;
    return true;
  });

  const activeCount = recurringTransactions.filter(r => r.active).length;
  const inactiveCount = recurringTransactions.filter(r => !r.active).length;

  const upcomingRecurring = recurringTransactions
    .filter(r => r.active && r.nextExecution)
    .sort((a, b) => new Date(a.nextExecution) - new Date(b.nextExecution))
    .slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Repeat size={32} className="text-primary-600" />
              <span>Transactions Récurrentes</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Automatisez vos transactions régulières
            </p>
          </div>
          <Button onClick={openCreateModal} variant="primary" size="lg" icon={Plus}>
            Nouvelle récurrence
          </Button>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {recurringTransactions.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Repeat size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {activeCount}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactives</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {inactiveCount}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-full p-3">
                <XCircle size={32} className="text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Prochaines exécutions */}
        {upcomingRecurring.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Clock size={20} />
              <span>Prochaines exécutions</span>
            </h3>
            <div className="space-y-3">
              {upcomingRecurring.map((r) => {
                const daysUntil = Math.ceil(
                  (new Date(r.nextExecution) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div 
                    key={r._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{r.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {r.category} - {r.amount.toLocaleString()} XOF
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      daysUntil === 0
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : daysUntil <= 3
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {daysUntil === 0 ? 'Aujourd\'hui' : `Dans ${daysUntil}j`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex space-x-3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Toutes ({recurringTransactions.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Actives ({activeCount})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Inactives ({inactiveCount})
          </button>
        </div>

        {/* Liste */}
        {loading ? (
          <Loader />
        ) : filteredRecurring.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecurring.map((recurring) => (
              <RecurringTransactionCard
                key={recurring._id}
                recurring={recurring}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onExecute={handleExecute}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Repeat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucune transaction récurrente
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all'
                ? 'Créez votre première transaction récurrente'
                : filter === 'active'
                ? 'Aucune transaction active'
                : 'Aucune transaction inactive'}
            </p>
            {filter === 'all' && (
              <Button onClick={openCreateModal} variant="primary" icon={Plus}>
                Créer une récurrence
              </Button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRecurring(null);
          }}
          title={editingRecurring ? 'Modifier la transaction récurrente' : 'Nouvelle transaction récurrente'}
          size="lg"
        >
          <RecurringTransactionForm
            onSubmit={editingRecurring ? handleUpdate : handleCreate}
            initialData={editingRecurring}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingRecurring(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default RecurringTransactions;