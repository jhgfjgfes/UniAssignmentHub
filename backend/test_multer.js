try {
  const multer = require('multer');
  console.log('multer loaded successfully');
  
  const upload = multer({ dest: 'uploads/temp/' });
  console.log('multer configured');
} catch (error) {
  console.error('Error loading multer:', error);
}
