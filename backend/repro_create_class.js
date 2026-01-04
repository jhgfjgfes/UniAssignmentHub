const { sequelize, Class, User } = require('./src/models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Find the teacher
    const teacher = await User.findOne({ where: { username: 'demo_teacher' } });
    if (!teacher) {
      console.log('Teacher demo_teacher not found!');
      return;
    }
    console.log('Found teacher:', teacher.id, teacher.username);

    // Try to create a class
    console.log('Attempting to create class...');
    const classItem = await Class.create({
      name: 'Test Class Repro',
      description: 'Created by repro script',
      teacherId: teacher.id
    });
    console.log('Class created successfully:', classItem.id);

  } catch (error) {
    console.error('Error creating class:', error);
    if (error.original) {
        console.error('Original error:', error.original);
    }
  } finally {
    await sequelize.close();
  }
}

test();
