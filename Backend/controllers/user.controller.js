const { json } = require('body-parser');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user/user.model');
var TYPES = require('tedious').TYPES;
var response = require('../utils/response');
const dbContext = require('../database/dbContext');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

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
     FirstName:"lakshmi",
     LastName:"priya",     
     UserRole:"user",
     Email:"lpriya33@gmail.com",  
     UserPassword:"p",
     UserCreditCard:"12345",
     UserPhone:"56543212",
     ProfilePicture:"abcd.jpg"
    };
     // const usr= User.createuser(user);
     var parameters = [];
   // parameters.push({ name: 'UserID', type: TYPES.INT, val: 1 });
    parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: user.FirstName });
    parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: user.LastName });
    parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: user.UserRole });
    parameters.push({ name: 'Email', type: TYPES.NVarChar, val:  user.Email });
    parameters.push({ name: 'UserPassword', type: TYPES.NVarChar, val: user.UserPassword });
    parameters.push({ name: 'UserCreditCard', type: TYPES.NVarChar, val: user.UserCreditCard });
    parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val:user.UserPhone });
    parameters.push({ name: 'ProfilePicture', type: TYPES.NVarChar, val: user.ProfilePicture });
    // Object.entries(employee).forEach((property)=>{
    //     parameters.push({name:'@'+property[0]})
    // });
    datao=[];
    var query="INSERT INTO dbo.USERDETAILS(FirstName,LastName,UserRole,Email,UserPassword,UserCreditCard,UserPhone,ProfilePicture) values(@FirstName,@LastName,@UserRole,@Email,@UserPassword,@UserCreditCard,@UserPhone,@ProfilePicture);select @@identity as UserID;";
    dbContext.query(query, parameters, false,function (error, data) {
        console.log(data);
        //return response(data, error);
        datao= data;
        console.log(datao);
        return res.json(data);
    });
      res.status(httpStatus.CREATED);
    
     //return res.json(usr);
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
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
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
