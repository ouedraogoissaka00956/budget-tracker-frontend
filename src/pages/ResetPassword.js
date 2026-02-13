import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import authService from '../services/authService';
import { Key, Check } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(token, formData.password);
      setSuccessMessage(response.message);
      
      // Rediriger vers login après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Carte principale */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <Key size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Nouveau mot de passe
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-6">
              <Alert type="success" message={successMessage} />
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Redirection vers la page de connexion...
              </p>
            </div>
          )}
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Formulaire */}
          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nouveau mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Key}
                required
              />

              <Input
                label="Confirmer le mot de passe"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Key}
                required
              />

              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    {formData.password.length >= 6 ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                    )}
                    <span className={formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                      Au moins 6 caractères
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    {formData.password === formData.confirmPassword && formData.confirmPassword ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                    )}
                    <span className={formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : 'text-gray-500'}>
                      Les mots de passe correspondent
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                icon={Check}
                className="w-full"
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          )}

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-white/80">
          Budget Tracker © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;