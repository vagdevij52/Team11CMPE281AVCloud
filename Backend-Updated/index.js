var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

mongoose = require("mongoose");	
cron = require("node-cron");
const route = require('./routes/index');
var config = require('./store/config.js');
// const { dbconnection } = require('./store/config');
const multer = require('multer');
const socketIO = require("socket.io");
const http = require("http");
app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
//app.use(cors({ origin: 'http://localhost:3000'}));

//app.use(cors());


app.use(session({
    secret              : 'cmpe281',
    resave              : false, 
    saveUninitialized   : false, 
    duration            : 60 * 60 * 1000,
    activeDuration      :  5 * 60 * 1000
}));

app.use(bodyParser.json());
require('./routes/index')(app);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  }); 

  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      transports: ['websocket']
    }
  });
  io.of("/socket").on("connection", (socket) => {
    console.log("socket.io: User connected: ", socket.id);
  
    socket.on("disconnect", () => {
      console.log("socket.io: User disconnected: ", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  
  });
  // io.on("connect_error", (err) => {
  //   console.log(`connect_error due to ${err.message}`);
  // });
  const URI="mongodb+srv://lakshmi:lakshmi@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority";

//  var URI = "mongodb+srv://admin:lakshmi@cmpe281.yagcm.mongodb.net/cmpe281?authSource=admin&replicaSet=atlas-8rtgw9-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
  //URI = "mongodb+srv://admin:lakshmi@cmpe281.yagcm.mongodb.net/cmpe281?retryWrites=true&w=majority";
  //URI="mongodb://localhost:27017/AirlineApplication";
  //start the server
  server.listen(3001, () => console.log(`Server now running on port 3001!`));
  
  //connect to db
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  const connection = mongoose.connection;
  
  connection.once("open", () => {
    console.log("MongoDB database connected");
  
    console.log("Setting change streams");
    const rideChangeStream = connection.collection("RouteInfo").watch();
    const sensorDataChangeStream = connection.collection("LiveSensorData").watch();
    rideChangeStream.on("change", (change) => {
      console.log("change stream called");
      switch (change.operationType) {
        case "insert":
          console.log("insert stream called");
          //console.log(change.fullDocument['Ride ID']);
  
          console.log(change.fullDocument);
          const ride = {
            _id: change.fullDocument._id,
            'Ride ID': change.fullDocument['Ride ID'],
            'Road ID': change.fullDocument['Road ID'],
            'Lane ID': change.fullDocument['Lane ID'],
            'Location x': change.fullDocument['Location x'],
            'Location y': change.fullDocument['Location y'],
          };
  
          io.of("/socket").emit("newRide", ride);
          break;
  
        case "delete":
          io.of("/socket").emit("deletedRide", change.documentKey._id);
          break;
      }
    });
    sensorDataChangeStream.on("change", (change) => {
      console.log("sensor change stream called");
      switch (change.operationType) {
        case "insert":
          console.log("insert sensor stream called");
          const sensorData = change.fullDocument.frame[0];
          console.log(sensorData);
          io.of("/socket").emit("newSensorData", sensorData);
          break;
      }
    });

    

const statusDataChangeStream = connection.collection("Status").watch();
statusDataChangeStream.on("change", (change) => {
  console.log("status change stream called");
  switch (change.operationType) {
    case "insert":
      console.log("insert status stream called");
      const statusData = change.fullDocument;
      console.log(statusData);
      io.of("/socket").emit("newStatusData", statusData);
      break;
  }
});
}); 
  

//app.listen(3001);
console.log("Server Listening on port 3001");