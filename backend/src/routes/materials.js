const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const materialController = require('../controllers/materialController');
const { auth, isTeacher } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/materials');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post('/', auth, isTeacher, upload.single('file'), materialController.uploadMaterial);
router.get('/', auth, materialController.getMaterials);
router.get('/:id/download', auth, materialController.downloadMaterial);
router.delete('/:id', auth, isTeacher, materialController.deleteMaterial);

module.exports = router;
