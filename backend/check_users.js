const { sequelize, User } = require('./src/models');

async function checkUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log('Users in DB:', users.map(u => ({ id: u.id, username: u.username, role: u.role })));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkUsers();
