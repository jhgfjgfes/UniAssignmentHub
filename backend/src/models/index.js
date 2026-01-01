const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Class = require('./Class');
const Assignment = require('./Assignment');
const Submission = require('./Submission');
const Notification = require('./Notification');
const Material = require('./Material');
const Enrollment = require('./Enrollment');
const ClassMembership = require('./ClassMembership');

// Define relationships
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

User.hasMany(Class, { foreignKey: 'teacherId', as: 'classes' });
Class.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

Course.hasMany(Assignment, { foreignKey: 'courseId', as: 'assignments' });
Assignment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Assignment.hasMany(Submission, { foreignKey: 'assignmentId', as: 'submissions' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });

User.hasMany(Submission, { foreignKey: 'studentId', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Class.hasMany(Material, { foreignKey: 'classId', as: 'materials' });
Material.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

User.hasMany(Material, { foreignKey: 'uploadedBy', as: 'uploadedMaterials' });
Material.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

User.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentId', as: 'enrolledCourses' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', as: 'students' });

User.belongsToMany(Class, { through: ClassMembership, foreignKey: 'studentId', as: 'enrolledClasses' });
Class.belongsToMany(User, { through: ClassMembership, foreignKey: 'classId', as: 'members' });

module.exports = {
  sequelize,
  User,
  Course,
  Class,
  Assignment,
  Submission,
  Notification,
  Material,
  Enrollment,
  ClassMembership
};
