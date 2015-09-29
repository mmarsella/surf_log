var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/surf_log");
mongoose.set('debug',true);

module.exports.Log = require("./log");
module.exports.Forecast = require("./forecast");
module.exports.User = require("./user");