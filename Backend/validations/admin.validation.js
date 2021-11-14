
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
            Email: Joi.string()
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