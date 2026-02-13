import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { formatCurrency, formatDate } from '../utils/helpers';

const exportService = {
  // Export en CSV
  exportToCSV: (transactions, filename = 'transactions.csv') => {
    const csvData = transactions.map(transaction => ({
      Date: formatDate(transaction.date),
      Type: transaction.type === 'income' ? 'Revenu' : 'Dépense',
      Catégorie: transaction.category,
      Description: transaction.description || '',
      Montant: transaction.amount,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  },

  // Ajoute cette nouvelle fonction dans exportService
exportMonthlyReportToPDF: (report, period, filename = 'rapport-mensuel.pdf') => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Rapport Mensuel Détaillé', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Période: ${period}`, 14, 28);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 33);

  // Résumé principal
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Résumé', 14, 45);

  const summaryData = [
    ['Total Revenus', formatCurrency(report.summary.income)],
    ['Total Dépenses', formatCurrency(report.summary.expense)],
    ['Solde', formatCurrency(report.summary.balance)],
    ['Taux d\'épargne', `${report.summary.savingsRate.toFixed(1)}%`],
    ['Nombre de transactions', String(report.summary.transactionCount)],
  ];

  autoTable(doc, {
    startY: 50,
    head: [['Indicateur', 'Valeur']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  let currentY = doc.lastAutoTable?.finalY || 50;

  // Comparaison avec le mois précédent
  doc.setFontSize(14);
  doc.text('Comparaison avec le mois précédent', 14, currentY + 15);

  const comparisonData = [
    ['Revenus', formatCurrency(report.comparison.prevIncome), formatCurrency(report.summary.income), `${report.comparison.incomeChange >= 0 ? '+' : ''}${report.comparison.incomeChange.toFixed(1)}%`],
    ['Dépenses', formatCurrency(report.comparison.prevExpense), formatCurrency(report.summary.expense), `${report.comparison.expenseChange >= 0 ? '+' : ''}${report.comparison.expenseChange.toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: currentY + 20,
    head: [['Type', 'Mois précédent', 'Mois actuel', 'Variation']],
    body: comparisonData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  currentY = doc.lastAutoTable?.finalY || currentY;

  // Moyennes quotidiennes
  doc.setFontSize(14);
  doc.text('Moyennes quotidiennes', 14, currentY + 15);

  const avgData = [
    ['Revenus par jour', formatCurrency(report.dailyAverage.income)],
    ['Dépenses par jour', formatCurrency(report.dailyAverage.expense)],
  ];

  autoTable(doc, {
    startY: currentY + 20,
    head: [['Indicateur', 'Montant']],
    body: avgData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  currentY = doc.lastAutoTable?.finalY || currentY;

  // Dépenses par catégorie
  doc.setFontSize(14);
  doc.text('Dépenses par catégorie', 14, currentY + 15);

  const categoryData = Object.entries(report.categoryStats || {}).map(([category, values]) => [
    category,
    formatCurrency(values.expense),
    formatCurrency(values.income),
    String(values.count),
  ]);

  if (categoryData.length > 0) {
    autoTable(doc, {
      startY: currentY + 20,
      head: [['Catégorie', 'Dépenses', 'Revenus', 'Transactions']],
      body: categoryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    currentY = doc.lastAutoTable?.finalY || currentY;
  }

  // Top 5 des dépenses
  if (report.topExpenses && report.topExpenses.length > 0) {
    // Ajouter une nouvelle page si nécessaire
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.text('Top 5 des dépenses', 14, currentY + 15);

    const topExpensesData = report.topExpenses.map((expense, index) => [
      String(index + 1),
      expense.category,
      expense.description || '-',
      formatCurrency(expense.amount),
    ]);

    autoTable(doc, {
      startY: currentY + 20,
      head: [['#', 'Catégorie', 'Description', 'Montant']],
      body: topExpensesData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] },
    });
  }

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(filename);
},
};


export default exportService;