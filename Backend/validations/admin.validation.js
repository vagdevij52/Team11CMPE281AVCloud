
const { join } = require('bluebird');
const Joi = require('joi');

module.exports = {

    editUser:
    {
        params: {
            userId: Joi.number()
                .required(),
        }
    },
    editVehicle:
    {
        params: {
            vehicleId: Joi.number()
                .required(),
        }
    },
    deleteRide:
    {
        params: {
            rideId: Joi.number()
                .required(),
        }
    },
    updateUser: {
        body: {
         // Email: Joi.string().email().required(),    
          FirstName: Joi.string().max(128).required(),
          LastName: Joi.string().max(128),
          UserPhone:Joi.string().max(12).required(),
         // role: Joi.string().valid(User.roles),
         // mobile: Joi.number().min(10).max(10).required()
        },
        params: {
          userId: Joi.number().required(),
        },
      },
    createUser:
    {
        body:
        {
            FirstName: Joi.string()
                .required(),
            LastName: Joi.string()
                .required(),
            UserRole: Joi.string()
                .required(),
            Email: Joi.string().email()
                .required(),
            UserPassword: Joi.string()
                .required(),
            UserPhone: Joi.string()
                .required()
        }
    },
    createVehcl:
    {
        body:
        {
            //vehicleId:Joi.number().required(),
            VehicleNum: Joi.string()
                .required(),
            VehicleModel: Joi.string(),
            VehicleMake: Joi.string(),
            VehicleColor: Joi.string(),
            VehicleMileage: Joi.number(),
            VehicleSize: Joi.string(),
            VehicleScheduleStatus: Joi.string()
                .required(),
            VehicleStatus: Joi.string(),
            VehicleSeatingCapacity: Joi.number(),
            VehicleDistanceDriven: Joi.number(),
            VehicleApprovalStatus: Joi.string()
                .required(),
        }
    }
};