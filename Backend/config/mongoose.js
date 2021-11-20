const mongoose = require('mongoose');
const logger = require('./logger');
const { mongo, env } = require('./vars');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
// const uri="mongodb+srv://lakshmi:lakshmi@avcloud.v0hfj.mongodb.net/AVCLOUD?retryWrites=true&w=majority";
// exports.connect = () => {
//   mongoose.connect(uri, {
//     useNewUrlParser: true
// }).then(() => {
//     console.log("Mongo DB CONNECTED");
// }).catch(console.log("DB CONNECTED FAILED"))
//   return mongoose.connection;
// };




