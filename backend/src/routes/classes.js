const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const classController = require('../controllers/classController');
const { auth, isTeacher, isStudent } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/temp/' });

router.post('/', auth, isTeacher, classController.createClass);
router.get('/', auth, classController.getClasses);
router.get('/all', auth, classController.getAllClasses);
router.get('/:id', auth, classController.getClass);
router.put('/:id', auth, isTeacher, classController.updateClass);
router.delete('/:id', auth, isTeacher, classController.deleteClass);
router.post('/:id/students', auth, isTeacher, classController.addStudent);
router.post('/:id/students/import', auth, isTeacher, upload.single('file'), classController.importStudents);
router.delete('/:id/students/:studentId', auth, isTeacher, classController.removeStudent);
router.get('/:id/members', auth, classController.getMembers);
router.post('/join', auth, isStudent, classController.joinClass);
router.delete('/:classId/leave', auth, isStudent, classController.leaveClass);

module.exports = router;
