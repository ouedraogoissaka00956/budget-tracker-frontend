import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import ReceiptUpload from '../common/ReceiptUpload';
import Alert from '../common/Alert';
import { useCategories } from '../../context/CategoryContext';

const TransactionForm = ({ onSubmit, initialData, onCancel }) => {
  const { categories, fetchCategories } = useCategories();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receiptUrl: '',
    receiptPublicId: '',
  });
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description || '',
        date: new Date(initialData.date).toISOString().split('T')[0],
        receiptUrl: initialData.receiptUrl || '',
        receiptPublicId: initialData.receiptPublicId || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUploadSuccess = (result) => {
    setFormData({
      ...formData,
      receiptUrl: result.url,
      receiptPublicId: result.publicId,
    });
    setUploadError('');
  };

  const handleUploadError = (error) => {
    setUploadError(error);
  };

  const handleRemoveReceipt = () => {
    setFormData({
      ...formData,
      receiptUrl: '',
      receiptPublicId: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const typeOptions = [
    { value: 'expense', label: 'Dépense' },
    { value: 'income', label: 'Revenu' },
  ];

  const filteredCategories = categories
    .filter((cat) => cat.type === formData.type)
    .map((cat) => ({ value: cat.name, label: `${cat.icon} ${cat.name}` }));

  const categoryOptions = [
    { value: '', label: 'Sélectionner une catégorie' },
    ...filteredCategories,
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {uploadError && (
        <Alert type="error" message={uploadError} onClose={() => setUploadError('')} />
      )}

      <Select
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={typeOptions}
        required
      />

      <Input
        label="Montant"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="5000"
        required
        min="0"
        step="0.01"
      />

      <Select
        label="Catégorie"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categoryOptions}
        required
      />

      <Input
        label="Description"
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Notes supplémentaires..."
      />

      <Input
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      {/* Upload de reçu */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Reçu / Justificatif (optionnel)
        </label>
        <ReceiptUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          currentReceipt={
            formData.receiptUrl
              ? { url: formData.receiptUrl, publicId: formData.receiptPublicId }
              : null
          }
          onRemove={handleRemoveReceipt}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;