var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
const route = require('./routes/index');
var config = require('./store/config.js');
// const { dbconnection } = require('./store/config');
const multer = require('multer');
const socketIO = require("socket.io");
const http = require("http");
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
const server = http.createServer(app);
const io = socketIO(server);
io.on("connection", socket => {
  console.log("New client connected" + socket.id);
  //console.log(socket);

  // Returning the initial data of food menu from FoodItems collection
  socket.on("initial_data", () => {
    collection_foodItems.find({}).then(docs => {
      io.sockets.emit("get_data", docs);
    });
  });
  // Placing the order, gets called from /src/main/PlaceOrder.js of Frontend
  socket.on("putOrder", order => {
    collection_foodItems
      .update({ _id: order._id }, { $inc: { ordQty: order.order } })
      .then(updatedDoc => {
        // Emitting event to update the Kitchen opened across the devices with the realtime order values
        io.sockets.emit("change_data");
      });
  });

  // Order completion, gets called from /src/main/Kitchen.js
  socket.on("mark_done", id => {
    collection_foodItems
      .update({ _id: id }, { $inc: { ordQty: -1, prodQty: 1 } })
      .then(updatedDoc => {
        //Updating the different Kitchen area with the current Status.
        io.sockets.emit("change_data");
      });
  });

  // Functionality to change the predicted quantity value, called from /src/main/UpdatePredicted.js
  socket.on("ChangePred", predicted_data => {
    collection_foodItems
      .update(
        { _id: predicted_data._id },
        { $set: { predQty: predicted_data.predQty } }
      )
      .then(updatedDoc => {
        // Socket event to update the Predicted quantity across the Kitchen
        io.sockets.emit("change_data");
      });
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

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
