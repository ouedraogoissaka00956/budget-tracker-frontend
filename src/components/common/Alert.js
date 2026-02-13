import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-300',
      IconComponent: CheckCircle,
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-300',
      IconComponent: AlertTriangle,
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-300',
      IconComponent: AlertTriangle,
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-300',
      IconComponent: Info,
    },
  };

  const currentStyle = styles[type] || styles.info;
  const IconComponent = currentStyle.IconComponent;

  return (
    <div className={`border rounded-lg p-4 ${currentStyle.container} flex items-start space-x-3`}>
      <IconComponent size={20} className={`flex-shrink-0 mt-0.5 ${currentStyle.icon}`} />
      {/* CHANGÉ: Utiliser div au lieu de p pour permettre du contenu complexe */}
      <div className={`flex-1 text-sm font-medium ${currentStyle.text}`}>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${currentStyle.icon} hover:opacity-70 transition-opacity`}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;