import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // AJOUTER
import Layout from '../components/common/Layout';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import AdvancedSearch from '../components/transactions/AdvancedSearch';
import ExportButtons from '../components/transactions/ExportButtons';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useTransactions } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext'; // AJOUTER
import { searchTransactions } from '../utils/searchUtils';
import { Plus, BarChart3 } from 'lucide-react';

const Transactions = () => {
  const navigate = useNavigate(); // AJOUTER
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { accounts, fetchAccounts } = useAccounts(); // AJOUTER

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [searchFilters, setSearchFilters] = useState({});
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
    fetchAccounts(); // AJOUTER
  }, [fetchTransactions, fetchAccounts]);

  useEffect(() => {
    const filtered = searchTransactions(transactions, searchFilters);
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchFilters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleResetSearch = () => {
    setSearchFilters({});
  };

  const handleCreate = async (data) => {
    try {
      await createTransaction(data);
      setIsModalOpen(false);
      setSuccessMessage('Transaction ajoutée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      await updateTransaction(editingTransaction._id, data);
      setIsModalOpen(false);
      setEditingTransaction(null);
      setSuccessMessage('Transaction mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await deleteTransaction(id);
        setSuccessMessage('Transaction supprimée avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openCreateModal = () => {
    // Vérifier si l'utilisateur a au moins un compte
    if (!accounts || accounts.length === 0) {
      if (window.confirm('Vous devez d\'abord créer un compte bancaire. Voulez-vous en créer un maintenant ?')) {
        navigate('/accounts');
      }
      return;
    }
    
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <BarChart3 size={32} className="text-primary-600" />
              <span>Mes Transactions</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez toutes vos transactions en un seul endroit
            </p>
          </div>
          <div className="flex space-x-3">
            <ExportButtons transactions={filteredTransactions} />
            <Button onClick={openCreateModal} variant="primary" size="lg" icon={Plus}>
              Nouvelle transaction
            </Button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Alerte si aucun compte */}
        {accounts && accounts.length === 0 && (
          <Alert 
            type="warning"
            message={
              <div>
                <strong>Aucun compte bancaire trouvé.</strong>
                <p className="mt-2 text-sm">
                  Vous devez d'abord créer un compte bancaire pour pouvoir enregistrer des transactions.
                </p>
                <Button 
                  onClick={() => navigate('/accounts')} 
                  variant="primary" 
                  className="mt-3"
                  icon={Plus}
                  size="sm"
                >
                  Créer mon premier compte
                </Button>
              </div>
            }
          />
        )}

        {/* Recherche avancée */}
        <AdvancedSearch onSearch={handleSearch} onReset={handleResetSearch} />

        {/* Statistiques de recherche */}
        {filteredTransactions.length !== transactions.length && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <strong>{filteredTransactions.length}</strong> transaction(s) trouvée(s) sur{' '}
              <strong>{transactions.length}</strong> au total
            </p>
          </div>
        )}

        {/* Liste des transactions */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <TransactionList
              transactions={currentTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTransactions.length}
            />
          </>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          title={editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
        >
          <TransactionForm
            onSubmit={editingTransaction ? handleUpdate : handleCreate}
            initialData={editingTransaction}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingTransaction(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Transactions;