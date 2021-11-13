 const httpStatus = require('http-status');
 const JwtStrategy = require('passport-jwt').Strategy;
 const passport = require('passport');
 const User = require('../models/user/user.model');
 const APIError = require('../errors/api-error');
 require('../config/passport');
 const ADMIN = 'admin';
 const LOGGED_USER = '_loggedUser';
 const { ExtractJwt } = require('passport-jwt');
 const Promise=require('bluebird');
 var user={};
const handleJWT = (req, res, next, roles) =>async (err, uer, info) => {
 //console.log(req);
  //console.log(res);
  console.log(roles);
  const error = err || info;
  console.log("here "+user);
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) {
      return next(json({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
      }));
    }
    await logIn(user, { session: false });
  } catch (e) {
    console.log("erro "+e);
    return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.userRole === ('admin'|'user') && req.params.userId !== user.UserID.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbiddden';
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }

  req.user = user;
  console.log(req.user);
  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
const jwtOptions = {  
  secretOrKey: "bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4",
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  ignoreExpiration:true,
};

const jwt = async (payload, done) => {
  try {
    console.log(payload);
     await User.getUser(payload.sub,(data)=>{
      console.log("doned"+ data.FirstName);
    //  console.log("donne"+user.FirstName);
      user=data;
      if (data) return done(null, data);
      return done(null, false);
    });
   
  } catch (error) {
    return done(error, false);
  }
};

exports.authorize = (roles = User.roles) => (req, res, next) => passport.authenticate(
  new JwtStrategy(jwtOptions, jwt), { session: false },
  handleJWT(req, res, next, roles),
)(req, res, next);

exports.oAuth = (service) => passport.authenticate(service, { session: false });
