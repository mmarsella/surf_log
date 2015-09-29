var db = require("../models");

var loginHelpers = function (req,res,next){
if(!req.session){
  // if there is nothing there...move on
  console.log("THERE IS NO SESSION!");
  res.locals.currentUser = undefined;
}
else {
  // if there is something there lets go to the DB and find the user
  db.User.findById(req.session.id,function(err,user){
    // make sure the user is available in all our views
    res.locals.currentUser = user; 
  });
}
  //The act of storing info into the session
  req.login = function (user){
    req.session.id = user._id;
  };
  //The act of clearing the session
  req.logout = function (){
    req.session.id = null;
  };
  next();
};

module.exports = loginHelpers;