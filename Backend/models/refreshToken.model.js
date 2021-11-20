
const crypto = require('crypto');
const moment = require('moment-timezone');
var TYPES = require('tedious').TYPES;
const dbContext = require('../database/dbContext');
const { resolve } = require('path');
const { promisify } = require('bluebird');
/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = {
  refreshToken: {
    token: TYPES.VarChar,
    UserID: TYPES.VarChar,
    Email: TYPES.VarChar,
    expires: TYPES.VarChar,
  },
/**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {RefreshToken}
   */
 async generate(user) {
 // return new Promise((resolve, reject) => {
   ////console.log("ss");
   ////console.log(user);
  const userId = user.UserID;
  ////console.log("ddd"+userId);
  const userEmail = user.Email;
  const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
  const expires = moment().add(30, 'days').toDate();
  const tokenObject = {
    token:token, userId:userId, Email:userEmail, expires:expires,
  };
  await this.save(tokenObject).then(tl=>{return token});
 // return {token:token};
//});
},
async save(tokenObject){
  return new Promise((resolve, reject) => {
    ////console.log("tttt"+ tokenObject.userId);
   // //console.log(tokenObject);
    var parameters = [];
 
    var query = "UPDATE dbo.USERDETAILS SET token = '"+tokenObject.token+"',expires='"+tokenObject.expires+"' WHERE UserID="+tokenObject.userId+";";
    dbContext.query(query, parameters, false, function (error, data) {
      //console.log("kkk"+data);
      resolve(tokenObject);
      if (error) {
        //console.log("errr"+error);
        //reject();
      }
      //return response(data, error);
      //datao= data;
      // //console.log(datao);
      resolve(data);
    });
  });
}

};



/**
 * @typedef RefreshToken
 */
//const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = refreshTokenSchema;
