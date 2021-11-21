const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
const dbContext = require('../../database/dbContext');
const { token } = require('morgan');
var TYPES = require('tedious').TYPES;
var response = require('../../utils/response');
var Promise = require('bluebird');
const { request } = require('express');
const { json } = require('body-parser');

/**
* User Roles
*/


/**
 * User Model
 * @private
 */

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
module.exports = {
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findUserByEmail(email);
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      //////console.log("hey wat");
      if (user && await this.passwordMatches(password, user[0].UserPassword)) {
        return { user, accessToken:await this.token(user) };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken:await this.token(user) };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },
  async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      var parameters = [];
      // parameters.push({ name: 'UserID', type: TYPES.INT, val: 1 });
      parameters.push({ name: 'Email', type: TYPES.NVarChar, val: email });
      var query = "SELECT * FROM dbo.USERDETAILS WHERE Email = @Email;";
      dbContext.query(query, parameters, false, function (error, data) {
        //////console.log(data);
        resolve(data);
        if (error) {
          reject();
        }
        //return response(data, error);
        //datao= data;
        // ////////console.log(datao);
        return data;
      });
    });
  },
  async passwordMatches(password, pswd) {
   // ////console.log(password);
    //////console.log(pswd);
    // return bcrypt.compare(password, this.password);
    return password == pswd;
  },
  roles: ['user', 'admin','carowner','sysadmin'],
  userModel: function (userDetails) {

    var user = {
      FirstName:userDetails.FirstName,
      LastName:userDetails.LastName,     
      UserRole:userDetails.UserRole,
      Email:userDetails.Email,  
      UserPassword:userDetails.UserPassword,
      UserCreditCard:userDetails.UserCreditCard,
      UserPhone:userDetails.UserPhone,
      ProfilePicture:userDetails.ProfilePicture,
      Gender:userDetails.Gender,
      Birthday:userDetails.Birthday,
     // UserName:data.UserName    
    };
    return user;
  
  },
  
  createuser: function (user) {
    //var fn=Promise.promisify(user);

    ////console.log(user.FirstName);
    var parameters = [];
    // parameters.push({ name: 'UserID', type: TYPES.INT, val: 1 });
    parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: user.FirstName });
    parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: user.LastName });
    parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: user.UserRole });
    parameters.push({ name: 'Email', type: TYPES.NVarChar, val: user.Email });
    parameters.push({ name: 'UserPassword', type: TYPES.NVarChar, val: user.UserPassword });
    parameters.push({ name: 'UserCreditCard', type: TYPES.NVarChar, val: user.UserCreditCard });
    parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val: user.UserPhone });
    parameters.push({ name: 'ProfilePicture', type: TYPES.NVarChar, val: user.ProfilePicture });
    // Object.entries(employee).forEach((property)=>{
    //     parameters.push({name:'@'+property[0]})
    // });

    var query = "INSERT INTO dbo.USERDETAILS(FirstName,LastName,UserRole,Email,UserPassword,UserCreditCard,UserPhone,ProfilePicture) values(@FirstName,@LastName,@UserRole,@Email,@UserPassword,@UserCreditCard,@UserPhone,@ProfilePicture);select @@identity as UserID;";
    dbContext.query(query, parameters, false, function (error, data) {
      ////console.log(data);
      //return response(data, error);
      //datao= data;
      ////console.log(datao);
      return data;
    });

  },
  getUsers: function (callback) {
    var sql = 'SELECT * FROM flori';
    db.query(SQL_USER.CREATE_USER, function (err, data, fields) {
      if (err) throw err;
      return callback(data);
    });
  },
   rideData:function(rideDetails){
     const rideDtls={
    RideStartTime:rideDetails.RideStartTime,
    RideEndTime:rideDetails.RideEndTime,
  //  RideVehicleID:rideDetails.RideVehicleID,
    RideOrigin:rideDetails.RideOrigin,
    RideDestination:rideDetails.RideDestination,
    RideCustomerID:rideDetails.RideCustomerID,
    RideDistance:rideDetails.RideDistance,
    RideAmount:rideDetails.RideAmount,
    RideStatus:rideDetails.RideStatus,
    RideVehicleType:rideDetails.VehicleType
     };
     return rideDtls;
  },
  scheduleRide: function (rideDetails, callback) {
    return new Promise((resolve, reject) => {
    var parameters=[]; 
    var vehicleID="";  

    //var sql1 = "SELECT top 1 * from VEHICLEDETAILS WHERE VehicleType= '"+rideDetails.RideVehicleType+"' AND VehcileScheduleStatus='idle'";
    var sql1 = "SELECT top 1 VehcileID from VEHICLEDETAILS WHERE VehicleType= 'sedan' AND VehcileScheduleStatus='idle'";
    dbContext.getQuery(sql1, parameters,false, function (err, data, fields) {
    //  if (err) console.log(err); 
    //  var jsondata=JSON.stringify(data[0]);
     // console.log(JSON.stringify(data[0]));
      if(data==null || data[0]==null) reject(callback(err));
      vehicleID=data[0].VehcileID;
      
      parameters.push({ name: 'RideStartTime', type: TYPES.DateTime, val: rideDetails.RideStartTime });
     // parameters.push({ name: 'RideEndTime', type: TYPES.DateTime, val: rideDetails.RideEndTime });
      parameters.push({ name: 'RideVehicleID', type: TYPES.Int, val: vehicleID });
      parameters.push({ name: 'RideOrigin', type: TYPES.NVarChar, val: rideDetails.RideOrigin });
      parameters.push({ name: 'RideDestination', type: TYPES.NVarChar, val: rideDetails.RideDestination });
      parameters.push({ name: 'RideCustomerID', type: TYPES.Int, val: rideDetails.RideCustomerID });
      parameters.push({ name: 'RideDistance', type: TYPES.Float, val: rideDetails.RideDistance });
      parameters.push({ name: 'RideAmount', type: TYPES.Float, val: rideDetails.RideAmount });
      parameters.push({ name: 'RideStatus', type: TYPES.NVarChar, val: 'booked' });
      sql = "INSERT INTO AVCLOUD.dbo.VEHICLERIDEDETAILS(RideStartTime,RideVehicleID,RideOrigin,RideDestination,RideCustomerID,RideDistance,RideAmount,RideStatus) values(@RideStartTime,@RideVehicleID,@RideOrigin,@RideDestination,@RideCustomerID,@RideDistance,@RideAmount,@RideStatus);SELECT @@identity as RideID;UPDATE AVCLOUD.dbo.VEHICLEDETAILS SET VehcileScheduleStatus='booked' WHERE VehcileID="+vehicleID+"";
     // console.log("what");
      dbContext.query(sql, parameters,false, function (err, data, fields) {
        if (err) reject(callback(err));     
        resolve(callback(data));
      });
    });
    
  });
  },
  async editUserProfile(userData,userId) {        
    return new Promise((resolve, reject) => {
        var parameters = [];         
        parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: userData.FirstName });
        parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: userData.LastName });
       // parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: userData.UserRole });
        //parameters.push({ name: 'Email', type: TYPES.NVarChar, val: userData.Email });
      //  parameters.push({ name: 'UserPassword', type: TYPES.NVarChar, val: userData.UserPassword });
        parameters.push({ name: 'Birthday', type: TYPES.Date, val: userData.Birthday });
        parameters.push({ name: 'Gender', type: TYPES.NVarChar, val: userData.Gender });
        parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val: userData.UserPhone });
        parameters.push({ name: 'ProfilePicture', type: TYPES.NVarChar, val: userData.ProfilePicture });
        parameters.push({ name: 'UserID', type: TYPES.Int, val: userId });
        var sql = "UPDATE AVCLOUD.dbo.USERDETAILS SET FirstName=@FirstName,LastName=@LastName,UserPhone=@UserPhone,ProfilePicture=@ProfilePicture,Birthday=@Birthday,Gender=@Gender WHERE UserID=@UserID;select * FROM AVCLOUD.dbo.USERDETAILS WHERE UserID=@UserID;";
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
  getUser: function (myID, callback) {
    return new Promise((resolve, reject) => {
    var parameters=[];    
    //console.log("userid"+myID);
    parameters.push({ name: 'UserID', type: TYPES.Int, val: myID });
    var sql = "SELECT * FROM AVCLOUD.dbo.USERDETAILS WHERE UserID=@UserID;";
    dbContext.query(sql, parameters,false, function (err, data, fields) {
      if (err) throw err;
      //console.log(data);
      ////console.log("why"+data[0].FirstName);
      resolve(callback(data[0]));
    });
  });
  },
  async getTripDetails(userId,callback){
    return new Promise((resolve, reject) => {
      //////console.log("tttt"+ tokenObject.userId);
      //console.log("afff");
     // ////console.log(tokenObject);
      var parameters = [];
   
      var query = "SELECT * FROM AVCLOUD.dbo.VEHICLERIDEDETAILS WHERE RideCustomerID="+userId+" order by RideStartTime desc;";
      dbContext.query(query, parameters, false, function (error, data) {
       // //console.log(data[0]);
       // resolve(data[0]);
        if (error) {
          ////console.log("errr"+error);
           reject(callback(error));
        }     
        resolve(callback(data));
      });
    });
  },
  addUser: async function (userDetails, callback) {
    connection.query(SQL_USER.CREATE_USER,
      [userDetails.name,
      userDetails.password,
      userDetails.role,
      userDetails.email,
      userDetails.mobile], function (err, data) {
        if (err) {
          throw new APIError({
            message: 'Could not create user',
            status: httpStatus.BAD_REQUEST,
          });
        }
        return callback(data);
        //return callback({ user:data, accessToken: token()});
      });
  },
 
  async get(id) {
    let user;

    if (id!=null|| id!="") {
      user = await this.getUser(id,(userData)=>{
        if (userData) {
          return userData;
        }else{
          throw new APIError({
            message: 'User does not exist',
            status: httpStatus.NOT_FOUND,
          });
        }
      });
    }    
  },
  async transform(data) {
     // return new Promise((resolve, reject) => {
    const transformed = {};
    const fields = ['UserID', 'FirstName', 'LastName', 'UserRole', 'Email', 'UserPassword', 'UserCreditCard', 'UserPhone', 'ProfilePicture'];
  
    if (data != null && data[0] != null) {
      fields.forEach((field) => {
        transformed[field] = data[0][field];
      });
    }
    return transformed;
    
  },
  
  async token(user) {
    //console.log("user");
    var userId='';
    if(user!=null&& user[0]!=null){
      userId=user[0].UserID;
    }
    //console.log(user);
    const payload = {
      exp: moment().add(15, 'hours').unix(),
      iat: moment().unix(),
      sub: userId,
    };
    //console.log("payload"+payload.sub);
    var sec="bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4";
    //////console.log(sec);
    return jwt.encode(payload, sec);
  },

  checkDuplicateEmail(error) {
    if (error) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
  oAuthLogin: async function ({
    service, id, email, name, picture,
  }) {
    // const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    const user = "";
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },

}