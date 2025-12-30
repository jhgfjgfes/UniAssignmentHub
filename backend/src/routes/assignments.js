const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { auth, isTeacher } = require('../middleware/auth');

router.post('/', auth, isTeacher, assignmentController.createAssignment);
router.get('/', auth, assignmentController.getAssignments);
router.get('/unsubmitted', auth, assignmentController.getUnsubmittedAssignments);
router.get('/:id', auth, assignmentController.getAssignment);
router.put('/:id', auth, isTeacher, assignmentController.updateAssignment);
router.delete('/:id', auth, isTeacher, assignmentController.deleteAssignment);

module.exports = router;
