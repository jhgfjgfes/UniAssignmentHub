const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { auth, isTeacher, isStudent } = require('../middleware/auth');

router.post('/', auth, isTeacher, classController.createClass);
router.get('/', auth, classController.getClasses);
router.get('/all', auth, classController.getAllClasses);
router.get('/:id', auth, classController.getClass);
router.put('/:id', auth, isTeacher, classController.updateClass);
router.delete('/:id', auth, isTeacher, classController.deleteClass);
router.post('/:id/students', auth, isTeacher, classController.addStudent);
router.delete('/:id/students/:studentId', auth, isTeacher, classController.removeStudent);
router.get('/:id/members', auth, classController.getMembers);
router.post('/join', auth, isStudent, classController.joinClass);
router.delete('/:classId/leave', auth, isStudent, classController.leaveClass);

module.exports = router;
