const userRoutes = require('./user.route');
module.exports = (app) => {
  //app.use('/users', require('./users'));
  app.use('/', require('./UpdateProfileRoute'));
  app.use('/', require('./LoginRoute'));
  app.use('/users', userRoutes);
};
