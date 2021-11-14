const express = require('express');
const validate = require('express-validation');
const { validationResult } = require('express-validator');
const controller = require('../controllers/owner.controller');
const { authorize, ADMIN, LOGGED_USER, CAR_OWNER } = require('../middlewares/auth');
const { createVehicle, deleteVehicle } = require('../models/owner.model');
const {
    createUser,
    editUser,
    editVehicle,
    createVehcl
} = require('../validations/admin.validation');

const router = express.Router();
//router.param('vehicleId', controller.load);

/**
 * Load user when API with userId route parameter is hit
 */
//router.param('userId', controller.load);
router
    .route('/rides/:vehicleId?')
    /**
     * @api {post} v1/users Create User
     * @apiDescription Create a new user
     * @apiVersion 1.0.0
     * @apiName CreateUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin,owner}  [role]    User's role
     * @apiParam  {String=mobile number}  [phone number]    User's mobile number   
     *
     * @apiSuccess (Created 201) {String}  id         User's id
     * @apiSuccess (Created 201) {String}  name       User's name
     * @apiSuccess (Created 201) {String}  email      User's email
     * @apiSuccess (Created 201) {String}  role       User's role
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
    .get(authorize(CAR_OWNER), controller.getRidesList);

/**
 * Load user when API with userId route parameter is hit
 */
//router.param('userId', controller.load);
router
    .route('/vehicles/:vehicleId?')
    /**
     * @api {post} v1/users Create User
     * @apiDescription Create a new user
     * @apiVersion 1.0.0
     * @apiName CreateUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin,owner}  [role]    User's role
     * @apiParam  {String=mobile number}  [phone number]    User's mobile number   
     *
     * @apiSuccess (Created 201) {String}  id         User's id
     * @apiSuccess (Created 201) {String}  name       User's name
     * @apiSuccess (Created 201) {String}  email      User's email
     * @apiSuccess (Created 201) {String}  role       User's role
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
    .get(authorize(CAR_OWNER), controller.getVehicleById)
    .put(authorize(CAR_OWNER), validate(editVehicle), controller.editVehicle)
    .post(authorize(CAR_OWNER), validate(createVehcl), controller.createVehicleById)
    .delete(authorize(CAR_OWNER), validate(editVehicle), controller.deleteVehicle);
;

module.exports = router;
