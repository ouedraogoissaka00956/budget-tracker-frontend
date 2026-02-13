import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useGoals } from '../context/GoalContext';
import { formatCurrency } from '../utils/helpers';
import { Plus, Target, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const Goals = () => {
  const {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addAmountToGoal,
  } = useGoals();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async (data) => {
    try {
      await createGoal(data);
      setIsModalOpen(false);
      setSuccessMessage('Objectif créé avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      await updateGoal(editingGoal._id, data);
      setIsModalOpen(false);
      setEditingGoal(null);
      setSuccessMessage('Objectif mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await deleteGoal(id);
        setSuccessMessage('Objectif supprimé avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddAmount = async (id, amount) => {
    try {
      await addAmountToGoal(id, amount);
      setSuccessMessage('Montant ajouté avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.filter(g => !g.completed).length;
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Target size={32} className="text-primary-600" />
              <span>Objectifs d'épargne</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Définissez et suivez vos objectifs financiers
            </p>
          </div>
          <Button onClick={openCreateModal} variant="primary" size="lg" icon={Plus}>
            Nouvel objectif
          </Button>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total objectifs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalGoals}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Target size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeGoals}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Clock size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complétés</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedGoals}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progression</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {overallProgress.toFixed(0)}%
                </p>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-3">
                <TrendingUp size={32} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Progression globale
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            ></div>
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
            Tous ({totalGoals})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Actifs ({activeGoals})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Complétés ({completedGoals})
          </button>
        </div>

        {/* Liste des objectifs */}
        {loading ? (
          <Loader />
        ) : filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddAmount={handleAddAmount}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Target size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun objectif trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' 
                ? "Créez votre premier objectif d'épargne"
                : filter === 'active'
                ? "Aucun objectif actif"
                : "Aucun objectif complété"}
            </p>
            {filter === 'all' && (
              <Button onClick={openCreateModal} variant="primary" icon={Plus}>
                Créer un objectif
              </Button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
          title={editingGoal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
          size="lg"
        >
          <GoalForm
            onSubmit={editingGoal ? handleUpdate : handleCreate}
            initialData={editingGoal}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingGoal(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Goals;