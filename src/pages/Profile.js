import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { User, Mail, DollarSign, Globe, Camera, Trash2, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, uploadProfilePicture, deleteProfilePicture } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    monthlyBudget: '',
    currency: 'XOF',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        monthlyBudget: user.monthlyBudget || '',
        currency: user.currency || 'XOF',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile(formData);
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await updateProfile(passwordData);
      setSuccessMessage('Mot de passe mis à jour avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await uploadProfilePicture(file);
      setSuccessMessage('Photo de profil mise à jour !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Supprimer la photo de profil ?')) return;

    try {
      await deleteProfilePicture();
      setSuccessMessage('Photo supprimée');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const currencyOptions = [
    { value: 'XOF', label: 'XOF - Franc CFA' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'USD', label: 'USD - Dollar' },
    { value: 'GBP', label: 'GBP - Livre Sterling' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <User size={32} className="text-primary-600" />
            <span>Mon profil</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center border-4 border-primary-500">
                    <User size={64} className="text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
                >
                  <Camera size={20} />
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>

              {user?.profilePicture && (
                <Button
                  onClick={handleDeletePhoto}
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  className="mt-4"
                >
                  Supprimer la photo
                </Button>
              )}

              <div className="mt-6 w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget mensuel</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.monthlyBudget?.toLocaleString() || 0} {user?.currency}
                </p>
              </div>

              <div className="mt-4 w-full space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Membre depuis</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Dernière connexion</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Informations
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom d'utilisateur"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  icon={User}
                  required
                />

                <Input
                  label="E-mail"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
                  disabled
                />

                <Input
                  label="Budget mensuel"
                  type="number"
                  name="monthlyBudget"
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  icon={DollarSign}
                  min="0"
                  step="0.01"
                />

                <Select
                  label="Concevoir"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={currencyOptions}
                  icon={Globe}
                />

                <Button type="submit" variant="primary" icon={Save} className="w-full">
                  Enregistrer les modifications
                </Button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Changer le mot de passe
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />

                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />

                <Button type="submit" variant="primary" icon={Save} className="w-full">
                  Mettre à jour le mot de passe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
