const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClassMembership = sequelize.define('ClassMembership', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = ClassMembership;
