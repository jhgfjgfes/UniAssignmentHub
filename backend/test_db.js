const { sequelize, User, Notification, Class } = require('./src/models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const teacher = await User.findOne({ where: { role: 'teacher' } });
    if (!teacher) {
      console.log('No teacher found');
      return;
    }
    console.log('Teacher found:', teacher.id);

    const newClass = await Class.create({
      name: 'Test Class ' + Date.now(),
      description: 'Test Description',
      teacherId: teacher.id
    });
    console.log('Class created:', newClass.id);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

test();
