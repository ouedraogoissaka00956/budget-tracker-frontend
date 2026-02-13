import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import authService from '../services/authService';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccessMessage(response.message);
      
      // Rediriger vers la page de vérification du PIN après 2 secondes
      setTimeout(() => {
        navigate('/verify-pin', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
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
              <Mail size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Entrez votre email pour recevoir un code PIN de vérification
            </p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-4">
              <Alert type="success" message={successMessage} />
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Redirection vers la page de vérification...
              </p>
            </div>
          )}
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Adresse email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              icon={Mail}
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              icon={Send}
              className="w-full"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le code PIN'}
            </Button>
          </form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              <ArrowLeft size={16} />
              <span>Retour à la connexion</span>
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

export default ForgotPassword;