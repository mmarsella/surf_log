$(document).ready(function() {
    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    // console.log("THE DATE", d);
    // console.log("THE MONTH", m);
    // console.log("THE YEAR", y);
    // page is now ready, initialize the calendar...

/*********
FOR WED
1)  Sync forecast time w/ log entry time
  -- may need to be written in creation of log/find of forecast for log

3) Create weekly cron call for API PUll

5)  Create some user statistics:
    - Days surfed
    - Hours in the water
    - Avg wave height

6)  Chart.js to create user statistics based on the "more verbose" logs after the forecasts are added to the logs.
7)  Create show-page on-click of a calendar entry
8)  Re-design homepage
******************************/


/***** CURRENT FORECAST ********/

// 1) Onchange, grab value (use jQuery)

var currentVal = $('.form-control').val();  

// 2)  Send that value to the server (AJAX)
$("#select").on("change", function(e){
        currentVal = $('.form-control').val(); 
       $.ajax({
        url: "/forecast",
        dataType: "json",
        method: "GET",
        // data is what we are passing to the server.  // will be req.query.value on the back end
        data: {
            value: currentVal
        }
    }).done(function(serverResponse){
        $('.forecast').empty();
        $('.forecast').append("<h4 id='spot'>" + "Spot Name: " + "</h4>");
        $('#spot').append("<span>"+serverResponse.spot_name+"</span>"); 

        $('.forecast').append("<h4 id='date'>" + "Date: " + "</h4>");
        $('#date').append("<span>"+serverResponse.date+"</span>"); 

        $('.forecast').append("<h4 id='hour'>" + "Hour: " + "</h4>");
        $('#hour').append("<span>"+serverResponse.hour+"</span>"); 

        $('.forecast').append("<h4 id='waveSize'>" + "Wave Size: " + "</h4>");
        $('#waveSize').append("<span>"+serverResponse.size_ft+"</span>"); 

        $('.forecast').append("<h4 id='wind'>" + "Wind: " + "</h4>");
        $('#wind').append("<span>"+serverResponse.shape_detail.wind+"</span>"); 
        
        //append html stuff with the response i get back.
        //serverResponse is what i receive back form the call.
    }).fail(function(err){
        console.log("SOMETHING WENT WRONG",err);
    });
    // $('.form-control').val();
    console.log("This changed!");
});
/****************************************/
/******* GRAB HIDDEN INPUT VALUES FROM DOM  **********/

//All hidden time input values  --> May not need this
var timeArray = $('.time').map(function() {return $(this).val(); });

//All hidden location input values
var locationArray = $('.location').map(function() {return $(this).val(); });

//All hidden time input values  --> cal date fields can receive ISO date
var dateArray = $('.date').map(function() {return $(this).val(); });

// ' '
var durationArray = $('.duration').map(function() {return $(this).val(); });

// Size of all the waves surfed
var waveArray = $('.size_ft').map(function() {return $(this).val(); });

/*******************************************************/

/***** MAKING A NEW CALENDAR EVENTS   ***********/
var log = new Array();
for(var i = 0; i < locationArray.length; i++)
{
    var splitDate = dateArray[i].split(" ");
    var d = parseInt(splitDate[2]);
    var m = parseInt(monthNumber(splitDate[1]));
    var y = parseInt(splitDate[3]);

/**** CREATE HOUR AND MIN *********/
    var time = timeArray[i].split(" ");
    hour = parseInt(time[0].split(":")[0]);
    min = parseInt(time[0].split(":")[1]);

    var logSource = new Object();
    logSource.title = locationArray[i];
    logSource.start = new Date(y,m,d,hour,min); //calendar always displays 5pm (17:00:00)
    log[i] = logSource;
}
/************************************************/

function monthNumber(month){
    if(month === "Jan"){
        return 0;
    }else if(month === "Feb"){
        return 1;
    }else if(month === "Mar"){
        return 2;
    }else if(month === "Apr"){
        return 3;
    }else if(month === "May"){
        return 4;
    }else if(month === "Jun"){
        return 5;
    }else if(month === "Jul"){
        return 6;
    }else if(month === "Aug"){
        return 7;
    }else if(month === "Sep"){
        return 8;
    }else if(month === "Oct"){
        return 9;
    }else if(month === "Nov"){
        return 10;
    }else if(month === "Dec"){
        return 11;
    }else{return 0}
}

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        dayClick: function (){
            alert("DAY IS CLICKED!");  // use this call-back to render the indiv show page.
        },
        editable:true,
        weekMode: 'liquid',
        url: '#',
        height: 300,
    });
//Remove eventsources before pulling from DOM
$('#calendar').fullCalendar('removeEventSource', log);
//Add Events to cal
$('#calendar').fullCalendar('addEventSource', log);
$('#calendar').fullCalendar('renderEvents');

/*********** CHART LOGIC  **********/
/***********************************/

//DAYS SURFED 
var daysSurfed = locationArray.length;  // NEED to calc the amt of days surfed PER MONTH!! 

/********* HOURS SURFED / Week   ******************/

var hoursSurfed = durationArray.map(function (el){return parseInt(el);});

var totalHours = 0;

for(var i = 0; i < hoursSurfed.length; i++)
{
    totalHours += hoursSurfed[i];
}

// CALC CURRENT MONTH
var calc = new Date();
var n = calc.getMonth();

// (31) --> 0,2,4,6,7,9,11
// (30)  --> 3, 5, 8, 10
// (28)  --> 1

function surfMonth(n){
    if(n === 0){
        return [31,"January"];
    }
    else if(n === 2){
        return [31, "March"];
    }
    else if(n === 4){
        return [31,"May"];
    }
    else if(n === 6){
        return [31,"July"];
    }
    else if(n === 7){
        return [31,"August"];
    }
    else if(n === 9){
        return [31,"October"];
    }
    else if(n === 11){
        return [31,"December"];
    }
    else if(n === 3){
        return [30, "April"];
    }
    else if(n === 5){
        return [30,"June"];
    }
    else if(n === 8){
        return [30,"September"];
    }
    else if(n === 10){
        return [30,"November"];
    }else{return 28;}
}

var dayMonth = surfMonth(n);

/******* AVERAGE WAVE HEIGHT *****/
/*********************************/

var waveTotal = 0;

for(var i = 0; i < waveArray.length; i++)
{
    waveTotal += parseFloat(waveArray[i]);
}

waveTotal = parseFloat(waveTotal.toFixed(2));
var waveAVG = waveTotal / waveArray.length;
waveAVG = parseFloat(waveAVG.toFixed(2));

/************************************************/

/******* LOCATION ********/
var sOB = 0;
var nOB = 0;
var pacifica = 0;
var montara = 0;
var kelly = 0;
var jetty = 0;

function locationCounter(arr){
for(var i = 0; i < arr.length; i++){
        if(arr[i] == "South Ocean Beach"){
            sOB++;
        }
        else if(arr[i] == "North Ocean Beach"){
            nOB++;
        }
        else if(arr[i] == "Kellys Cove"){
            kelly++;
        }
        else if(arr[i] == "Linda Mar"){
            pacifica++;
        }
        else if(arr[i] == "Montara"){
            montara++;
        }
        else if(arr[i] == "Princeton Jetty"){
            jetty++;
        }
    }
}

locationCounter(locationArray);

console.log("wave avg", waveAVG);


/********* CHART DATA ********************/
/****************************************/

var data = [
    {
        value: dayMonth[0],
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Days"
    },
    {
        value: daysSurfed,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Surfed"
    }
    ];

var surfHours = [
    {
        value:168,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Week"
    },
    {
        value:totalHours,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Surfed"
    }
];

var waves = [
    {
        value:waveAVG,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "You"
    },
    {
        value:10,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Big"
    }
];

var locations = [
    {
        value:sOB,
        color:"green",
        highlight: "#FF5A5E",
        label: "S OB"
    },
    {
        value:nOB,
        color: "orange",
        highlight: "#5AD3D1",
        label: "N OB"
    },
    {
        value:pacifica,
        color: "red",
        highlight: "#5AD3D1",
        label: "Linda Mar"
    },
     {
        value:montara,
        color: "purple",
        highlight: "#5AD3D1",
        label: "Montara"
    },
      {
        value:kelly,
        color: "blue",
        highlight: "#5AD3D1",
        label: "KC"
    },
    {
        value:jetty,
        color: "yellow",
        highlight: "#5AD3D1",
        label: "Jetty"
    },

];

console.log("Surf Hours",surfHours);
console.log("Hours Surfed:",hoursSurfed);

/******* CHARTS TO DRAW **************************/
/*************************************************/

// Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(data);

var ctxM = document.getElementById("surfHours").getContext("2d");
var surfHourChart = new Chart(ctxM).Doughnut(surfHours);

var height = document.getElementById("waveHeight").getContext("2d");
var waveAvgChart = new Chart(height).Doughnut(waves);

var loc = document.getElementById("locations").getContext("2d");
var locationChart = new Chart(loc).Doughnut(locations);
    
});