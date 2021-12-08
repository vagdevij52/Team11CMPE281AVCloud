const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../models/user/user.model');
const Admin = require('../models/admin.model');
const refreshTokenSchema = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../config/vars');
const APIError = require('../errors/api-error');
const emailProvider = require('../services/emails/emailProvider');

/**
 * Returns a formated object with tokens
 * @private
 */
async function generateTokenResponse(user, accessToken) {
   // return new Promise((resolve, reject) => {
  const tokenType = 'Bearer';
  //////console.log("waddd");
  ////console.log(user);
  const refreshToken = await refreshTokenSchema.generate(user[0]).then(function(data){tkn=>{return token}});
  ////console.log("why");
  ////console.log(refreshToken);
  const expiresIn = moment().add(15, 'hours');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
//});
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userDtls = await Admin.user(req.body);
    const user = await Admin.createUser(userDtls);

    if (user) {
      res.status(httpStatus.OK);
      req.user = user;
      return res.json(user);
    }
    throw new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'No user data available',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
   
    const { user, accessToken } = await User.findAndGenerateToken(req.body);

    const token = await generateTokenResponse(user, accessToken);
    // const userTransformed =await User.transform(user);
    req.locals = {user: user };
    //console.log("loclas ");
    //console.log(req.locals);
    return res.json({ token, user: user });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};
