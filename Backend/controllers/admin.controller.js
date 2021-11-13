const { json } = require('body-parser');
const httpStatus = require('http-status');
const { omit } = require('lodash');
var Promise = require('bluebird');
const User = Promise.promisifyAll(require('../models/user/user.model'));
const Admin = Promise.promisifyAll(require('../models/admin.model'));
var TYPES = require('tedious').TYPES;
var response = require('../utils/response');
const dbContext = require('../database/dbContext');
const { transform } = require('../models/user/user.model');
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
            const vhc = await Admin.editVehicle(vehicleDtls,userid);
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
        const vehicle = await Admin.createVehicle(vehicleDtls,userid);

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
