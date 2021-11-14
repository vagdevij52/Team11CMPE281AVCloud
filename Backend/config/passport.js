const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const { ExtractJwt } = require('passport-jwt');
const { jwSecret } = require('./vars');
const authProviders = require('../services/authProviders');
const User = require('../models/user/user.model');

const jwtSecrret="bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4";

const jwtOptions = {  
  secretOrKey: "bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4",
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const user = await User.getUser(payload.sub,(data)=>{
      ////console.log("done");
    });
    //console.log("done");
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
   // return "aaaa";
    return done(error, false);
  }
};

const oAuth = (service) => async (token, done) => {
  try {
    const userData = await authProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
