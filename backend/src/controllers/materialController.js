const path = require('path');
const fs = require('fs').promises;
const { Material, Class, User, ClassMembership } = require('../models');

exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { classId, title } = req.body;

    if (!classId || !title) {
      // Delete uploaded file if validation fails
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Class ID and title are required' });
    }

    const classItem = await Class.findByPk(classId);

    if (!classItem) {
      await fs.unlink(req.file.path);
      return res.status(404).json({ error: 'Class not found' });
    }

    if (classItem.teacherId !== req.user.id) {
      await fs.unlink(req.file.path);
      return res.status(403).json({ error: 'Not authorized to upload materials to this class' });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);

    const material = await Material.create({
      classId,
      title,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: fileExt,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      message: 'Material uploaded successfully',
      material
    });
  } catch (error) {
    console.error('Upload material error:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => console.error('Error deleting file:', err));
    }
    res.status(500).json({ error: 'Failed to upload material' });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    const materials = await Material.findAll({
      where: { classId },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(materials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to get materials' });
  }
};

exports.downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        {
          model: Class,
          as: 'class'
        }
      ]
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Check if user has access to the material
    const isTeacher = material.class.teacherId === req.user.id;
    
    let isStudent = false;
    if (req.user.role === 'student') {
      const membership = await ClassMembership.findOne({
        where: { studentId: req.user.id, classId: material.classId }
      });
      isStudent = !!membership;
    }

    if (!isTeacher && !isStudent) {
      return res.status(403).json({ error: 'Not authorized to download this material' });
    }

    res.download(material.filePath, material.fileName);
  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({ error: 'Failed to download material' });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        {
          model: Class,
          as: 'class'
        }
      ]
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    if (material.class.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this material' });
    }

    // Delete file
    try {
      await fs.unlink(material.filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    await material.destroy();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
};
