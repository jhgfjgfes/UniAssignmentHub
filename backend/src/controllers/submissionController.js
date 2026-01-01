const path = require('path');
const fs = require('fs').promises;
const { Submission, Assignment, Course, Notification, User } = require('../models');

exports.submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { assignmentId } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ error: 'Assignment ID is required' });
    }

    const assignment = await Assignment.findByPk(assignmentId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check file type
    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);
    const allowedTypes = assignment.allowedFileTypes.split(',');
    
    if (!allowedTypes.includes(fileExt)) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      return res.status(400).json({ 
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      where: {
        assignmentId,
        studentId: req.user.id
      }
    });

    if (existingSubmission) {
      // Delete old file
      try {
        await fs.unlink(existingSubmission.filePath);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
      
      // Update submission
      await existingSubmission.update({
        filePath: req.file.path,
        fileName: req.file.originalname,
        fileType: fileExt,
        submittedAt: new Date(),
        status: 'submitted',
        score: null,
        feedback: null
      });

      return res.json({
        message: 'Assignment resubmitted successfully',
        submission: existingSubmission
      });
    }

    const submission = await Submission.create({
      assignmentId,
      studentId: req.user.id,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: fileExt
    });

    res.status(201).json({
      message: 'Assignment submitted successfully',
      submission
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const submissions = await Submission.findAll({
        where: { studentId: req.user.id },
        include: [
          {
            model: Assignment,
            as: 'assignment',
            include: [
              {
                model: Course,
                as: 'course'
              }
            ]
          }
        ],
        order: [['submittedAt', 'DESC']]
      });

      return res.json(submissions);
    }

    // For teachers, get submissions for their courses' assignments
    const { assignmentId } = req.query;
    
    if (assignmentId) {
      const assignment = await Assignment.findByPk(assignmentId, {
        include: [{ model: Course, as: 'course' }]
      });

      if (!assignment || assignment.course.teacherId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const submissions = await Submission.findAll({
        where: { assignmentId },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'username', 'email']
          }
        ]
      });

      return res.json(submissions);
    }

    res.status(400).json({ error: 'Assignment ID required for teachers' });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submissionId = req.params.id;

    const submission = await Submission.findByPk(submissionId, {
      include: [
        {
          model: Assignment,
          as: 'assignment',
          include: [
            {
              model: Course,
              as: 'course'
            }
          ]
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.assignment.course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to grade this submission' });
    }

    if (score !== undefined && (score < 0 || score > submission.assignment.maxScore)) {
      return res.status(400).json({ 
        error: `Score must be between 0 and ${submission.assignment.maxScore}` 
      });
    }

    await submission.update({
      score,
      feedback,
      status: 'graded'
    });

    // Create notification for student
    await Notification.create({
      userId: submission.studentId,
      title: '作业已批改 / Assignment Graded',
      message: `${submission.assignment.title} 已被批改`,
      type: 'grade',
      relatedId: submission.id
    });

    res.json({
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
};

exports.downloadSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [
        {
          model: Assignment,
          as: 'assignment',
          include: [
            {
              model: Course,
              as: 'course'
            }
          ]
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check authorization
    const isOwner = submission.studentId === req.user.id;
    const isTeacher = submission.assignment.course.teacherId === req.user.id;

    if (!isOwner && !isTeacher) {
      return res.status(403).json({ error: 'Not authorized to download this submission' });
    }

    res.download(submission.filePath, submission.fileName);
  } catch (error) {
    console.error('Download submission error:', error);
    res.status(500).json({ error: 'Failed to download submission' });
  }
};
