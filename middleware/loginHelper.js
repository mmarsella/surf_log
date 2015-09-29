var db = require("../models");

var loginHelpers = function (req,res,next){
  //The act of storing info into the session
  req.login = function (user){
    req.session.id = user._id;
  };
  //The act of clearing the session
  req.logout = function (){
    req.session.id = null;
  };

  if(!req.session.id){
  // if there is nothing there...move on
    console.log("THERE IS NO SESSION!");
    res.locals.currentUser = undefined;
    next();
  }

  else {
    // if there is something there lets go to the DB and find the user
    
    db.User.findById(req.session.id,function(err,user){
      console.log("WE'RE ABOUT TO FIND OUR USER!", user);
      // make sure the user is available in all our views
      res.locals.currentUser = user; 
      next();
    });
  }
  
};

module.exports = loginHelpers;