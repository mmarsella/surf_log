var mongoose = require("mongoose");
var User = require("./user");

var logSchema = new mongoose.Schema({
  date:Date,
  time:String,
  duration:Number,
  rating:Number,
  description:String,
  location:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  //Added by the forecast data
    size_ft:Number,
    shape:String,
    forecast_time:String,
    // tide:String  //need to add to forecast pull
  
// Nest the forecast within the log
// EMBED!  Do not reference.  
// I want to persist this data in the log, b/c the forecast will change constantly
});

/******** EXPORTS *********/

var Log = mongoose.model("Log", logSchema);
module.exports = Log;