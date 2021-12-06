var Connection = require('tedious').Connection;
var config = {
  server: 'swessqlserver.co7pzwu1hwvu.us-east-1.rds.amazonaws.com', //update me
  authentication: {
    type: 'default',
    options: {
      userName: 'admin', //update me
      password: 'Swetha12345', //update me
    },
  },
  options: {
    // If you are on Microsoft Azure, you need encryption:
    encrypt: true,
    database: 'AVCLOUD', //update me
  },
};
var connection = new Connection(config);
connection.on('connect', function (err) {
  // If no error, then good to proceed.
  console.log('SQL Server Connected');
});

connection.connect();

module.exports = {
  dbconnection: connection,
};
