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

app.get('*', function(req,res){
  res.render('404');
});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
  });