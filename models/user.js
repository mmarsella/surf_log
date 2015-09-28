var mongoose = require("mongoose");
var Log = require("./log");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

/**** SCHEMA ****/

var userSchema = new mongoose.Schema({
  name: {
    type:String,
    lowercase:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  email:String,

  logs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Log"
  }],
});

/**** HOOKS ****/

userSchema.pre('remove', function (next){
  //remove every log from this user before deleting them
  Log.remove({user: this._id}).exec();
});

userSchema.pre('save', function (next){
  var user = this;
  // if the password has not been changed, save the user and move on...
  if(!user.isModified('password')){
    return next();
  }
  // HASHING THE PASSWORD 
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      // define what the password is for the user
      user.password = hash;
      // everything looks good, let's save this!
      next();
    });
  });
});

/***** AUTHENTICATION *********/

userSchema.statics.authenticate = function (formData, callback) {
  // this refers to the model!
  this.findOne({
    email: formData.email
  },
  function (err, user) {
    if (user === null){
      callback("Invalid username or password",null);
    }
    else {
      user.checkPassword(formData.password, callback);
    }
  });
};

//PASSWORD MATCHING
userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};


var User = mongoose.model("User", userSchema);
module.exports = User;









