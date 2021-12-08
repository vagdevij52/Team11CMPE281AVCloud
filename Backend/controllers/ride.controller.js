const ride = require("../models/ride");

const getrides = async (req, res) => {
  try {
    var rideId = req.params.rideId;
    var rides = await ride.find({ 'Ride ID': rideId }).sort({ _id: -1 }).limit(10);
    rides = rides.reverse();

    return res.json({
      success: true,
      message: rides,
    });
  } catch (error) {
    console.log("Error with fetching rides: " + error);
    return res.json({
      success: false,
      message: "Error with fetching rides." + error,
    });
  }
};

module.exports = {
  getrides,
};
