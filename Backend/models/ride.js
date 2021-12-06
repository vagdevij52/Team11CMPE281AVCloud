const mongoose = require("mongoose");
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
const RouteInfoSchema = new mongoose.Schema({
  "Lane ID": {
    type: Number,
    required:true   
  },
  "Location x": {
    // type:  SchemaTypes.Double   
   type:Number,
   required:true
  },
  "Location y": {
    type:Number ,
    required:true   
  },
  "Road ID": {
    type:  Number,
    required:true 
  },
  "Ride ID": {
    type:  Number,
    required:true   
  },
 },{collection:'RouteInfo'});

const Thought = mongoose.model("Thought", RouteInfoSchema);

module.exports = Thought;
