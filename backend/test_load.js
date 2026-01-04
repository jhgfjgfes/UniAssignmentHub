try {
  console.log('Loading models...');
  const models = require('./src/models');
  console.log('Models loaded.');

  console.log('Loading classController...');
  const classController = require('./src/controllers/classController');
  console.log('classController loaded.');

  console.log('Loading notificationController...');
  const notificationController = require('./src/controllers/notificationController');
  console.log('notificationController loaded.');

  console.log('Loading classes route...');
  const classesRoute = require('./src/routes/classes');
  console.log('classes route loaded.');

} catch (error) {
  console.error('Error loading modules:', error);
}
