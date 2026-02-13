import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import AccountCard from '../components/accounts/AccountCard';
import AccountForm from '../components/accounts/AccountForm';
import TransferForm from '../components/accounts/TransferForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useAccounts } from '../context/AccountContext';
import { formatCurrency } from '../utils/helpers';
import { Plus, ArrowLeftRight, Building2, CheckCircle, XCircle, Wallet, Star } from 'lucide-react';

const Accounts = () => {
  const {
    accounts,
    totalBalance,
    loading,
    error,
    fetchAccounts,
    fetchTotalBalance,
    createAccount,
    updateAccount,
    deleteAccount,
    transferBetweenAccounts,
  } = useAccounts();

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAccounts();
    fetchTotalBalance();
  }, [fetchAccounts, fetchTotalBalance]);

  const handleCreateAccount = async (data) => {
    try {
      await createAccount(data);
      setIsAccountModalOpen(false);
      setSuccessMessage('Compte créé avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleUpdateAccount = async (data) => {
    try {
      await updateAccount(editingAccount._id, data);
      setIsAccountModalOpen(false);
      setEditingAccount(null);
      setSuccessMessage('Compte mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      try {
        await deleteAccount(id);
        setSuccessMessage('Compte supprimé avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTransfer = async (data) => {
    try {
      await transferBetweenAccounts(
        data.fromAccountId,
        data.toAccountId,
        parseFloat(data.amount),
        data.description
      );
      setIsTransferModalOpen(false);
      setSuccessMessage('Transfert effectué avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const filteredAccounts = accounts.filter((a) => {
    if (filter === 'active') return a.active;
    if (filter === 'inactive') return !a.active;
    return true;
  });

  const activeCount = accounts.filter(a => a.active).length;
  const inactiveCount = accounts.filter(a => !a.active).length;
  const defaultAccount = accounts.find(a => a.isDefault);

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Building2 size={32} className="text-primary-600" />
              <span>Mes Comptes</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez tous vos comptes bancaires en un seul endroit
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setIsTransferModalOpen(true)} variant="outline" icon={ArrowLeftRight}>
              Transférer
            </Button>
            <Button onClick={openCreateModal} variant="primary" size="lg" icon={Plus}>
              Nouveau compte
            </Button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Solde total</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                <p className="text-sm opacity-75 mt-2">{accounts.length} compte(s)</p>
              </div>
              <Wallet size={48} className="opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total comptes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {accounts.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Building2 size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactifs</p>
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

        {/* Compte par défaut mis en avant */}
        {defaultAccount && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-400 dark:bg-yellow-600 rounded-full p-3">
                  <Star size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Compte par défaut
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <span className="text-2xl">{defaultAccount.icon}</span>
                    <span>{defaultAccount.name}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Solde</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(defaultAccount.balance, defaultAccount.currency)}
                </p>
              </div>
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
            Tous ({accounts.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Actifs ({activeCount})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Inactifs ({inactiveCount})
          </button>
        </div>

        {/* Liste des comptes */}
        {loading ? (
          <Loader />
        ) : filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account._id}
                account={account}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun compte trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all'
                ? 'Créez votre premier compte bancaire'
                : filter === 'active'
                ? 'Aucun compte actif'
                : 'Aucun compte inactif'}
            </p>
            {filter === 'all' && (
              <Button onClick={openCreateModal} variant="primary" icon={Plus}>
                Créer un compte
              </Button>
            )}
          </div>
        )}

        {/* Modal création/édition compte */}
        <Modal
          isOpen={isAccountModalOpen}
          onClose={() => {
            setIsAccountModalOpen(false);
            setEditingAccount(null);
          }}
          title={editingAccount ? 'Modifier le compte' : 'Nouveau compte'}
          size="lg"
        >
          <AccountForm
            onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}
            initialData={editingAccount}
            onCancel={() => {
              setIsAccountModalOpen(false);
              setEditingAccount(null);
            }}
          />
        </Modal>

        {/* Modal transfert */}
        <Modal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          title="Transférer entre comptes"
          size="md"
        >
          <TransferForm
            accounts={accounts}
            onSubmit={handleTransfer}
            onCancel={() => setIsTransferModalOpen(false)}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Accounts;