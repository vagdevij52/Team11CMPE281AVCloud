const { json } = require('body-parser');
const httpStatus = require('http-status');
const { omit } = require('lodash');
var Promise = require('bluebird');
const User = Promise.promisifyAll(require('../models/user/user.model'));
const Admin = Promise.promisifyAll(require('../models/admin.model'));
var TYPES = require('tedious').TYPES;
var response = require('../utils/response');
const dbContext = require('../database/dbContext');
const APIError = require('../errors/api-error');
const { transform } = require('../models/user/user.model');
const { MongoClient } = require('mongodb');

/**
 * Get user ride history details
 * @apiParam  {INT}        userid     User's ID
 * @apiParam  {String}     role       User's role
 * @public
 */
exports.getUserList = async (req, res, next) => {
    try {
        const users = await Admin.getUsersList();
        return res.json(users);
    } catch (error) {
        next(error);
    }
};
exports.getVehiclesList = async (req, res, next) => {
    try {

        const vehicles = await Admin.getVehiclesList();

        if (vehicles) {
            res.status(httpStatus.OK);
            return res.json(vehicles);
        }
        throw new APIError({
            status: httpStatus.BAD_REQUEST,
            message: 'No vehicle data available',
        });
    } catch (error) {
        return next(error);
    }
};
exports.editProfile = async (req, res, next) => {
    // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
    //const updatedUser = omit(req.body, ommitRole);
    const updatedUser = await Admin.user(req.body);
     // const userDtls = await Admin.user(req.body);
    //console.log(updatedUser);
    const userId = req.params.userId;
    //const user = Object.assign(req.locals.user, updatedUser);
    //const userExists = await Admin.getUser(userid);
    const userExists = await Admin.getUser(userId);
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
exports.editUser = async (req, res, next) => {
    try {
        const userid = req.params.userId;
        const userExists = await Admin.getUser(userid);
        if (userExists) {
            req.body.UserID = userid;
            const userDtls = await Admin.user(req.body);
            //console.log("userdeta");
            //console.log(userDtls);
            const user = await Admin.editUser(userDtls);
            if (user) {
                res.status(httpStatus.OK);
                return res.json(user);
            }
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No user data available',
            });
        }
        else {
            return res.json({
                msg: 'failure! user not found'
            });
        }
    } catch (error) {
        return next(error);
    }

};
exports.createUser = async (req, res, next) => {
    try {
        const userDtls = await Admin.user(req.body);
        const user = await Admin.createUser(userDtls);

        if (user) {
            res.status(httpStatus.OK);
            return res.json(user);
        }
        throw new APIError({
            status: httpStatus.BAD_REQUEST,
            message: 'No user data available',
        });
    } catch (error) {
        return next(error);
    }
};
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userExists = await Admin.getUser(userId);
        if (userExists) {
            const user = await Admin.deleteUser(userId);

            if (user) {
                res.status(httpStatus.OK);
                return res.json(user);
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
    } catch (error) {
        return next(error);
    }
};
exports.editVehicle = async (req, res, next) => {
    try {
        const vehicleId = req.params.vehicleId;
        var userid = null;
        //console.log(req.user);
        if (req.user) {
            //console.log(req.user);
            //console.log(req.user.UserID);
            userid = req.user.UserID;
        }
        if (!userid) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No User data available',
            });
        }
        const vehicleExists = await Admin.getVehicle(vehicleId);
        if (vehicleExists) {
            req.body.VehicleID = vehicleId;
            const vehicleDtls = await Admin.vehicle(req.body);
            ////console.log("userdeta");
            ////console.log(vehicleDtls);
            const vhc = await Admin.editVehicle(vehicleDtls, userid);
            if (vhc) {
                res.status(httpStatus.OK);
                return res.json(vhc);
            }
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No vehicle data available',
            });
        }
        else {
            return res.json({
                msg: 'failure! vehicle not found'
            });
        }
    } catch (error) {
        return next(error);
    }

};
exports.createVehicle = async (req, res, next) => {
    try {
        const vehicleDtls = await Admin.vehicle(req.body);
        var userid = null;
        ////console.log(req.user);
        if (req.user) {
            ////console.log(req.user);
            ////console.log(req.user.UserID);
            userid = req.user.UserID;
        }
        if (!userid) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No User data available',
            });
        }
        const vehicle = await Admin.createVehicle(vehicleDtls, userid);

        if (vehicle) {
            res.status(httpStatus.OK);
            return res.json(vehicle);
        }
        throw new APIError({
            status: httpStatus.BAD_REQUEST,
            message: 'No user data available',
        });
    } catch (error) {
        return next(error);
    }
};
exports.deleteVehicle = async (req, res, next) => {
    try {
        const vehicleId = req.params.vehicleId;

        const vehicleExists = await Admin.getVehicle(vehicleId);
        if (vehicleExists) {
            const vehicle = await Admin.deleteVehicle(vehicleId);

            if (vehicle) {
                res.status(httpStatus.OK);
                return res.json(vehicle);
            }
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No vehicle data available',
            });
        } else {
            return res.json({
                msg: 'failure! vehicle not found'
            });
        }
    } catch (error) {
        return next(error);
    }
};
exports.getAllRidesList = async (req, res, next) => {
    try {

        const rides = await Admin.getAllRides();

        if (rides) {
            res.status(httpStatus.OK);
            return res.json(rides);
        }
        throw new APIError({
            status: httpStatus.BAD_REQUEST,
            message: 'No rides data available',
        });
    } catch (error) {
        return next(error);
    }
};
exports.deleteRide = async (req, res, next) => {
    try {
        //first check if ride id exists and then delete it
        const getRideDtls = await Admin.getRideById(req.params.rideId, false);
        //console.log(getRideDtls);
        if (getRideDtls.RideID) {
            const rides = await Admin.deleteRide(req.params.rideId);
            if (rides) {
                res.status(httpStatus.OK);
                return res.json(rides);
            }
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Error deleting a ride',
            });
        }
        else {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No rides data available',
            });
        }
    } catch (error) {
        return next(error);
    }
};
exports.cancelRide = async (req, res, next) => {
    try {
        //first check if ride id exists and then delete it
        const getRideDtls = await Admin.getRideById(req.params.rideId, true);
        if (getRideDtls.RideID) {
            const rides = await Admin.cancelRide(req.params.rideId);
            if (rides) {
                res.status(httpStatus.OK);
                return res.json(rides);
            }
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'Error cancelling a ride',
            });
        }
        else {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No rides data available',
            });
        }
    } catch (error) {
        return next(error);
    }
};
exports.getAllRides = async (req, res, next) => {
    try {

        const rides = await Admin.getAllRidesData();

        if (rides) {
            return res.json({
                success: true,
                message: rides,
            });
        }

    } catch (error) {
        console.log("Error getting rides: ", error);
        return res.json({
            success: false,
            message: "Error getting rides." + error,
        });
    }
};
exports.getSensorData = async (req, res, next) => {

   

 const uri="mongodb+srv://lakshmi:lakshmi@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority";

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("AVCLOUD");
    //Find all documents in the customers collection:
    dbo.collection("SensorData").find({}).toArray(function(err, result) {
      if (err) throw err;
       res.json(result);
      db.close();
    });
  });
  
};