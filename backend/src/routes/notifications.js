const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, isTeacher } = require('../middleware/auth');

router.get('/', auth, notificationController.getNotifications);
router.get('/unread-count', auth, notificationController.getUnreadCount);
router.put('/:id/read', auth, notificationController.markAsRead);
router.put('/read-all', auth, notificationController.markAllAsRead);
router.post('/announcement', auth, isTeacher, notificationController.createAnnouncement);

module.exports = router;
