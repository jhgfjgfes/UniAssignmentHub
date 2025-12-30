const { Class, User, ClassMembership, Material } = require('../models');

exports.createClass = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Class name is required' });
    }

    const classItem = await Class.create({
      name,
      description,
      teacherId: req.user.id
    });

    res.status(201).json(classItem);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

exports.getClasses = async (req, res) => {
  try {
    let classes;

    if (req.user.role === 'teacher') {
      classes = await Class.findAll({
        where: { teacherId: req.user.id },
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'name', 'email']
          }
        ]
      });
    } else {
      // Student - get enrolled classes
      const memberships = await ClassMembership.findAll({
        where: { studentId: req.user.id },
        include: [
          {
            model: Class,
            as: 'Class',
            include: [
              {
                model: User,
                as: 'teacher',
                attributes: ['id', 'name', 'email']
              }
            ]
          }
        ]
      });
      classes = memberships.map(m => m.Class);
    }

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
};

exports.getClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Material,
          as: 'materials'
        }
      ]
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classItem);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Failed to get class' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this class' });
    }

    const { name, description } = req.body;
    await classItem.update({ name, description });

    res.json(classItem);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this class' });
    }

    await classItem.destroy();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const classId = req.params.id;

    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to add students to this class' });
    }

    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }

    const existingMembership = await ClassMembership.findOne({
      where: { studentId, classId }
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'Student already in this class' });
    }

    const membership = await ClassMembership.create({
      studentId,
      classId
    });

    res.status(201).json({ message: 'Student added successfully', membership });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

exports.removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const classId = req.params.id;

    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classItem.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to remove students from this class' });
    }

    const membership = await ClassMembership.findOne({
      where: { studentId, classId }
    });

    if (!membership) {
      return res.status(404).json({ error: 'Student not in this class' });
    }

    await membership.destroy();
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({ error: 'Failed to remove student' });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const classId = req.params.id;

    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const memberships = await ClassMembership.findAll({
      where: { classId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'username', 'email']
        }
      ]
    });

    const members = memberships.map(m => m.User);
    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get members' });
  }
};

exports.joinClass = async (req, res) => {
  try {
    const { classId } = req.body;

    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const existingMembership = await ClassMembership.findOne({
      where: { studentId: req.user.id, classId }
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'Already a member of this class' });
    }

    const membership = await ClassMembership.create({
      studentId: req.user.id,
      classId
    });

    res.status(201).json({ message: 'Joined class successfully', membership });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ error: 'Failed to join class' });
  }
};

exports.leaveClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const membership = await ClassMembership.findOne({
      where: { studentId: req.user.id, classId }
    });

    if (!membership) {
      return res.status(404).json({ error: 'Not a member of this class' });
    }

    await membership.destroy();
    res.json({ message: 'Left class successfully' });
  } catch (error) {
    console.error('Leave class error:', error);
    res.status(500).json({ error: 'Failed to leave class' });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(classes);
  } catch (error) {
    console.error('Get all classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
};
