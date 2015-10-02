    require('dotenv').load();  // for env variables
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
var date = require("datejs");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
//server-side logger.  Logs requests to the terminal
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));


//ALWAYS create the session BEFORE trying to using ANY MIDDLEWARE that involves req.session
app.use(session({
  maxAge: 3600000,   //milliseconds  (360 seconds/6min) --> life of the cookie
  secret: process.env.COOKIE_SECRET, // communication
  name: "chocolate chip" // what we see in the resources tab/cookies --> browser
}));

app.use(loginMiddleware);  // calling the loginhelper on EVERY REQUEST!

/***** ROOT  ******/

app.get("/", function (req,res){
  res.redirect("/login");
});

/*********** LOGIN AND SIGN UP ***************
*********************************************/

app.get("/signup", routeMiddleware.preventLoginSignup, function (req,res){
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


/************* CURRENT FORECAST  *****************/

// Grab DATA for:
//    - South Ocean Beach: 117 -
//    - North Ocean Beach: 114 -
//    - Kelly's Cove: 697 - 
//    - Linda Mar: 120 -
//    - Montara: 121 - 
//    - Princeton Jetty: 123
function spotId(spot){
  if(spot === "South Ocean Beach"){
    return 117;
  }else if(spot === "North Ocean Beach"){
    return 114;
  }else if(spot === "Kellys Cove"){
    return 697;
  }else if(spot === "Linda Mar"){
    return 120;
  }else if(spot === "Montara"){
    return 121;
  }else if(spot === "Princeton Jetty"){
    return 123;
  }else{}
}


app.get("/forecast", function(req,res){

  var spot = spotId(req.query.value);
  // make a db call with req.query.value
  // respond with some json
  // CHECK OUT RES.FORMAT
    console.log("THE VALUE: ",req.query.value);
    console.log("The SPOT ID ",spot);

    request.get("http://api.spitcast.com/api/spot/forecast/"+ spot + "/?dcat=week", function (err,response,body){

    var currentForecast = JSON.parse(body);

    console.log("The report for " + req.query.value + ":" + currentForecast[0].hour);
  res.format({

  'application/json': function(){
    res.send(currentForecast[11]);  //sending back 11am forecast
  },

  'default': function() {
    // log the request and respond with 406
    res.status(406).send('Not Acceptable');
  }
});

  });
});

/*************************************************/



/*************** USERS ******************
***************************************/


// INDEX
app.get("/users", function (req,res){
  res.render("users/index");
});

//NEW
// app.get("/users/new", function (req,res){
// });

//SHOW  --> USER HOMEPAGE
app.get("/users/:id", function (req,res){
  db.User.findById(req.params.id, function (err, user){
    db.Log.find({user:req.session.id}, function (err, logs){
      console.log("****** ALL THE LOGS:", logs);
      res.render("users/show",{user:user, logs:logs});  // send in logs
    });
    //db.Log.find(user._id)
    // and then pass in all logs in hidden ejs inputs in show.ejs
       // 
  });
});

//EDIT
app.get("/users/:id/edit", function (req,res){
});

// //CREATE
// app.post("/users", function (req,res){
// });

// //UPDATE
// app.put("/users/:id", function (req,res){
// });

// //DESTROY
// app.delete("/users/:id", function (req,res){
// });


/*************** LOGS ******************
***************************************/

//ROOT
// app.get("/", function (req,res){
// });

//INDEX
// app.get("/users/:user_id/posts", function (req,res){
// });

//NEW
app.get("/logs/new", routeMiddleware.ensureLoggedIn, function (req,res){
  res.render("logs/new");
});

//SHOW
app.get("/logs/:id", function (req,res){
});

//EDIT
app.get("/users/:user_id/posts/:id/edit", function (req,res){
});

//CREATE
app.post("/logs", function (req,res){
  console.log("BEFORE CODEZ", req.body.log.date);
  var jsDate = req.body.log.date.split("-");
  var jsTime = req.body.log.time.substring(0,2);
  req.body.log.date = new Date(jsDate[0], jsDate[1]-1,jsDate[2],jsTime);
  console.log("AFTER CODEZ", req.body.log.date) ;
  db.Log.create(req.body.log, function (err, log){
    console.log("*********THE LOG: ",log);
    if(err){
      console.log(err);
      res.render("404");
    }else{
      //find forecast from forecast name by log_spot_name
      db.Forecast.find({spot_name: log.location, date:log.date}, function (err, forecast){  // try to search by hour
        if(err){
          console.log(err);
          res.render("404");
        }else{
          console.log("THESE ARE FORECASTS WE FOUND", forecast);

          console.log("**********  LOG TIME",log.time);
          console.log("**********  FORECAST TIME",forecast[0].hour);

          console.log("THE LOG DATE WITH FORECAST",log.date);
            //Add forecast data into this LOG!!
            // returns an array of 1 forecast object
            log.size_ft = forecast[0].size_ft;
            log.shape = forecast[0].shape;
             //log.tide = forecast[0].tide;
            log.forecast_time = forecast[0].hour;
            console.log("FORECASTE[0] hour", forecast[0].hour);
            // console.log("FORECASTE[1] hour", forecast[1].hour);

            db.User.findById(req.session.id, function (err,user){
              console.log("****USER: ",user);
              console.log("***WE ARE MAKING THE LOG");
              user.logs.push(log);  // store log for user
              log.user = user._id;  // log is associated w/ this user
              log.save();
              user.save();
              console.log("LOG IS SAVED");
              console.log("^^^^^^ THE DATE ^^^^", log.date);
              res.redirect("/users/" + req.session.id);
            });
        }
      });
    }
  });
});

// Make an API call
// create forecast documents for a full week in the future
// 


/******** Parse GMT date format to ISOString  ********/

//Date.parse(date).toISOString()

//db.logs.find({date:ISODate(d.toISOString())})
/*******************************************************/


// 4) Grab DATA for:
//    - South Ocean Beach: 117 -
//    - North Ocean Beach: 114 -
//    - Kelly's Cove: 697 - 
//    - Linda Mar: 120 -
//    - Montara: 121 - 
//    - Princeton Jetty: 123

//need to make one more API call to the wind API
app.get("/apiCallTest", function (req,res){
  console.log("^^^^^^^^^^*****^^^INSIDE THE API CALL!!!");
  request.get("http://api.spitcast.com/api/spot/forecast/117/?dcat=week", function (err,response,body){
    var forecast = JSON.parse(body);

    forecast.forEach(function(report){

      //convert the gmt string into a date object
      var time = report.gmt;

      var total = time.split("-").slice(0,2).concat(time.split("-")[2].split(" ")).map(function(val){
      return parseInt(val);});

      var foreDate = new Date(total[0],total[1]-1,total[2],total[3]);

      // var ISODate = Date.parse(gmtDate).toISOString();  //Re-format date field to match log/calendar dates

      db.Forecast.create({
          spot_name:report.spot_name, // "South Ocean Beach"
          date:foreDate,   // ex "2015-9-30 13"
          hour:report.hour,
          size_ft:report.size_ft,  //ex 1.6757142548640278
          shape:report.shape,  //"pf"
          tide:report.shape_detail.tide   //"Poor-fair"
      });
      console.log("CREATED A FORECAST DOC FOR OB!",report);
    });
    console.log("*************************************");
    console.log("FORECAST LENGTH",forecast.length);
    // console.log(forecast);
        console.log("*************************************");
    res.redirect("/users/" + req.session.id);
  });
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

// start the server  --> If on heroku OR locally
app.listen(process.env.PORT || 3000, function () {
  console.log("Starting a server on localhost:3000");
  });