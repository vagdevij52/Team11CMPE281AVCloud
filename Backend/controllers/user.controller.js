const { json } = require('body-parser');
const httpStatus = require('http-status');
const { omit } = require('lodash');
var Promise = require('bluebird');
const { MongoClient } = require('mongodb');
const User = Promise.promisifyAll(require('../models/user/user.model'));
var TYPES = require('tedious').TYPES;
var response = require('../utils/response');
const dbContext = require('../database/dbContext');
const { transform } = require('../models/user/user.model');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {

    //console.log("id "+id);
    const user = await User.getUser(id, (data) => {
      req.locals = { user: data };
      //console.log("am here");
      //console.log(req.locals);
      return next();
    });

  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user = transform(req.locals.user));

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());


/**
 * Create new user
 * @public
 */
exports.create = (req, res, next) => {
  try {
    const user = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      UserRole: req.body.UserRole,
      Email: req.body.Email,
      UserPassword: req.body.UserPassword,
      UserCreditCard: req.body.UserCreditCard,
      UserPhone: req.body.UserPhone,
      ProfilePicture: req.body.ProfilePicture
    };
    // const usr= User.createuser(user);
    var parameters = [];
    // parameters.push({ name: 'UserID', type: TYPES.INT, val: 1 });
    parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: user.FirstName });
    parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: user.LastName });
    parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: user.UserRole });
    parameters.push({ name: 'Email', type: TYPES.NVarChar, val: user.Email });
    parameters.push({ name: 'UserPassword', type: TYPES.NVarChar, val: user.UserPassword });
    parameters.push({ name: 'UserCreditCard', type: TYPES.NVarChar, val: user.UserCreditCard });
    parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val: user.UserPhone });
    parameters.push({ name: 'ProfilePicture', type: TYPES.NVarChar, val: user.ProfilePicture });


    var query = "INSERT INTO dbo.USERDETAILS(FirstName,LastName,UserRole,Email,UserPassword,UserCreditCard,UserPhone,ProfilePicture) values(@FirstName,@LastName,@UserRole,@Email,@UserPassword,@UserCreditCard,@UserPhone,@ProfilePicture);select @@identity as UserID;";
    dbContext.query(query, parameters, false, function (error, data) {
      ////console.log(data);
      //return response(data, error);
      //datao= data;
      ////console.log(datao);
      return res.json(response(data, error));
    });
    res.status(httpStatus.CREATED);


  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};
exports.login = (req, res, next) => {
  try {

  }
  catch (err) {

  }
};

/**
 * Get user ride history details
 * @apiParam  {INT}        userid     User's ID
 * @apiParam  {String}     role       User's role
 * @public
 */
exports.getTripHistory = async (req, res, next) => {
  try {
    ////console.log("dnt knw if am here");
    const { user } = req.locals;
    //const newUser = new User.userModel(req.body);
    const userId = req.params.userId;

    await User.getTripDetails(52, (data) => {
      ////console.log("done"+ data.RideID);
      //  ////console.log("donne"+user.FirstName);
      //user=data;
      if (data) return res.json(data);
      //return done(null, false);
    });

  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};
/**
 * Schedule ride 
 * @apiParam  {INT}        userid     User's ID
 * @apiParam  {String}     role       User's role
 * @public
 */
exports.scheduleTrip = async (req, res, next) => {
  try {
    ////console.log("yes if am here");
    // const { user } = req.locals;
    const newRide = new User.rideData(req.body);
    // const userId=req.params.userId;
    //console.log(newRide);
    await User.scheduleRide(newRide, (data) => {
      ////console.log("done "+ data);
      //  ////console.log("donne"+user.FirstName);
      //user=data;
      if (data) return res.json(data);
      //return done(null, false);
    });

  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};
/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.editUserProfile = async (req, res, next) => {
  // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  //const updatedUser = omit(req.body, ommitRole);
  const updatedUser = new User.userModel(req.body);
 // console.log(updatedUser);
  const userId = req.params.userId;
  //const user = Object.assign(req.locals.user, updatedUser);
  //const userExists = await Admin.getUser(userid);
  const userExists = await User.getUser(userId, (data) => {   
    return data;
  });
  if (userExists) {
    const userUpdate = await User.editUserProfile(updatedUser,userId);

    if (userUpdate) {
      res.status(httpStatus.OK);
      return res.json(userUpdate);
    }
    throw new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'No user data available',
    });
  } else {
    return res.json({
      msg: 'failure! user not found'
    });
  }

};
exports.getSensorData = async (req, res, next) => {
  var rideId = req.params.rideId;
  //const uri="mongodb+srv://lakshmi:lakshmi@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority";
  const uri = "mongodb+srv://admin:lakshmi@cmpe281.yagcm.mongodb.net/cmpe281?retryWrites=true&w=majority";
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    //var dbo = db.db("AVCLOUD");
    var dbo = db.db("cmpe281");
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

};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
