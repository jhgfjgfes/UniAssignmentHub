const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  allowedFileTypes: {
    type: DataTypes.STRING,
    defaultValue: 'pdf,doc,docx,md,mp4,avi,mov,ppt,pptx,xls,xlsx'
  },
  maxScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  }
});

module.exports = Assignment;
