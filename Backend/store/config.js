// var mysql = require('mysql');

// const config = {
//   host: 'airline-booking.cu0buaumd8bx.us-east-2.rds.amazonaws.com',
//   user: 'admin',
//   password: 'admin123',
//   ssl: true,
//   database: 'airline_booking',
//   multipleStatements: true,
//   port: '3306',
//   //   remove below option if you need both date and timestamp when retriving date column from mysql
//   dateStrings: true,
// };
// var dbconnection = mysql.createConnection(config); //added the line
// dbconnection.connect(function (err) {
//   if (err) {
//     console.log('MySQL Connection failed' + err.stack);
//   }
//   console.log('MySQL Connected!');
// });

// module.exports = {
//   dbconnection: mysql.createConnection(config),
// };

// https://docs.microsoft.com/en-us/sql/connect/node-js/step-3-proof-of-concept-connecting-to-sql-using-node-js?view=sql-server-ver15

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
  dbconnection: new Connection(config),
};
