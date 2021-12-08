const { json } = require('body-parser');
const httpStatus = require('http-status');
const { omit } = require('lodash');
var Promise = require('bluebird');
const Admin = Promise.promisifyAll(require('../models/admin.model'));
const Owner = Promise.promisifyAll(require('../models/owner.model'));
var TYPES = require('tedious').TYPES;
var response = require('../utils/response');
const APIError = require('../errors/api-error');
const dbContext = require('../database/dbContext');
const { transform } = require('../models/user/user.model');
/**
 * Get user ride history details
 * @apiParam  {INT}        userid     User's ID
 * @apiParam  {String}     role       User's role
 * @public
 */

exports.getRidesList = async (req, res, next) => {
    try {
        var userid = null;
       
        if (req.user) {
          
            userid = req.user.UserID;
        }
        if (!userid) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No User data available',
            });
        }

        const vehicles = await Owner.getAllRides(userid, req.params.vehicleId);

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
        const vehicleExists = await Owner.getVehicleById(vehicleId,userid);
        
        if (vehicleExists) {
            //console.log("vehicle ex");
            req.body.VehicleID = vehicleId;
            const vehicleDtls = await Admin.vehicle(req.body);
            //console.log("userdeta"+userid);
            //console.log(vehicleDtls);
            const vhc = await Owner.editVehicleById(vehicleDtls, userid);
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
exports.createVehicleById = async (req, res, next) => {
    try {
        const vehicleDtls = await Admin.vehicle(req.body);
        const userid = req.params.userId;
        //var userid = null;
      //  console.log(req.user);
        // if (req.user) {
        //     ////console.log(req.user);
        //     ////console.log(req.user.UserID);
        //     userid = req.user.UserID;
        // }
        if (!userid) {
            throw new APIError({
                status: httpStatus.BAD_REQUEST,
                message: 'No User data available',
            });
        }
        const vehicle = await Owner.createVehicleById(vehicleDtls, userid);

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
            const vehicle = await Owner.deleteVehicleById(vehicleId);

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
exports.getVehicleById = async (req, res, next) => {
    try {

        const vehicleDtls = await Admin.vehicle(req.body);
        const vehicleId = req.params.vehicleId;
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
        //  const vehicleId = req.params.vehicleId;
        const rides = await Owner.getVehicleById(vehicleId, userid);

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
