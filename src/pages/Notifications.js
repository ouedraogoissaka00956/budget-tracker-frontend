import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  BellOff, 
  CheckCheck, 
  Trash2, 
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
 // TrendingUp,
  DollarSign,
  // Target,
  BarChart3,
  Info
} from 'lucide-react';

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  } = useNotifications();

  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (filter === 'all') {
      fetchNotifications();
    } else if (filter === 'unread') {
      fetchNotifications(false);
    } else {
      fetchNotifications(true);
    }
  }, [filter, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setSuccessMessage('Toutes les notifications ont été marquées comme lues');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAllRead = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications lues ?')) {
      try {
        await deleteAllRead();
        setSuccessMessage('Toutes les notifications lues ont été supprimées');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      try {
        await deleteNotification(id);
        setSuccessMessage('Notification supprimée');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { size: 24 };
    switch (type) {
      case 'budget_warning':
      case 'budget_exceeded':
        return <AlertTriangle {...iconProps} className="text-orange-600 dark:text-orange-400" />;
      case 'goal_achieved':
        return <CheckCircle {...iconProps} className="text-green-600 dark:text-green-400" />;
      case 'goal_deadline':
        return <Clock {...iconProps} className="text-blue-600 dark:text-blue-400" />;
      case 'category_limit':
        return <AlertTriangle {...iconProps} className="text-red-600 dark:text-red-400" />;
      case 'low_balance':
        return <DollarSign {...iconProps} className="text-yellow-600 dark:text-yellow-400" />;
      case 'monthly_summary':
        return <BarChart3 {...iconProps} className="text-purple-600 dark:text-purple-400" />;
      default:
        return <Info {...iconProps} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      budget_warning: 'Alerte Budget',
      budget_exceeded: 'Budget Dépassé',
      goal_achieved: 'Objectif Atteint',
      goal_deadline: 'Échéance Objectif',
      category_limit: 'Limite Catégorie',
      low_balance: 'Solde Faible',
      monthly_summary: 'Résumé Mensuel',
      info: 'Information'
    };
    return labels[type] || 'Notification';
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Bell size={32} className="text-primary-600" />
              <span>Notifications</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez vos alertes et notifications
            </p>
          </div>
          <div className="flex space-x-3">
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="primary" icon={CheckCheck}>
                Tout marquer comme lu
              </Button>
            )}
            <Button onClick={handleDeleteAllRead} variant="secondary" icon={Archive}>
              Supprimer les lues
            </Button>
          </div>
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
                  {notifications.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <Bell size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Non lues</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {unreadCount}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                <BellOff size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lues</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {notifications.length - unreadCount}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
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
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Liste des notifications */}
        {loading ? (
          <Loader />
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <BellOff size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'unread'
                ? 'Vous êtes à jour !'
                : filter === 'read'
                ? 'Aucune notification lue'
                : 'Vous n\'avez aucune notification'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 ${
                  notification.priority === 'high'
                    ? 'border-l-red-500'
                    : notification.priority === 'medium'
                    ? 'border-l-yellow-500'
                    : 'border-l-blue-500'
                } ${!notification.read ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icône */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {getTypeLabel(notification.type)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Marquer comme lu"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(notification._id, e)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Badge de priorité */}
                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          notification.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : notification.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        Priorité{' '}
                        {notification.priority === 'high'
                          ? 'Haute'
                          : notification.priority === 'medium'
                          ? 'Moyenne'
                          : 'Basse'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
