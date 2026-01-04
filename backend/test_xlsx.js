try {
  const xlsx = require('xlsx');
  console.log('xlsx loaded successfully');
  
  const wb = xlsx.utils.book_new();
  console.log('Workbook created');
} catch (error) {
  console.error('Error loading xlsx:', error);
}
