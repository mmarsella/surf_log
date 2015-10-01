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

1) Create Drop down for spot selection
2) Create drop down for time selection
3) Create weekly cron call for API PUll
4) Grab DATA for:
   - South Ocean Beach: 117
   - North Ocean Beach: 114
   - Kelly's Cove: 697
   - Linda Mar: 120
   - Montara: 121
   - Princeton Jetty: 123

5)  Create some user statistics:
    - Days surfed
    - Hours in the water
    - Avg wave height

6)  Chart.js to create user statistics based on the "more verbose" logs after the forecasts are added to the logs.
7)  Create show-page on-click of a calendar entry
8)  Re-design homepage
******************************/

/******* GRAB HIDDEN INPUT VALUES FROM DOM  **********/

//All hidden time input values  --> May not need this
var timeArray = $('.time').map(function() {return $(this).val(); });

//All hidden location input values
var locationArray = $('.location').map(function() {return $(this).val(); });

//All hidden time input values  --> cal date fields can receive ISO date
var dateArray = $('.date').map(function() {return $(this).val(); });

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
    logSource.start = new Date(y,m,d+1,hour,min); //calendar always displays 5pm (17:00:00)
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
        //iterate through all logs here and store it into hidden inputs
          // grab the hidden inputs in the dom w/ jquery
            // store that info into calendar events to populate calendar
        // events: [ 
        // {
        //     title: "Ocean Beach",
        //     start: new Date(y, m, 1, 9, 00),
        //     url: "https://www.google.com/?gws_rd=ssl",
        //     editable:true,
        //     allDay:false
        // },
        // ]
    });
//Remove eventsources before pulling from DOM
$('#calendar').fullCalendar('removeEventSource', log);
//Add Events to cal
$('#calendar').fullCalendar('addEventSource', log);
$('#calendar').fullCalendar('renderEvents');


/*********** CHART LOGIC  **********/

// DUMMY DATA

var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }];

// Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
var myNewChart = new Chart(ctx).Doughnut(data);
       
});