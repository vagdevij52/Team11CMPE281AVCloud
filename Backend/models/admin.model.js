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
};