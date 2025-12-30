const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;

    const where = { userId: req.user.id };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await notification.update({ isRead: true });
    res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.id, isRead: false }
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, courseId } = req.body;

    if (!title || !message || !courseId) {
      return res.status(400).json({ error: 'Title, message and course ID are required' });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send announcements for this course' });
    }

    // Get all enrolled students
    const enrollments = await Enrollment.findAll({
      where: { courseId }
    });

    const notifications = enrollments.map(enrollment => ({
      userId: enrollment.studentId,
      title,
      message,
      type: 'announcement',
      relatedId: courseId
    }));

    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
    }

    res.json({ 
      message: 'Announcement sent successfully',
      recipientCount: notifications.length
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};
