import React, { useState, useRef } from 'react';
import Layout from '../components/common/Layout';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { User, Mail, DollarSign, Globe, Save, Key, Camera, Trash2, Upload } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, uploadProfilePicture, deleteProfilePicture } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    monthlyBudget: user?.monthlyBudget || '',
    currency: user?.currency || 'XOF',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccessMessage('Mot de passe mis à jour avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Seuls les fichiers JPEG et PNG sont autorisés');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Le fichier ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      await uploadProfilePicture(file, (progress) => {
        setUploadProgress(progress);
      });
      setSuccessMessage('Photo de profil mise à jour !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return;
    }

    setError('');
    try {
      await deleteProfilePicture();
      setSuccessMessage('Photo de profil supprimée !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const currencyOptions = [
    { value: 'XOF', label: 'XOF - Franc CFA' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'USD', label: 'USD - Dollar américain' },
    { value: 'GBP', label: 'GBP - Livre sterling' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <User size={32} className="text-primary-600" />
            <span>Mon Profil</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte utilisateur avec photo */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
              <div className="flex flex-col items-center">
                {/* Photo de profil */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={64} className="text-white/60" />
                      </div>
                    )}
                  </div>
                  
                  {/* Boutons photo */}
                  <div className="absolute bottom-0 right-0 flex space-x-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-2 bg-white text-primary-600 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                      title="Changer la photo"
                    >
                      <Camera size={20} />
                    </button>
                    {user?.profilePicture && (
                      <button
                        onClick={handleDeletePhoto}
                        disabled={uploading}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Supprimer la photo"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Barre de progression upload */}
                {uploading && (
                  <div className="w-full mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Upload en cours...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-1">{user?.username}</h2>
                <p className="text-primary-100 mb-4">{user?.email}</p>
                
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
                  <p className="text-sm opacity-75 mb-1">Budget mensuel</p>
                  <p className="text-2xl font-bold">
                    {user?.monthlyBudget?.toLocaleString() || 0} {user?.currency || 'XOF'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Statistiques du compte
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Membre depuis</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(user?.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Dernière connexion</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Aujourd'hui
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaires */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <User size={20} />
                <span>Informations personnelles</span>
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
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  required
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
                  label="Devise"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={currencyOptions}
                  icon={Globe}
                />

                <div className="pt-4">
                  <Button type="submit" variant="primary" disabled={loading} icon={Save} className="w-full">
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Changer le mot de passe */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Key size={20} />
                <span>Changer le mot de passe</span>
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />

                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />

                <Input
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />

                <div className="pt-4">
                  <Button type="submit" variant="primary" disabled={loading} icon={Key} className="w-full">
                    {loading ? 'Modification...' : 'Changer le mot de passe'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;