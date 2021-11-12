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

/**
* User Roles
*/


/**
 * User Model
 * @private
 */
const Employee = {
  title: TYPES.VarChar,
  description: TYPES.VarChar
}


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
      //console.log("hey wat");
      if (user && await this.passwordMatches(password, user[0].UserPassword)) {
        return { user, accessToken:await this.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken:await this.token() };
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
        //console.log(data);
        resolve(data);
        if (error) {
          reject();
        }
        //return response(data, error);
        //datao= data;
        // ////console.log(datao);
        return data;
      });
    });
  },
  async passwordMatches(password, pswd) {
   // //console.log(password);
    ////console.log(pswd);
    // return bcrypt.compare(password, this.password);
    return password == pswd;
  },
  roles: ['user', 'admin'],
  userModel: function (userDetails) {

    var user = {
      name: userDetails.name,
      email: userDetails.email,
      password: userDetails.password,
      //services="",
      role: userDetails.role,
      mobile: userDetails.mobile
    };
    return user;
    //picture=userDetails.picture,
    //createTimestamp=Date.now(),
    //modifyTimestamp=Date.now()
  },
  createuser: function (user) {
    //var fn=Promise.promisify(user);

    //console.log(user.FirstName);
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
      //console.log(data);
      //return response(data, error);
      //datao= data;
      //console.log(datao);
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
  getUser: function (myID, callback) {
    var sql = 'SELECT * FROM flori WHERE id= ?';
    db.query(sql, myID, function (err, data, fields) {
      if (err) throw err;
      return callback(data[0]);
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
  deleteUser: function (flowerID, callback) {
    var sql = 'DELETE FROM flori WHERE id = ';
    db.query(sql, flowerID, function (err, data) {
      if (err) throw err;
      return callback(data);
    });
  },
  editUser: async function (editID, callback) {
    var sql = `SELECT * FROM flori WHERE id= ?`;
    db.query(sql, editID, function (err, data) {
      if (err) throw err;
      return callback(data[0]);
    });
  },
  updateUser: function (updateFlower, myID, callback) {

    var sql = `UPDATE flori SET ? WHERE id= ?`;
    db.query(sql, [updateFlower, myID], function (err, data) {
      if (err) throw err;
      return callback(data);
    });
  },
  async transform(data) {
     // return new Promise((resolve, reject) => {
    const transformed = {};
    const fields = ['UserID', 'FirstName', 'LastName', 'UserRole', 'Email', 'UserPassword', 'UserCreditCard', 'UserPhone', 'ProfilePicture'];
    ////console.log("wasfff");
    ////console.log(data[0].UserID);
    if (data != null && data[0] != null) {
      fields.forEach((field) => {
        transformed[field] = data[0][field];
      });
    }
    return transformed;
    //});
  },
  async token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    var sec="bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4";
    ////console.log(sec);
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