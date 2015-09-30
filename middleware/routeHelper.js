var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();  // need to call this in order to carry on with the operation... in this case pass on the req to the server
    }else {
     res.redirect('/login');
    }
  },

// FOR LOGS
  ensureCorrectUser: function(req, res, next) {
    db.Log.findById(req.params.id, function(err,log){
      //added toString() to ensure specific user can 
      // only delete their own posts.
      if (log.user.toString() !== req.session.id) {
        res.redirect('/');
      }else {
        console.log("GOING TO NEXT");
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/user' + req.session.id);
    }else {
     return next();
    }
  }
};
module.exports = routeHelpers; // exporting object with methods