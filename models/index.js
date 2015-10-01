var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/surf_log");
mongoose.set('debug',true);

module.exports.Log = require("./log");
module.exports.Forecast = require("./forecast");
module.exports.User = require("./user");