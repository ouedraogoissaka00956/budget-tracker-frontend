import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { useGoals } from '../context/GoalContext';
import notificationService from '../services/notificationService';

export const useNotificationTriggers = () => {
  const { user } = useAuth();
  const { statistics } = useTransactions();
  const { goals } = useGoals();
  const lastCheckRef = useRef(null);

  useEffect(() => {
    // Éviter les vérifications trop fréquentes
    const now = Date.now();
    if (lastCheckRef.current && (now - lastCheckRef.current) < 60000) {
      // Si moins d'1 minute depuis la dernière vérification, skip
      return;
    }

    const checkNotifications = async () => {
      if (!user || !statistics) return;

      try {
        // Vérifier les alertes budget (90% et 100%)
        const monthlyBudget = user.monthlyBudget || 0;
        const currentExpense = statistics.totalExpense || 0;

        if (monthlyBudget > 0) {
          const percentage = (currentExpense / monthlyBudget) * 100;

          // Alerte à 90%
          if (percentage >= 90 && percentage < 100) {
            await notificationService.create({
              type: 'budget_warning',
              title: 'Alerte budget - 90%',
              message: `Vous avez utilisé ${percentage.toFixed(1)}% de votre budget mensuel`,
              priority: 'medium',
              actionUrl: '/dashboard'
            });
          }

          // Budget dépassé
          if (percentage >= 100) {
            await notificationService.create({
              type: 'budget_exceeded',
              title: 'Budget dépassé !',
              message: `Vous avez dépassé votre budget mensuel de ${(currentExpense - monthlyBudget).toLocaleString()} XOF`,
              priority: 'high',
              actionUrl: '/dashboard'
            });
          }
        }

        // Vérifier les objectifs
        if (goals && goals.length > 0) {
          goals.forEach(async (goal) => {
            if (!goal.completed && goal.deadline) {
              const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

              // Alerte 7 jours avant
              if (daysLeft === 7) {
                await notificationService.create({
                  type: 'goal_deadline',
                  title: `Échéance proche - ${goal.name}`,
                  message: `Il ne reste que 7 jours pour atteindre votre objectif`,
                  priority: 'medium',
                  relatedType: 'goal',
                  relatedId: goal._id,
                  actionUrl: '/goals'
                });
              }

              // Échéance dépassée
              if (daysLeft < 0) {
                await notificationService.create({
                  type: 'goal_deadline',
                  title: `Échéance dépassée - ${goal.name}`,
                  message: `L'échéance est dépassée de ${Math.abs(daysLeft)} jours`,
                  priority: 'high',
                  relatedType: 'goal',
                  relatedId: goal._id,
                  actionUrl: '/goals'
                });
              }
            }

            // Objectif atteint
            if (goal.completed) {
              await notificationService.create({
                type: 'goal_achieved',
                title: `Objectif atteint !  `,
                message: `Félicitations ! Vous avez atteint "${goal.name}"`,
                priority: 'low',
                relatedType: 'goal',
                relatedId: goal._id,
                actionUrl: '/goals'
              });
            }
          });
        }

        lastCheckRef.current = now;
      } catch (error) {
        console.error('Erreur vérification notifications:', error);
      }
    };

    checkNotifications();
  }, [user, statistics, goals]);
};