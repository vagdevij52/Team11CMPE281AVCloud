const express = require('express');
// const jwt = require('jsonwebtoken');
// const passport = require('passport');
var cookieParser = require('cookie-parser');
var config = require('../store/config');
// var dbconnection = config.dbconnection;
const router = express.Router();

// router.post('/signup', function (req, res) {
//   console.log('Inside Signup');
//   console.log(req.body);
//   const username = req.body.username;
//   const email = req.body.email;
//   const password = req.body.encryptpassword;
//   var idusers1;
//   dbconnection.query(
//     'SELECT * FROM users WHERE email = ?',
//     [email],
//     (err, output, fields) => {
//       if (err) {
//         console.log(err);
//         res.status(400).send('Error!');
//       } else {
//         if (output.length > 0) {
//           res
//             .status(401)
//             .send(
//               'Email already exists!!Please Login or use a different email ID'
//             );
//         } else {
//           dbconnection.query(
//             'INSERT INTO users(usersname,email,password) VALUES (?,?,?) ',
//             [username, email, password],
//             (err, output, fields) => {
//               if (err) {
//                 console.log(err);
//                 res.status(400).send('Error!');
//               } else {
//                 res.cookie('cookie', email, {
//                   maxAge: 900000,
//                   httpOnly: false,
//                   path: '/',
//                 });
//                 req.session.user = username;
//                 req.session.email = email;
//                 console.log(req.session.user);
//                 console.log(req.session.email);
//                 idusers1 = output.insertId;
//                 console.log(idusers1);
//                 res.status(200).send({
//                   username: username,
//                   user_id: idusers1,
//                   email: email,
//                   currencydef: 'USD ($)',
//                 });
//               }
//             }
//           );
//         }
//       }
//     }
//   );
// });

module.exports = router;
