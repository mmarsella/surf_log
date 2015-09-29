/**************** FORECAST  ******************************* 

The forecast model is designed to retrieve 10 days worth of data
per location .

After 10 days, this data will be removed and refreshed with another 10 day forecast

The forecast info will be used to create user-logs.

***********************************************************/

var mongoose = require("mongoose");

/****** FORECAST SCHEMA *******/

var forecastSchema = new mongoose.Schema({
  height:String,
  wind:String,
  direction:String,
  tide:String,
  time:String,
  location:{
    latitude: Number,
    longitude: Number
  }
});


/********* EXPORTS *********/

var Forecast = mongoose.model("Forecast", forecastSchema);
module.exports = Forecast;
