const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./sysadmin.route');
const ownerRoutes = require('./owner.route');
module.exports = (app) => {
  //app.use('/users', require('./users'));
  app.use('/', require('./UpdateProfileRoute'));
  app.use('/', require('./LoginRoute'));
  app.use('/users', userRoutes);
  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/owner', ownerRoutes);
};

