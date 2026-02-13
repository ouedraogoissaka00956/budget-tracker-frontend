// Fonction de recherche dans les transactions (SAFE)
export const searchTransactions = (transactions = [], filters = {}) => {
  // Sécurité absolue
  if (!Array.isArray(transactions)) {
    return [];
  }

  let filtered = [...transactions];

  // Recherche par mot-clé
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description?.toLowerCase().includes(keyword) ||
        t.category?.toLowerCase().includes(keyword)
    );
  }

  // Filtrer par type
  if (filters.type) {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  // Filtrer par catégorie
  if (filters.category) {
    const category = filters.category.toLowerCase();
    filtered = filtered.filter(
      (t) => t.category?.toLowerCase().includes(category)
    );
  }

  // Filtrer par montant minimum
  if (filters.minAmount) {
    filtered = filtered.filter(
      (t) => t.amount >= Number(filters.minAmount)
    );
  }

  // Filtrer par montant maximum
  if (filters.maxAmount) {
    filtered = filtered.filter(
      (t) => t.amount <= Number(filters.maxAmount)
    );
  }

  // Filtrer par date de début
  if (filters.startDate) {
    filtered = filtered.filter(
      (t) => new Date(t.date) >= new Date(filters.startDate)
    );
  }

  // Filtrer par date de fin
  if (filters.endDate) {
    filtered = filtered.filter(
      (t) => new Date(t.date) <= new Date(filters.endDate)
    );
  }

  // Tri
  const sortBy = filters.sortBy || 'date';
  const sortOrder = filters.sortOrder || 'desc';

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = (a.category || '').localeCompare(b.category || '');
        break;
      case 'type':
        comparison = (a.type || '').localeCompare(b.type || '');
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};
