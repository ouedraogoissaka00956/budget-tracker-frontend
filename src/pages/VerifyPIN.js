import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import authService from '../services/authService';
import { Key, ArrowLeft, Check } from 'lucide-react';

const VerifyPIN = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes en secondes

  useEffect(() => {
    // Récupérer l'email depuis la navigation
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Si pas d'email, rediriger vers forgot-password
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Compte à rebours
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await authService.verifyPIN(email, pin);
      setSuccessMessage('Code PIN vérifié avec succès !');
      
      // Rediriger vers la page de reset password
      setTimeout(() => {
        navigate('/reset-password-pin', { state: { email, pin } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Code PIN invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  const handleResendPIN = async () => {
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccessMessage('Un nouveau code PIN a été envoyé à votre email');
      setTimeLeft(900); // Réinitialiser le timer
      setTimeout(() => setSuccessMessage(''), 3000);
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
              <Key size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Vérification du code PIN
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Entrez le code à 6 chiffres envoyé à
            </p>
            <p className="text-primary-600 dark:text-primary-400 font-semibold mt-1">
              {email}
            </p>
          </div>

          {/* Timer */}
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeLeft < 60 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              <span className="text-sm font-semibold">Temps restant:</span>
              <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-4">
              <Alert type="success" message={successMessage} />
            </div>
          )}
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Code PIN"
                type="text"
                name="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                icon={Key}
                required
                maxLength="6"
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Code à 6 chiffres
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || pin.length !== 6}
              icon={Check}
              className="w-full"
            >
              {loading ? 'Vérification...' : 'Vérifier le code'}
            </Button>

            {/* Renvoyer le code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendPIN}
                disabled={loading || timeLeft > 0}
                className={`text-sm ${
                  timeLeft > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
                } font-medium`}
              >
                {timeLeft > 0 ? 'Renvoyer le code (après expiration)' : 'Renvoyer le code'}
              </button>
            </div>
          </form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              <ArrowLeft size={16} />
              <span>Changer l'email</span>
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

export default VerifyPIN;