/**************** FORECAST  ******************************* 

The forecast model is designed to retrieve 10 days worth of data
per location .

After 10 days, this data will be removed and refreshed with another 10 day forecast

The forecast info will be used to create user-logs.

***********************************************************/

var mongoose = require("mongoose");

/****** FORECAST SCHEMA *******/

var forecastSchema = new mongoose.Schema({
  spot_name:String, // "South Ocean Beach"
  date:String,   // ex "2015-9-30 13"
  hour:String,   //ex 9AM
  size_ft:Number,  //ex 1.6757142548640278
  shape:String,  //"pf"
  tide:String,   //"Poor-fair"

  wind_speed:Number, // http://api.spitcast.com/api/county/wind/san-francisco/?dcat=week
  direction_degrees:Number,
  direction_text:String,
  // time:String,
  // location:{
  //   latitude: Number,
  //   longitude: Number
  // }
});


/********* EXPORTS *********/

var Forecast = mongoose.model("Forecast", forecastSchema);
module.exports = Forecast;
