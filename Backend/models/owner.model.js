const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../config/vars');
const dbContext = require('../database/dbContext');
const { token } = require('morgan');
var TYPES = require('tedious').TYPES;
var response = require('../utils/response');
var Promise = require('bluebird');
const { request } = require('express');
const { sendDbResponse } = require('../utils/dbUtility');
const { getVehiclesList } = require('../controllers/owner.controller');
module.exports = {
    async user(data) {
        return {
            UserID: data.UserID,
            FirstName: data.FirstName,
            LastName: data.LastName,
            UserRole: data.UserRole,
            Email: data.Email,
            UserPassword: data.UserPassword,
            UserCreditCard: data.UserCreditCard,
            UserPhone: data.UserPhone,
            ProfilePicture: data.ProfilePicture
        };
    },
    async vehicle(data) {
        return {
            VehcileID,
            VehcileNum,
            VehcileModel,
            VehcileMake,
            VehcileColor,
            VehcileMileage,
            VehcileSize,
            VehcileScheduleStatus,
            VehcileStatus,
            VehcileSeatingCapacity,
            VehcileDistanceDriven,
            VehcileApprovalStatus
        } = data;
    },
    async ride(data) {
        const rideDtls = {
            RideStartTime,
            RideEndTime,
            RideVehicleID,
            RideOrigin,
            RideDestination,
            RideCustomerID,
            RideDistance,
            RideAmount,
            RideStatus
        } = data;
        return rideDtls;
    },    
   
    async getAllRides(ownerId, vehicleId) {
        //////console.log("vid"+vehicleId);
        return new Promise((resolve, reject) => {
            var parameters = [];
            ////console.log("userid"+myID);    
            //get rides of all the vehicles owned  
            parameters.push({ name: 'UserID', type: TYPES.Int, val: ownerId });
            if (!vehicleId || vehicleId == "")
                var sql = "SELECT vd.VehicleOwnerID,vrd.* FROM AVCLOUD.dbo.VEHICLERIDEDETAILS vrd JOIN AVCLOUD.dbo.VEHICLEDETAILS vd ON vrd.RideVehicleID=vd.VEHCILEID JOIN AVCLOUD.dbo.USERDETAILS ud ON vd.VehicleOwnerID=ud.UserID WHERE RideStatus IS NOT NULL AND ud.UserRole='carowner' AND  ud.UserID=@UserID ORDER BY 1 DESC;";
            else { //get rides of only specified vehicle
               // //console.log("sdjksfj");
                parameters.push({ name: 'RideVehicleID', type: TYPES.Int, val: vehicleId });
                var sql = "SELECT vd.VehicleOwnerID,vrd.* FROM AVCLOUD.dbo.VEHICLERIDEDETAILS vrd JOIN AVCLOUD.dbo.VEHICLEDETAILS vd ON vrd.RideVehicleID=vd.VEHCILEID JOIN AVCLOUD.dbo.USERDETAILS ud ON vd.VehicleOwnerID=ud.UserID WHERE RideStatus IS NOT NULL AND ud.UserRole='carowner' AND  ud.UserID=@UserID AND vrd.RideVehicleID=@RideVehicleID ORDER BY 1 DESC;";
            }
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                ////console.log("asdsfdf");
                if (data) {
                   // //console.log("asdsfllllllldf");
                    resolve({ msg: 'success', data });
                } else if(error)                   
                    throw new APIError(error);
                else{
                    
                    resolve({ msg: 'success! no ride data available'});
                }
            });
        });
    },
    async getVehicleById(vehicleId,ownerId) {
        return new Promise((resolve, reject) => {
            //console.log("v id"+vehicleId);
            //console.log("u id"+ownerId);
            var parameters = [];
            parameters.push({ name: 'UserID', type: TYPES.Int, val: ownerId });
            parameters.push({ name: 'VehicleID', type: TYPES.Int, val: vehicleId });
            var query = "SELECT * FROM AVCLOUD.dbo.VEHICLEDETAILS WHERE VehcileID=@VehicleID AND VehicleOwnerID=@UserID;";
            dbContext.query(query, parameters, false, function (error, data) {
                if (error) throw error;
                //console.log(data);
                ////console.log("why"+data[0].FirstName);
                if (data && data[0]) resolve(data[0]);
                else if (!data && !error) resolve();
            });
        });
    },
    async editVehicleById(vehicleData,userID) {
        ////console.log("useredit");
        //console.log("useredit");
        //console.log(vehicleData);
        //console.log(vehicleData.VehicleID );
        //const { userId, firstname, lastname, role, email, phone } = {userData.userID,userData.FirstName,userData.LastName,userData.UserRole,userData.Email,;
        return new Promise((resolve, reject) => {           
            var parameters = [];          
            parameters.push({ name: 'VehicleID', type: TYPES.Int, val: vehicleData.VehicleID });
            parameters.push({ name: 'VehcileNum', type: TYPES.NVarChar, val: vehicleData.VehicleNum});
            parameters.push({ name: 'VehcileModel', type: TYPES.NVarChar, val: vehicleData.VehicleModel });
            parameters.push({ name: 'VehcileMake', type: TYPES.NVarChar, val:vehicleData.VehicleMake });
            parameters.push({ name: 'VehcileColor', type: TYPES.NVarChar, val: vehicleData.VehicleColor });
            parameters.push({ name: 'VehcileMileage', type: TYPES.Float, val: vehicleData.VehicleMileage });
            parameters.push({ name: 'VehcileSize', type: TYPES.NChar, val: vehicleData.VehicleSize });
            parameters.push({ name: 'VehcileScheduleStatus', type: TYPES.NVarChar, val: vehicleData.VehcileScheduleStatus });
            parameters.push({ name: 'VehcileStatus', type: TYPES.NVarChar, val: vehicleData.VehicleStatus });
            parameters.push({ name: 'VehcileSeatingCapacity', type: TYPES.Int, val:vehicleData.VehicleSeatingCapacity });
            parameters.push({ name: 'VehcileDistanceDriven', type: TYPES.Float, val: vehicleData.VehicleDistanceDriven });
            parameters.push({ name: 'VehcileApprovalStatus', type: TYPES.NVarChar, val: vehicleData.VehicleApprovalStatus });
            parameters.push({ name: 'VehicleOwnerID', type: TYPES.Int, val: userID });
            var sql = "UPDATE AVCLOUD.dbo.VEHICLEDETAILS SET VehicleOwnerID=@VehicleOwnerID,VehcileNum=@VehcileNum,VehcileModel=@VehcileModel,VehcileMake=@VehcileMake,VehcileColor=@VehcileColor,VehcileMileage=@VehcileMileage,VehcileSize=@VehcileSize,VehcileScheduleStatus=@VehcileScheduleStatus,VehcileStatus=@VehcileStatus,VehcileSeatingCapacity=@VehcileSeatingCapacity,VehcileDistanceDriven=@VehcileDistanceDriven,VehcileApprovalStatus=@VehcileApprovalStatus WHERE VehcileID=@VehicleID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success' });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },     
    async createVehicleById(vehicleData,ownerId) {
        //console.log("dfg");
        ////console.log(vehicleData,ownerId);
        return new Promise((resolve, reject) => {
            var parameters = [];
            parameters.push({ name: 'VehcileNum', type: TYPES.NVarChar, val: vehicleData.VehicleNum });
            parameters.push({ name: 'VehcileModel', type: TYPES.NVarChar, val: vehicleData.VehicleModel });
            parameters.push({ name: 'VehcileMake', type: TYPES.NVarChar, val: vehicleData.VehicleMake });
            parameters.push({ name: 'VehcileColor', type: TYPES.NVarChar, val: vehicleData.VehicleColor });
            parameters.push({ name: 'VehcileMileage', type: TYPES.Float, val: vehicleData.VehicleMileage });
            parameters.push({ name: 'VehcileSize', type: TYPES.NChar, val: vehicleData.VehicleSize });
            parameters.push({ name: 'VehcileScheduleStatus', type: TYPES.NVarChar, val: vehicleData.VehcileScheduleStatus });
            parameters.push({ name: 'VehcileStatus', type: TYPES.NVarChar, val: vehicleData.VehicleStatus });
            parameters.push({ name: 'VehcileSeatingCapacity', type: TYPES.Int, val: vehicleData.VehicleSeatingCapacity });
            parameters.push({ name: 'VehcileDistanceDriven', type: TYPES.Float, val: vehicleData.VehicleDistanceDriven });
            parameters.push({ name: 'VehcileApprovalStatus', type: TYPES.NVarChar, val: vehicleData.VehicleApprovalStatus });
            parameters.push({ name: 'VehicleOwnerID', type: TYPES.Int, val: ownerId });
            var sql = "INSERT INTO dbo.VEHICLEDETAILS(VehcileNum,VehcileModel,VehcileMake,VehcileColor,VehcileMileage,VehcileSize,VehcileScheduleStatus,VehcileStatus,VehcileSeatingCapacity,VehcileDistanceDriven,VehcileApprovalStatus,VehicleOwnerID) values(@VehcileNum,@VehcileModel,@VehcileMake,@VehcileColor,@VehcileMileage,@VehcileSize,@VehcileScheduleStatus,@VehcileStatus,@VehcileSeatingCapacity,@VehcileDistanceDriven,@VehcileApprovalStatus,@VehicleOwnerID);select @@identity as VehicleID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async deleteVehicleById(vehicleId) {
        //console.log("dddd" + vehicleId);
        return new Promise((resolve, reject) => {
            var parameters = [];
            parameters.push({ name: 'VehicleID', type: TYPES.Int, val: vehicleId });
            var sql = "DELETE FROM AVCLOUD.dbo.VEHICLEDETAILS WHERE VehcileID=@VehicleID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success' });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async getUser(myID) {
        return new Promise((resolve, reject) => {
            var parameters = [];
            //console.log("userid" + myID);
            parameters.push({ name: 'UserID', type: TYPES.Int, val: myID });
            var sql = "SELECT * FROM AVCLOUD.dbo.USERDETAILS WHERE UserID=@UserID;";
            dbContext.query(sql, parameters, false, function (err, data, fields) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async getVehicle(myID) {
        return new Promise((resolve, reject) => {
            var parameters = [];
            ////console.log("userid"+myID);
            parameters.push({ name: 'VehicleID', type: TYPES.Int, val: myID });
            var sql = "SELECT * FROM AVCLOUD.dbo.VEHICLEDETAILS WHERE VehcileID=@VehicleID;";
            dbContext.query(sql, parameters, false, function (err, data, fields) {
                if (err) throw err;
                //console.log(data);
                ////console.log("why"+data[0].FirstName);
                if (data && data[0]) resolve(data[0]);
                else if (!data && !err) resolve();
            });
        });
    },


};