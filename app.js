var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require("./models");
var methodOverride = require("method-override");
var request = require('request');
var session = require("cookie-session");
var morgan = require("morgan");
var loginMiddleware = require("./middleware/loginHelper"); //refers to name of file
var routeMiddleware = require("./middleware/routeHelper");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
//server-side logger.  Logs requests to the terminal
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));


//ALWAYS create the session BEFORE trying to using ANY MIDDLEWARE that involves req.session
app.use(session({
  maxAge: 3600000,   //milliseconds  (360 seconds/6min) --> life of the cookie
  secret: 'illnevertell', // communication
  name: "chocolate chip" // what we see in the resources tab/cookies --> browser
}));

app.use(loginMiddleware);  // calling the loginhelper on EVERY REQUEST!

/***** ROOT  ******/

app.get("/", function (req,res){
  res.redirect("/login");
});

/*********** LOGIN AND SIGN UP ***************
*********************************************/

app.get("/signup", function (req,res){
  res.render("users/signup");
});

app.post("/signup", function (req,res){
  var newUser = req.body.user;
  db.User.create(newUser, function (err,user){
    console.log(user);
    if(user){
      req.login(user);
      res.redirect("/"); //redirect user to homepage
    }else{
      console.log(err);
      res.redirect("/signup");
    }
  });
});

app.get("/login", function (req,res){
  res.render("users/login");
});

app.post("/login", function (req,res){
  db.User.authenticate(req.body.user,
    function (err,user){
      console.log("THE USER: " + user);
      if(!err && user !== null){
        req.login(user);
        res.redirect("/users/" + user._id);
      }else{
        res.redirect("/users");
      }
    });
});

app.get("/logout", function (req,res){
  req.logout();
  res.redirect("/");
});


/*************** USERS ******************
***************************************/


//INDEX
app.get("/users", function (req,res){
  // res.locals.name = "elie";
  res.render("users/index");
});

//NEW
// app.get("/users/new", function (req,res){
// });

//SHOW  --> User Homepage
app.get("/users/:id", function (req,res){
  db.User.findById(req.params.id, function (err, user){
    res.render("users/show",{user:user});
  });
});

//EDIT
app.get("/users/:id/edit", function (req,res){
});

//CREATE
app.post("/users", function (req,res){
});

//UPDATE
app.put("/users/:id", function (req,res){
});

//DESTROY
app.delete("/users/:id", function (req,res){
});


/*************** LOGS ******************
***************************************/

//ROOT
app.get("/", function (req,res){
});

//INDEX
app.get("/users/:user_id/posts", function (req,res){
});

//NEW
app.get("/users/:user_id/posts/new", function (req,res){
});

//SHOW
app.get("/users/:user_id/posts/:id", function (req,res){
});

//EDIT
app.get("/users/:user_id/posts/:id/edit", function (req,res){
});

//CREATE
app.post("/users/:user_id/posts", function (req,res){
});

//UPDATE
app.put("/users/:user_id/posts/:id", function (req,res){
});

//DESTROY
app.delete("/users/:user_id/posts/:id", function (req,res){
});

/**** 404 CATCH-ALL ******
*************************/

app.get('*', function(req,res){
  res.render('404');
});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
  });