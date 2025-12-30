const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, isTeacher, isStudent } = require('../middleware/auth');

router.post('/', auth, isTeacher, courseController.createCourse);
router.get('/', auth, courseController.getCourses);
router.get('/all', auth, courseController.getAllCourses);
router.get('/:id', auth, courseController.getCourse);
router.put('/:id', auth, isTeacher, courseController.updateCourse);
router.delete('/:id', auth, isTeacher, courseController.deleteCourse);
router.post('/enroll', auth, isStudent, courseController.enrollStudent);
router.delete('/:courseId/enroll', auth, isStudent, courseController.unenrollStudent);

module.exports = router;
