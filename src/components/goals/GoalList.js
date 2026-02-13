import React from 'react';
import Button from '../common/Button';
import { Edit, Trash2, Plus, Target, CheckCircle, Clock } from 'lucide-react';

const GoalList = ({ goals, onEdit, onDelete, onAddAmount }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
        <Target size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Aucun objectif trouvé</p>
      </div>
    );
  }

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
        const isCompleted = goal.completed || progress >= 100;
        const daysLeft = goal.deadline
          ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
          : null;

        return (
          <div
            key={goal._id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${
              isCompleted ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-primary-100 dark:bg-primary-900/30'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <Target size={24} className="text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {goal.name}
                  </h3>
                  {isCompleted && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                      Complété
                    </span>
                  )}
                </div>
              </div>
            </div>

            {goal.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {goal.description}
              </p>
            )}

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progression</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-primary-600'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Actuel</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {goal.currentAmount.toLocaleString()} F CFA
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Objectif</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {goal.targetAmount.toLocaleString()} F CFA
                </span>
              </div>
              {daysLeft !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Échéance
                  </span>
                  <span
                    className={`font-semibold ${
                      daysLeft < 0
                        ? 'text-red-600 dark:text-red-400'
                        : daysLeft < 7
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)} jours de retard`
                      : `${daysLeft} jours restants`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              {!isCompleted && (
                <Button
                  onClick={() => onAddAmount(goal)}
                  variant="primary"
                  size="sm"
                  icon={Plus}
                >
                  Ajouter un montant
                </Button>
              )}
              <div className="flex space-x-2">
                <Button
                  onClick={() => onEdit(goal)}
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  className="flex-1"
                >
                  Modifier
                </Button>
                <Button
                  onClick={() => onDelete(goal._id)}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  className="flex-1"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;