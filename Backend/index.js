var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
const route = require('./routes/index');
var config = require('./store/config.js');
// const { dbconnection } = require('./store/config');
const multer = require('multer');
app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(
  session({
    secret: 'cmpe202',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

require('./routes')(app);

// app.listen(3001);
// console.log('Server Listening on port 3001');

// const dbconnection = mysql.createConnection(config.databaseOptions);

app.listen(3001, () => {
  console.log('Server Listening on port 3001');
});

// module.exports = { app: app, dbconnection: dbconnection };
module.exports = app;
