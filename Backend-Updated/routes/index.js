module.exports = (app) => {
    //app.use('/users', require('./users'));
 
    app.use('/', require('./AllRoutes'));
  };
  