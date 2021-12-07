const express = require('express');
var cookieParser = require('cookie-parser');
const dbConnection = require('../dbContext/dbContext');
var TYPES = require('tedious').TYPES;
const router = express.Router();
const service = require('../services/Service');
const PythonShell = require('python-shell').PythonShell;
const ride = require("./ride");
const { MongoClient } = require('mongodb');


router.get('/login', function (req, res) {
    PythonShell.run("C:\\Users\\varun\\OneDrive\\Desktop\\281\\TermProject-Local\\CMPE281TermProject\\python1.py", null, function (err) {
        if (err) throw err;
        console.log('finished reading python script');
      });
    console.log('Inside login');
    //console.log(req.body);  
    const email = req.query.email;
    const password = req.query.password;
    console.log(email + " : " + password);
    service.login(email, password)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get login then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get login - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.post('/signup', function (req, res) {
    console.log('Inside signup');
    //console.log(req.body);  
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;    
    const password = req.body.password;
    const userrole = req.body.userrole;
    console.log(email + " : " + password + " : " + firstName+ " : " + lastName+ " : " + userrole);
    service.signup(firstName, lastName, email, password, userrole)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get signup then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get signup - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.post('/registerVehicle', function (req, res) {
    console.log('Inside registerVehicle');
    //console.log(req.body);  
    const carNo = req.body.carNo;
    const carType = req.body.carType;
    const carModel = req.body.carModel;    
    const carColor = req.body.carColor;
    const userId = req.body.userId;
    console.log(carNo + " : " + carType + " : " + carModel+ " : " + carColor+ " : " + userId);
    service.registerVehicle(carNo, carType, carModel, carColor, userId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get signup then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get signup - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.get('/getVehicleDetails', function (req, res) {
    console.log('Inside getVehicleDetails');
    //console.log(req.body);  
    const userid = req.query.userId;
    //const password = req.query.password;
    console.log(userid);
    service.getVehicleDetails(userid)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get getVehicleDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get getVehicleDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.get('/getVehicleRideDetails', function (req, res) {
    console.log('Inside getVehicleRideDetails');
    //console.log(req.body);  
    const vehicleId = req.query.vehicleId;
    //const password = req.query.password;
    console.log(vehicleId);
    service.getVehicleRideDetails(vehicleId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get getVehicleRideDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get getVehicleRideDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.get('/getAllVehicleDetails', function (req, res) {
    console.log('Inside getAllVehicleDetails');
    //console.log(req.body);  
    //const vehicleId = req.query.vehicleId;
    //const password = req.query.password;
    
    service.getAllVehicleDetails()    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get getAllVehicleDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get getAllVehicleDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.post('/bookRide', function (req, res) {
    console.log('Inside bookRide');
    //console.log(req.body);  
    const userId = req.body.userId;
    const vehicleId = req.body.vehicleId;
    const source = req.body.source;
    const destination = req.body.destination;    
    
    console.log(vehicleId + " : " + source + " : " + destination + " : " + userId);
    service.bookRide(userId, vehicleId, source, destination)
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside post bookRide then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside post bookRide - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.get('/getAllUserDetails', function (req, res) {
    console.log('Inside getAllUserDetails');
    //console.log(req.body);  
    //const vehicleId = req.query.vehicleId;
    //const password = req.query.password;
    
    service.getAllUserDetails()    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get getAllUserDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get getAllUserDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.post('/saveUserDetails', function (req, res) {
    console.log('Inside saveUserDetails');
    //console.log(req.body);  
    const userId = req.body.userId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthday = req.body.birthday;    
    const gender = req.body.gender;    
    const phone = req.body.phone;    
    
    console.log(userId + " : " + firstName + " : " + lastName + " : " + birthday + " : " + gender + " : "+ phone);
    service.saveUserDetails(userId, firstName, lastName, birthday, gender, phone)
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside post saveUserDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside post saveUserDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.get('/getUserDetails', function (req, res) {
    console.log('Inside getUserDetails');    
    const userId = req.query.userId;    
    console.log(userId);
    service.getUserDetails(userId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get getUserDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside get getUserDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });   
    
  });

  router.get('/getUserRideDetailsByRideID', function (req, res) {
//   exports.getUserRideDetailsByRideID = async (req, res, next) => {
    
      const rideId = req.query.rideId;
      //const rideExists = await Admin.getVehicle(rideId);
  
      const ride = service.getRideById(rideId)
      .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside get getRideById then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
        })
        .catch(function(err){
            console.log("Inside get getRideById - Promise rejection error: "+err);
            return res.status(500).send({
            message: err
         });
        });    
    });

  router.get('/getSensorData', function (req, res) {
 // exports.getSensorData = async (req, res, next) => {
    var rideId = req.query.rideId;
    //const uri="mongodb+srv://lakshmi:lakshmi@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority";
    const uri="mongodb+srv://lakshmi:lakshmi@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority";

    //const uri = "mongodb+srv://admin:lakshmi@cmpe281.yagcm.mongodb.net/cmpe281?retryWrites=true&w=majority";
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("AVCLOUD");
      //var dbo = db.db("cmpe281");
      //Find all documents in the customers collection:
      //dbo.collection("LiveSensorData").find({ "Ride ID": 86 }).sort({ _id: -1 }).limit(1).toArray(function (err, result) {
      dbo.collection("LiveSensorData").find({}).sort({ _id: -1 }).limit(1).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        return res.json({
          success: true,
          message: result[0]["frame"].filter(i=>i['Ride ID']==rideId),
        });
        //console.log(result);
  
      });
    });  
  })

  router.get('/getAllRidesSensor', function (req, res) {        
      
          const ride = service.getAllRidesSensor()
          .then(function(results){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            console.log("Inside get getAllRidesSensor then block");
            console.log(JSON.stringify(results));
            res.end(JSON.stringify(results));
            })
            .catch(function(err){
                console.log("Inside get getAllRidesSensor - Promise rejection error: "+err);
                return res.status(500).send({
                message: err
             });
            });    
});

router.get('/getRoutes', function (req, res) {  
  
     const data = service.getRouteDetails(req.query.rideId)
     .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end(JSON.stringify(results));
        })
        .catch(function(err){
            console.log("Inside get getRideById - Promise rejection error: "+err);
            return res.status(500).send({
            message: err
         });
        });      
  });
  
    
 


  module.exports = router; 