const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const submissionController = require('../controllers/submissionController');
const { auth, isTeacher, isStudent } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/submissions');
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

router.post('/', auth, isStudent, upload.single('file'), submissionController.submitAssignment);
router.get('/', auth, submissionController.getSubmissions);
router.put('/:id/grade', auth, isTeacher, submissionController.gradeSubmission);
router.get('/:id/download', auth, submissionController.downloadSubmission);

module.exports = router;
