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
            ProfilePicture: data.ProfilePicture,
            Gender: data.Gender,
            ProfilePicture: data.ProfilePicture,
            Birthday: data.Birthday,
            //UserName: data.UserName
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
            VehcileApprovalStatus,
            VehcileType
        } = data;
    },
    async getUsersList() {
        return new Promise((resolve, reject) => {
            var parameters = [];
            //////console.log("userid"+myID);           
            var sql = "SELECT * FROM AVCLOUD.dbo.USERDETAILS ORDER BY UserID DESC;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve(data);
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async getVehiclesList() {
        return new Promise((resolve, reject) => {
            var parameters = [];
            ////console.log("userid"+myID);           
            var sql = "SELECT * FROM AVCLOUD.dbo.VEHICLEDETAILS ORDER BY 1 DESC;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async editUser(userData) {
        //console.log("useredit");
        //console.log("useredit");
        //console.log(userData);
        //console.log(userData.UserID );
        //const { userId, firstname, lastname, role, email, phone } = {userData.userID,userData.FirstName,userData.LastName,userData.UserRole,userData.Email,;
        return new Promise((resolve, reject) => {
            var parameters = [];

            parameters.push({ name: 'UserID', type: TYPES.Int, val: userData.UserID });
            parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: userData.FirstName });
            parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: userData.LastName });
            parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: userData.UserRole });
            parameters.push({ name: 'Email', type: TYPES.NVarChar, val: userData.Email });
            parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val: userData.UserPhone });
            var sql = "UPDATE AVCLOUD.dbo.USERDETAILS SET FirstName=@FirstName,LastName=@LastName,UserRole=@UserRole,Email=@Email,UserPhone=@UserPhone WHERE UserID=@UserID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success' });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async createUser(userData) {        
        return new Promise((resolve, reject) => {
            var parameters = [];         
            parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: userData.FirstName });
            parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: userData.LastName });
            parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: userData.UserRole });
            parameters.push({ name: 'Email', type: TYPES.NVarChar, val: userData.Email });
            parameters.push({ name: 'UserPassword', type: TYPES.NVarChar, val: userData.UserPassword });
            parameters.push({ name: 'UserCreditCard', type: TYPES.NVarChar, val: userData.UserCreditCard });
            parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val: userData.UserPhone });
            parameters.push({ name: 'ProfilePicture', type: TYPES.NVarChar, val: userData.ProfilePicture });
            parameters.push({ name: 'Gender', type: TYPES.NVarChar, val: userData.Gender });
            parameters.push({ name: 'Birthday', type: TYPES.NVarChar, val: userData.Birthday });
           // parameters.push({ name: 'UserName', type: TYPES.NVarChar, val: userData.UserName });
            var sql = "INSERT INTO dbo.USERDETAILS(FirstName,LastName,UserRole,Email,UserPassword,UserCreditCard,UserPhone,ProfilePicture,Gender,Birthday) values(@FirstName,@LastName,@UserRole,@Email,@UserPassword,@UserCreditCard,@UserPhone,@ProfilePicture,@Gender,@Birthday);select @@identity as UserID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else{
                    resolve({ msg: 'failed ' + error });
                    throw new APIError(error);
                }
            });
        });
    },   
    async deleteUser(userId) {
        //console.log("dddd"+userId);
        return new Promise((resolve, reject) => {
            var parameters = [];
            parameters.push({ name: 'UserID', type: TYPES.Int, val: userId });
            var sql = "DELETE FROM AVCLOUD.dbo.USERDETAILS WHERE UserID=@UserID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success' });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async editVehicle(vehicleData, userID) {
        ////console.log("useredit");
        //console.log("useredit");
        //console.log(vehicleData);
        //console.log(vehicleData.VehicleID );
        //const { userId, firstname, lastname, role, email, phone } = {userData.userID,userData.FirstName,userData.LastName,userData.UserRole,userData.Email,;
        return new Promise((resolve, reject) => {
            var parameters = [];

            parameters.push({ name: 'VehicleID', type: TYPES.Int, val: vehicleData.VehicleID });
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
    async createVehicle(vehicleData, userID) {
        //console.log("dfg");
        //console.log(vehicleData);
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
            parameters.push({ name: 'VehicleOwnerID', type: TYPES.Int, val: userID });
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
    async deleteVehicle(vehicleId) {
        ////console.log("dddd"+vehicleId);
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
    async getAllRides() {
        return new Promise((resolve, reject) => {
            var parameters = [];
            ////console.log("userid"+myID);           
            var sql = "SELECT * FROM AVCLOUD.dbo.VEHICLERIDEDETAILS WHERE RideStatus IS NOT NULL ORDER BY 1 DESC;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else
                    //resolve(res.sendStatus(404));
                    throw new APIError(error);
            });
        });
    },
    async getUser(myID) {
        return new Promise((resolve, reject) => {
            var parameters = [];
            ////console.log("userid"+myID);
            parameters.push({ name: 'UserID', type: TYPES.Int, val: myID });
            var sql = "SELECT * FROM AVCLOUD.dbo.USERDETAILS WHERE UserID=@UserID;";
            dbContext.query(sql, parameters, false, function (err, data, fields) {
                if (err) throw err;
                ////console.log(data);
                ////console.log("why"+data[0].FirstName);
                if (data && data[0]) resolve(data[0]);
                else if (!data && !err) resolve();
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
                ////console.log(data);
                //////console.log("why"+data[0].FirstName);
                if (data && data[0]) resolve(data[0]);
                else if (!data && !err) resolve();
            });
        });
    },
    async deleteRide(rideId) {
        ////console.log("dddd"+vehicleId);
        return new Promise((resolve, reject) => {
            var parameters = [];
            parameters.push({ name: 'RideID', type: TYPES.Int, val: rideId });
            var sql = "DELETE FROM AVCLOUD.dbo.VEHICLERIDEDETAILS WHERE RideID=@RideID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else if (error)
                    throw new APIError(error);
                else {
                    resolve({ msg: 'success! no ride data available' });
                }

            });
        });
    },
    async cancelRide(rideId) {
        ////console.log("dddd"+vehicleId);
        return new Promise((resolve, reject) => {
            var parameters = [];
            parameters.push({ name: 'RideID', type: TYPES.Int, val: rideId });
            var sql = "UPDATE AVCLOUD.dbo.VEHICLERIDEDETAILS SET RideStatus='cancelled' WHERE RideID=@RideID;";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data) {
                    resolve({ msg: 'success', data });
                } else if (error)
                    throw new APIError(error);
                else {
                    resolve({ msg: 'success! no ride data available' });
                }

            });
        });
    },
    async getRideById(rideId,isCancel) {
      
        return new Promise((resolve, reject) => {
            var parameters = [];
            parameters.push({ name: 'RideID', type: TYPES.Int, val: rideId});
            if(!isCancel)
            var sql = "SELECT * FROM AVCLOUD.dbo.VEHICLERIDEDETAILS WHERE RideID=@RideID AND RideStatus in('completed','booked');";
            if(isCancel)
            var sql = "SELECT * FROM AVCLOUD.dbo.VEHICLERIDEDETAILS WHERE RideID=@RideID AND RideSTatus NOT IN('completed');";
            dbContext.getQuery(sql, parameters, false, function (error, data) {
                if (data && data[0]) {                    
                     resolve({ msg: 'success',RideID: data[0].RideID });
                 } else if(error)                   
                     throw new APIError(error);
                 else{                     
                     resolve({ msg: 'success! no ride data available'});
                 }
                    
            });
        });
    }
};