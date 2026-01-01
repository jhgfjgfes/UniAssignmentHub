const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Course;
