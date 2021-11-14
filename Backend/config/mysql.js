var mysql      = require('mysql');
const {mySql,env } = require('./vars');
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
    host     :  mySql.host,
    port     :  mySql.port,
    user     :  mySql.username,
    password :  mySql.password,
    database :  mySql.dbInstance
  });
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

// var getConnection = function () {
//     return getConnectionAsync().disposer(function (connection) {
//         return connection.destroy();
//     });
// };
// var query = function (command) {
//     connection.connect(function(err) {
//         if (err) throw err;
//         console.log("Connected!");
//         connection.query(command, function (err, result) {
//           if (err) throw err;
//           console.log("Result: " + result);
//         });
//       });
//     // return using(connection.connect(), function (connection) {
//     //     return connection.query(command);        
//     // });
// };
module.exports = connection;
   
//connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
 
//connection.end();