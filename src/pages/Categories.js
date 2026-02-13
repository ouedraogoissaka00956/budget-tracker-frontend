import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryForm from '../components/categories/CategoryForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useCategories } from '../context/CategoryContext';
import { Plus, FolderOpen, TrendingUp, TrendingDown } from 'lucide-react';

const Categories = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (data) => {
    try {
      await createCategory(data);
      setIsModalOpen(false);
      setSuccessMessage('Catégorie créée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      await updateCategory(editingCategory._id, data);
      setIsModalOpen(false);
      setEditingCategory(null);
      setSuccessMessage('Catégorie mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id);
        setSuccessMessage('Catégorie supprimée avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter((cat) => {
    if (filter === 'income') return cat.type === 'income';
    if (filter === 'expense') return cat.type === 'expense';
    return true;
  });

  const expenseCategories = categories.filter(c => c.type === 'expense').length;
  const incomeCategories = categories.filter(c => c.type === 'income').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FolderOpen size={32} className="text-primary-600" />
              <span>Mes Catégories</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organisez vos transactions par catégories personnalisées
            </p>
          </div>
          <Button onClick={openCreateModal} variant="primary" size="lg" icon={Plus}>
            Nouvelle catégorie
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
                  {categories.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <FolderOpen size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dépenses</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {expenseCategories}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-3">
                <TrendingDown size={32} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenus</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {incomeCategories}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <TrendingUp size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

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
            Toutes ({categories.length})
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Dépenses ({expenseCategories})
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Revenus ({incomeCategories})
          </button>
        </div>

        {/* Liste des catégories */}
        {loading ? (
          <Loader />
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucune catégorie trouvée
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Créez votre première catégorie pour organiser vos transactions
            </p>
            <Button onClick={openCreateModal} variant="primary" icon={Plus}>
              Créer une catégorie
            </Button>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        >
          <CategoryForm
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            initialData={editingCategory}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingCategory(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Categories;