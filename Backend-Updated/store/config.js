var Connection = require('tedious').Connection;
var config = {
  server: '34.222.77.171', //update me
  authentication: {
    type: 'default',
    options: {
      userName: 'SA', //update me
      password: 'Shreshta.99', //update me
    },
  },
  options: {
    database: 'cmpe281', //update me
  },
};
var connection = new Connection(config);
connection.on('connect', function (err) {
  if(err){
    console.log(err)
  } else {
    console.log('SQL Server Connected');
  }
});

connection.connect();

module.exports = {
  dbconnection: connection,
};