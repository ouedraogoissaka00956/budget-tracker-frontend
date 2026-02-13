import React, { useState, useRef } from 'react';
import Button from './Button';
import uploadService from '../../services/uploadService';

const ReceiptUpload = ({ onUploadSuccess, onUploadError, currentReceipt, onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentReceipt || null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      onUploadError && onUploadError('Seuls les fichiers JPEG, PNG et PDF sont autorisés');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      onUploadError && onUploadError('Le fichier ne doit pas dépasser 5MB');
      return;
    }

    // Créer un aperçu pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('pdf');
    }

    // Upload du fichier
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadService.uploadReceipt(file, (percent) => {
        setProgress(percent);
      });

      onUploadSuccess && onUploadSuccess(result);
      setUploading(false);
    } catch (error) {
      console.error('Erreur upload:', error);
      onUploadError && onUploadError(error.response?.data?.message || 'Erreur lors de l\'upload');
      setUploading(false);
      setPreview(null);
    }
  };

  const handleRemove = async () => {
    if (currentReceipt && currentReceipt.publicId) {
      try {
        await uploadService.deleteReceipt(currentReceipt.publicId);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
    setPreview(null);
    onRemove && onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      {!preview && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-6xl">📎</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Glissez-déposez un fichier ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Formats acceptés: JPEG, PNG, PDF (max 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              disabled={uploading}
            >
              {uploading ? 'Upload en cours...' : 'Choisir un fichier'}
            </Button>
          </div>
        </div>
      )}

      {/* Barre de progression */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Upload en cours...</span>
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Aperçu */}
      {preview && !uploading && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            {/* Image preview */}
            {preview !== 'pdf' && (
              <img
                src={preview}
                alt="Aperçu du reçu"
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            
            {/* PDF preview */}
            {preview === 'pdf' && (
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-5xl">📄</span>
              </div>
            )}

            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Reçu joint
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {preview === 'pdf' ? 'Fichier PDF' : 'Image'}
              </p>
              
              {currentReceipt?.url && (
                <a
                  href={currentReceipt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center mb-3"
                >
                  <span className="mr-1">👁️</span>
                  Voir en plein écran
                </a>
              )}

              <div>
                <Button
                  onClick={handleRemove}
                  variant="danger"
                  size="sm"
                >
                  🗑️ Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;