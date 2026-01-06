const { sequelize, User, Course, Class, Assignment, Enrollment, ClassMembership } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Reset database
    console.log('Database synced');

    const hashedPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // Create Teacher
    const teacher = await User.create({
      username: 'demo_teacher',
      email: 'teacher@demo.com',
      password: hashedPassword,
      role: 'teacher',
      name: '张老师 (Teacher Zhang)'
    });
    console.log('Teacher created');

    // Create Students
    console.log('Creating 56 demo students...');
    const students = [];
    
    // Create students with IDs 231304001 to 231304056
    for (let i = 1; i <= 56; i++) {
        const idSuffix = i.toString().padStart(2, '0');
        const studentId = `2313040${idSuffix}`;
        const studentPassword = await bcrypt.hash(studentId, 10);
        
        students.push({
            username: studentId,
            email: `${studentId}@student.uni.edu`,
            password: studentPassword,
            role: 'student',
            name: `学生 ${studentId}`
        });
    }
    
    // Bulk create students
    const createdStudents = await User.bulkCreate(students);
    console.log('56 Students created');

    // Keep some reference students for enrollment
    const student1 = createdStudents[0];
    const student2 = createdStudents[1];

    // Create Course
    const course = await Course.create({
      name: '计算机科学导论',
      code: 'CS101',
      description: 'Introduction to Computer Science',
      teacherId: teacher.id
    });
    console.log('Course created');

    // Create Class
    const class1 = await Class.create({
      name: '2023级计算机科学与技术',
      description: 'Computer Science Class of 2023',
      teacherId: teacher.id
    });
    console.log('Class created');

    // Enroll students
    await Enrollment.create({ studentId: student1.id, courseId: course.id });
    await Enrollment.create({ studentId: student2.id, courseId: course.id });
    
    await ClassMembership.create({ studentId: student1.id, classId: class1.id });
    await ClassMembership.create({ studentId: student2.id, classId: class1.id });
    console.log('Students enrolled');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
