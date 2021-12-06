const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../middlewares/auth');
const { createVehicle, deleteVehicle } = require('../models/admin.model');
const {
  createUser,
  editUser,
  editVehicle,
  createVehcl,
  deleteRide,
  updateUser
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
   * @api {get} admin/users Get Users
   * @apiDescription get users list
   * @apiVersion 1.0.0
   * @apiName GetUsers
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization     Admin's access token
   *
   * @apiSuccess (Created 201) {String}   id              User's id
   * @apiSuccess (Created 201) {String}   first name      User's name
   * @apiSuccess (Created 201) {String}   last name       User's name
   * @apiSuccess (Created 201) {String}   email           User's email
   * @apiSuccess (Created 201) {String}   role            User's role
   * @apiSuccess (Created 201) {Date}     createdAt       Timestamp
   *
   * @apiError (Bad Request 400)          ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)         Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)            Forbidden        Only admins can create the data
   */
  .get(authorize(ADMIN),controller.getUserList)
   /**
   * @api {put} admin/users/6 Edit User
   * @apiDescription Edit an existing user
   * @apiVersion 1.0.0
   * @apiName EditUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization     Admin's access token
   *
   * @apiParam  {Number}                  [id]             User's id
   * @apiParam  {String}                  [email]          User's email
   * @apiParam  {String{6..128}}          [password]       User's password
   * @apiParam  {String{..128}}           [first name]     User's first name
   * @apiParam  {String{..128}}           [last name]      User's last name
   * @apiParam  {String=user,admin,owner} [role]           User's role
   * @apiParam  {String}                  [phone number]   User's mobile number   
   * @apiParam  {String}                  [credit card]    User's credit card details   
   * @apiParam  {String}                  [profile pic]    User's profile picture
   *
   * @apiSuccess (Updated 201) {String}   msg              Success message 
   *
   * @apiError (Bad Request 400)          ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)         Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)            Forbidden        Only admins can create the data
   */
  .put(authorize(ADMIN),validate(editUser),controller.editUser)
   /**
   * @api {post} admin/users Create User
   * @apiDescription Create a new user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization     Admin's access token
   *
   * @apiParam  {String}                   [email]         User's email
   * @apiParam  {String{6..128}}           [password]      User's password
   * @apiParam  {String{..128}}            [first name]    User's first name
   * @apiParam  {String{..128}}            [last name]     User's last name
   * @apiParam  {String=user,admin,owner}  [role]          User's role
   * @apiParam  {String}                   [phone number]  User's mobile number   
   * @apiParam  {String}                   [credit card]   User's credit card details   
   * @apiParam  {String}                   [profile pic]   User's profile picture
   *
   * @apiSuccess (Created 201) {String}    id              User's id
   * @apiSuccess (Created 201) {String}    first name      User's name
   * @apiSuccess (Created 201) {String}    last name       User's name
   * @apiSuccess (Created 201) {String}    email           User's email
   * @apiSuccess (Created 201) {String}    role            User's role
   * @apiSuccess (Created 201) {Date}      createdAt       Timestamp
   *
   * @apiError (Bad Request 400)          ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)         Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)            Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN),validate(createUser),controller.createUser)
  /**
   * @api {put} admin/users/6 Edit User
   * @apiDescription Edit an existing user
   * @apiVersion 1.0.0
   * @apiName EditUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization     Admin's access token
   *
   * @apiParam  {Number}                  [id]             User's id
   *
   * @apiSuccess (Updated 201) {String}   msg              Success message 
   *
   * @apiError (Bad Request 400)          ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)         Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)            Forbidden        Only admins can create the data
   */
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
   .route('/rides/:rideId?') 
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
   .get(authorize(ADMIN),controller.getAllRidesList)
   .delete(authorize(ADMIN),validate(deleteRide),controller.deleteRide);
   router
   .route('/sensordata') 
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
   .get(authorize(ADMIN),controller.getSensorData);

   //cancel a ride
   router
   .route('/rides/cancelride/:rideId?') 
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
   .put(authorize(ADMIN),validate(deleteRide),controller.cancelRide);
  
   router
   .route('/profile/:userId')
   .put(authorize(ADMIN),validate(updateUser),controller.editProfile)
   router
    .route("/track/getrides")
    .get(controller.getAllRides);

  module.exports = router;
