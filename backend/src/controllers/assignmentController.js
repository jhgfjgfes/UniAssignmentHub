const { Assignment, Course, Notification, User, Submission, Enrollment } = require('../models');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxScore, allowedFileTypes } = req.body;

    if (!title || !courseId || !dueDate) {
      return res.status(400).json({ error: 'Title, course and due date are required' });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to create assignments for this course' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      courseId,
      dueDate,
      maxScore: maxScore || 100,
      allowedFileTypes: allowedFileTypes || 'pdf,doc,docx,md,mp4,avi,mov,ppt,pptx,xls,xlsx'
    });

    // Create notifications for all enrolled students
    const enrollments = await Enrollment.findAll({
      where: { courseId }
    });

    const notifications = enrollments.map(enrollment => ({
      userId: enrollment.studentId,
      title: '新作业通知 / New Assignment',
      message: `${course.name} - ${title}`,
      type: 'assignment',
      relatedId: assignment.id
    }));

    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
    }

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const assignments = await Assignment.findAll({
      where: { courseId },
      include: [
        {
          model: Course,
          as: 'course'
        }
      ],
      order: [['dueDate', 'DESC']]
    });

    // If student, include submission status
    if (req.user.role === 'student') {
      const assignmentsWithStatus = await Promise.all(
        assignments.map(async (assignment) => {
          const submission = await Submission.findOne({
            where: {
              assignmentId: assignment.id,
              studentId: req.user.id
            }
          });

          return {
            ...assignment.toJSON(),
            hasSubmitted: !!submission,
            submission
          };
        })
      );

      return res.json(assignmentsWithStatus);
    }

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to get assignments' });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // If student, include their submission
    if (req.user.role === 'student') {
      const submission = await Submission.findOne({
        where: {
          assignmentId: assignment.id,
          studentId: req.user.id
        }
      });

      return res.json({
        ...assignment.toJSON(),
        hasSubmitted: !!submission,
        submission
      });
    }

    // If teacher, include all submissions
    if (req.user.role === 'teacher') {
      const submissions = await Submission.findAll({
        where: { assignmentId: assignment.id },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'username', 'email']
          }
        ]
      });

      return res.json({
        ...assignment.toJSON(),
        submissions
      });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to get assignment' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this assignment' });
    }

    const { title, description, dueDate, maxScore, allowedFileTypes } = req.body;
    await assignment.update({
      title,
      description,
      dueDate,
      maxScore,
      allowedFileTypes
    });

    res.json(assignment);
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this assignment' });
    }

    await assignment.destroy();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};

exports.getUnsubmittedAssignments = async (req, res) => {
  try {
    // Get all courses the student is enrolled in
    const enrollments = await Enrollment.findAll({
      where: { studentId: req.user.id }
    });

    const courseIds = enrollments.map(e => e.courseId);

    // Get all assignments for these courses
    const assignments = await Assignment.findAll({
      where: { courseId: courseIds },
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });

    // Filter out assignments that have been submitted
    const unsubmittedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          where: {
            assignmentId: assignment.id,
            studentId: req.user.id
          }
        });

        if (!submission) {
          return assignment;
        }
        return null;
      })
    );

    const filtered = unsubmittedAssignments.filter(a => a !== null);
    res.json(filtered);
  } catch (error) {
    console.error('Get unsubmitted assignments error:', error);
    res.status(500).json({ error: 'Failed to get unsubmitted assignments' });
  }
};
