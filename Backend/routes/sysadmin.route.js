const express = require('express');
const validate = require('express-validation');
const { validationResult } = require('express-validator');
const controller = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../middlewares/auth');
const { createVehicle, deleteVehicle } = require('../models/admin.model');
const {
  createUser,
  editUser,
  editVehicle,
  createVehcl
} = require('../validations/admin.validation');


const router = express.Router();
/**
 * Load user when API with userId route parameter is hit
 */
 router.param('userId', userController.load);
/**
 * Load user when API with userId route parameter is hit
 */
//router.param('userId', controller.load);
router
  .route('/users/:userId?') 
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
  .get(authorize(ADMIN),controller.getUserList)
  .put(authorize(ADMIN),validate(editUser),controller.editUser)
  .post(authorize(ADMIN),validate(createUser),controller.createUser)
  .delete(authorize(ADMIN),validate(editUser),controller.deleteUser);

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
  .get(authorize(ADMIN), controller.getVehiclesList)
  .put(authorize(ADMIN),validate(editVehicle),controller.editVehicle)
  .post(authorize(ADMIN),validate(createVehicle),controller.createVehicle)
  .delete(authorize(ADMIN),validate(editVehicle),controller.deleteVehicle);
  ;
  
  /**
  * Load user when API with userId route parameter is hit
  */
 //router.param('userId', controller.load);
 router
   .route('/rides') 
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
   .get(authorize(ADMIN),controller.getAllRidesList);

  module.exports = router;
