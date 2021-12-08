var cookieParser = require('cookie-parser');
const dbConnection = require('../dbContext/dbContext');
var TYPES = require('tedious').TYPES;
const ride = require("../routes/ride");
const spawn = require("child_process").spawn;



const login = (email, password) => {
    return new Promise((resolve, reject) => {
        var parameters = [];
       
        parameters.push({ name: 'Email', type: TYPES.NVarChar, val: email });
        parameters.push({ name: 'Password', type: TYPES.NVarChar, val: password });
        const query = 'SELECT * from dbo.USERDETAILS WHERE Email = @Email AND UserPassword = @Password';
    
        dbConnection.query(query, parameters, false, function (error, data) {          
            resolve(data);
            if (error) {
              reject();
            }          
            return data;
          });  
        });
}

const signup = (firstName, lastName, email, password, userrole) => {
    return new Promise((resolve, reject) => {
        var parameters = [];
       
        parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: firstName });
        parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: lastName });
        parameters.push({ name: 'UserRole', type: TYPES.NVarChar, val: userrole });
        parameters.push({ name: 'Email', type: TYPES.NVarChar, val: email });
        parameters.push({ name: 'UserPassword', type: TYPES.NVarChar, val: password });

        const query = 'Insert into dbo.USERDETAILS(FirstName, LastName, UserRole, Email, UserPassword) values(@FirstName,@LastName,@UserRole, @Email, @UserPassword);select @@identity as UserID;';
    
        dbConnection.getQuery(query, parameters, false, function (error, data) {           
            if (data) {
                resolve({ msg: 'successfully inserted', data });
            } else {
                console.log(error);
                reject({ msg: 'Internal_Server_Error ' + error });
            }
          });  
        });
}

const registerVehicle = (carNo, carType, carModel, carColor, userId) => {
    return new Promise((resolve, reject) => {
        var parameters = [];
       
        parameters.push({ name: 'VehicleNum', type: TYPES.NVarChar, val: carNo });
        parameters.push({ name: 'VehicleModel', type: TYPES.NVarChar, val: carModel });
        parameters.push({ name: 'VehicleColor', type: TYPES.NVarChar, val: carColor });
        parameters.push({ name: 'VehicleScheduleStatus', type: TYPES.NVarChar, val: 'idle' });
        parameters.push({ name: 'VehicleStatus', type: TYPES.NVarChar, val: 'active' });
        parameters.push({ name: 'VehicleApprovalStatus', type: TYPES.NVarChar, val: 'approved' });
        parameters.push({ name: 'VehicleOwnerID', type: TYPES.Int, val: userId });
        parameters.push({ name: 'VehicleType', type: TYPES.NVarChar, val: carType });
        parameters.push({ name: 'VehicleSeatingCapacity', type: TYPES.Int, val: 4 });
        parameters.push({ name: 'VehicleDistanceDriven', type: TYPES.Float, val: 0 });



        const query = 'INSERT INTO dbo.VEHICLEDETAILS(VehcileNum,VehcileModel,VehcileColor,VehcileScheduleStatus,VehcileStatus,VehcileApprovalStatus,VehicleOwnerID, VehicleType, VehcileSeatingCapacity, VehcileDistanceDriven) values(@VehicleNum,@VehicleModel,@VehicleColor,@VehicleScheduleStatus,@VehicleStatus,@VehicleApprovalStatus,@VehicleOwnerID,@VehicleType,@VehicleSeatingCapacity,@VehicleDistanceDriven);select @@identity as VehicleID;';
    
        dbConnection.getQuery(query, parameters, false, function (error, data) {           
            if (data) {
                resolve({ msg: 'successfully inserted', data });
            } else {
                console.log(error);
                reject({ msg: 'Internal_Server_Error ' + error });
            }
          });  
        });
}

const getVehicleDetails = (userid) => {
    return new Promise((resolve, reject) => {
        var parameters = [];
       
        parameters.push({ name: 'VehicleOwnerID', type: TYPES.Int, val: userid });        
        const query = 'SELECT * from dbo.VehicleDetails WHERE VehicleOwnerID = @VehicleOwnerID';
    
        dbConnection.query(query, parameters, false, function (error, data) {          
            resolve(data);
            if (error) {
              reject();
            }            
            return data;
          });  
        });
}
const getUserTripDetails = (userId) => {
  return new Promise((resolve, reject) => {
      var parameters = [];
     
      parameters.push({ name: 'UserId', type: TYPES.Int, val: userId });        
      const query = 'SELECT * FROM AVCLOUD.dbo.VEHICLERIDEDETAILS WHERE RideCustomerID=@UserId order by RideStartTime desc;';
  
      dbConnection.query(query, parameters, false, function (error, data) {          
          resolve(data);
          if (error) {
            reject();
          }            
          return data;
        });  
      });
}


const getVehicleRideDetails = (vehicleId) => {
    return new Promise((resolve, reject) => {
        var parameters = [];
       
        parameters.push({ name: 'RideVehicleID', type: TYPES.Int, val: vehicleId });        
        const query = 'SELECT * from dbo.VEHICLERIDEDETAILS WHERE RideVehicleID = @RideVehicleID';
    
        dbConnection.query(query, parameters, false, function (error, data) {          
            resolve(data);
            if (error) {
              reject();
            }            
            return data;
          });  
        });
}

const getAllVehicleDetails = () => {
    return new Promise((resolve, reject) => {
        var parameters = [];               
        const query = 'SELECT * from dbo.VehicleDetails';
    
        dbConnection.query(query, parameters, false, function (error, data) {          
            resolve(data);
            if (error) {
              reject();
            }            
            return data;
          });  
        });
}

const bookRide = (userId, vehicleId, source, destination, fare) => {
    return new Promise((resolve, reject) => {
      

        var parameters = [];
       
        parameters.push({ name: 'VehcileID', type: TYPES.Int, val: vehicleId });
        parameters.push({ name: 'VehcileScheduleStatus', type: TYPES.NVarChar, val: 'booked' });

        const query = 'Update dbo.VEHICLEDETAILS set VehcileScheduleStatus = @VehcileScheduleStatus where VehcileID = @VehcileID;';
    
        dbConnection.getQuery(query, parameters, false, function (error, data) {           
            if (data) {
                var parameters1 = [];       
                parameters1.push({ name: 'UserID', type: TYPES.Int, val: userId });
                parameters1.push({ name: 'VehcileID', type: TYPES.Int, val: vehicleId });
                parameters1.push({ name: 'RideStartTime', type: TYPES.DateTime, val: new Date() });
                parameters1.push({ name: 'RideEndTime', type: TYPES.DateTime, val: new Date() });
                parameters1.push({ name: 'RideOrigin', type: TYPES.NVarChar, val: source });
                parameters1.push({ name: 'RideDestination', type: TYPES.NVarChar, val: destination });
                parameters1.push({ name: 'RideDistance', type: TYPES.Float, val: 0 });
                parameters1.push({ name: 'RideAmount', type: TYPES.Float, val: fare});
                parameters1.push({ name: 'RideStatus', type: TYPES.NVarChar, val: 'booked' });

                const query = 'Insert into VEHICLERIDEDETAILS(RideStartTime, RideEndTime, RideVehicleID, RideOrigin, RideDestination, RideCustomerID, RideDistance, RideAmount, RideStatus) values(@RideStartTime, @RideEndTime, @VehcileID, @RideOrigin, @RideDestination, @UserID, @RideDistance, @RideAmount, @RideStatus);select @@identity as rideId;'
    
                dbConnection.getQuery(query, parameters1, false, function (error, data) {           
                    if (data) {                        
                      const rideId = data[0].rideId;
                      const pythonProcess = spawn('python',["/opt/carla-simulator/PythonAPI/examples/carlaMain.py", '--trip_id=' + rideId]);
                      pythonProcess.stdout.on('data', (data) => {
                          console.log(`stdout: ${data}`);
                      });
                    
                      pythonProcess.stderr.on('data', (data) => {
                          console.error(`stderr: ${data}`);
                      });
                    
                      pythonProcess.on('close', (code) => {
                          console.log(`child process exited with code ${code}`);
                      });
                      resolve({ msg: 'successfully inserted', data });
                    } else {
                        console.log(error);
                        reject({ msg: 'Internal_Server_Error ' + error });
                    }
                  });  
                
                
            } else {
                console.log(error);
                reject({ msg: 'Internal_Server_Error ' + error });
            }
          });  
        });


}

const getAllUserDetails = () => {
    return new Promise((resolve, reject) => {
        var parameters = [];               
        const query = 'SELECT * from dbo.UserDetails';
    
        dbConnection.query(query, parameters, false, function (error, data) {          
            resolve(data);
            if (error) {
              reject();
            }            
            return data;
          });  
        });
}

const saveUserDetails = (userId, firstName, lastName, birthday, gender, phone) => {
    return new Promise((resolve, reject) => {
        var parameters = [];       
        
        parameters.push({ name: 'UserID', type: TYPES.Int, val: userId });
        parameters.push({ name: 'FirstName', type: TYPES.NVarChar, val: firstName });
        parameters.push({ name: 'LastName', type: TYPES.NVarChar, val: lastName });
        parameters.push({ name: 'Birthday', type: TYPES.DateTime, val: new Date() });
        parameters.push({ name: 'Gender', type: TYPES.NVarChar, val: gender });
        parameters.push({ name: 'UserPhone', type: TYPES.NVarChar, val: phone });


        const query = 'update dbo.USERDETAILS set FirstName = @FirstName, LastName = @LastName, UserPhone = @UserPhone, Gender = @Gender, Birthday = @Birthday where UserID = @UserID;';
    
        dbConnection.getQuery(query, parameters, false, function (error, data) {           
            if (data) {                                     
                resolve({ msg: 'successfully inserted', data });              
            } else {
                console.log(error);
                reject({ msg: 'Internal_Server_Error ' + error });
            }
          });  
        });
}

const repairVehicle = (vehicleId) => {
  return new Promise((resolve, reject) => {
      var parameters = [];             
      parameters.push({ name: 'VehicleId', type: TYPES.Int, val: vehicleId });
      parameters.push({ name: 'Status', type: TYPES.NVarChar, val: 'Repair' });

      const query = 'update dbo.VEHICLEDETAILS set VehcileStatus = @Status where VehcileID = @VehicleId;';
  
      dbConnection.getQuery(query, parameters, false, function (error, data) {           
          if (data) {                                     
              resolve({ msg: 'successfully inserted', data });              
          } else {
              console.log(error);
              reject({ msg: 'Internal_Server_Error ' + error });
          }
        });  
      });
}

const getUserDetails = (userid) => {
    return new Promise((resolve, reject) => {
        var parameters = [];       
        parameters.push({ name: 'UserID', type: TYPES.Int, val: userid });        
        const query = 'SELECT * from dbo.USERDETAILS WHERE UserID = @UserID';
    
        dbConnection.query(query, parameters, false, function (error, data) {          
            resolve(data);
            if (error) {
              reject();
            }          
            return data;
          });  
        });
}

const getRideById = (rideId) => {
  return new Promise((resolve, reject) => {
    //console.log("v id"+vehicleId);
    //console.log("u id"+ownerId);
    var parameters = [];
    // parameters.push({ name: 'UserID', type: TYPES.Int, val: ownerId });
    // parameters.push({ name: 'RideID', type: TYPES.Int, val: rideId });
    var query = "SELECT vd.*,vrd.*,c.* FROM AVCLOUD.dbo.VEHICLERIDEDETAILS vrd JOIN AVCLOUD.dbo.VEHICLEDETAILS vd on vd.VehcileID=vrd.RideVehicleID JOIN AVCLOUD.dbo.USERDETAILS c on vrd.RideCustomerID=c.UserID WHERE vrd.RideID= " + rideId + ";";
    dbConnection.query(query, parameters, false, function (error, data) {
      if (error) {
        console.log(error);
        reject(error);
      }
      //console.log(data);
      ////console.log("why"+data[0].FirstName);
      if (data && data[0]) resolve(data[0]);
      else if (!data && !error) resolve();
    });
  });
}

  const getAllRidesSensor = () => {
    return new Promise((resolve, reject) => {
      var parameters = [];            
      var sql = "SELECT top 10 vrd.*,vd.*,c.* FROM AVCLOUD.dbo.VEHICLERIDEDETAILS vrd JOIN AVCLOUD.dbo.VEHICLEDETAILS vd on vd.VehcileID=vrd.RideVehicleID JOIN AVCLOUD.dbo.USERDETAILS c on vrd.RideCustomerID=c.UserID WHERE RideStatus IS NOT NULL ORDER BY 1 DESC;";
      dbConnection.getQuery(sql, parameters, true, function (error, data) {
          if (data) {
              resolve(data);
          } else
              reject(error);
      });
  });
  }

  const getRouteDetails= async (rideId) => {
    //router.get('/getRoutes', function (req, res) {  
      try {      
        //rideId=86;
        var rides = await ride.find({ 'Ride ID': rideId }).sort({ _id: -1 }).limit(10);
        return rides.reverse();    
      } catch (error) {
        console.log("Error with fetching rides: " + error);     
      }
    }



exports.login = login;
exports.signup = signup;
exports.registerVehicle = registerVehicle;
exports.getVehicleDetails = getVehicleDetails;
exports.getVehicleRideDetails = getVehicleRideDetails;
exports.getAllVehicleDetails = getAllVehicleDetails;
exports.bookRide = bookRide;
exports.getAllUserDetails = getAllUserDetails;
exports.saveUserDetails = saveUserDetails;
exports.getUserDetails = getUserDetails;
exports.getRideById = getRideById;
exports.getAllRidesSensor = getAllRidesSensor;
exports.getRouteDetails = getRouteDetails;
exports.getUserTripDetails = getUserTripDetails;
exports.repairVehicle = repairVehicle;
