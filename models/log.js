var mongoose = require("mongoose");
var User = require("./user");

var logSchema = new mongoose.Schema({
  time:Date,
  duration:Number,
  rating:Number,
  description:String,
  location:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

/******** EXPORTS *********/

var Log = mongoose.model("Log", logSchema);
module.exports = Log;