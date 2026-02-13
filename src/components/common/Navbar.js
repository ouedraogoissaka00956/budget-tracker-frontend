import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import {
  LayoutDashboard,
  Receipt,
  Repeat,
  Building2,
  FolderOpen,
  Target,
  FileText,
  User,
  LogOut,
  Wallet,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/recurring-transactions', icon: Repeat, label: 'Récurrences' },
    { path: '/accounts', icon: Building2, label: 'Comptes' },
    { path: '/categories', icon: FolderOpen, label: 'Catégories' },
    { path: '/goals', icon: Target, label: 'Objectifs' },
    { path: '/reports', icon: FileText, label: 'Rapports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
          >
            <Wallet size={28} className="text-primary-600" />
            <span className="hidden sm:inline">Suivi budgétaire</span>
          </Link>

          {/* Navigation principale */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <ThemeToggle />

            {/* Photo et nom utilisateur */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-2 border-primary-500">
                  <User size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username}
              </span>
            </Link>

            {/* Bouton déconnexion */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;