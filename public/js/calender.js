$(document).ready(function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    console.log("THE DATE", d);
    console.log("THE MONTH", m);
    console.log("THE YEAR", y);
    // page is now ready, initialize the calendar...


/*********
FOR WED
2)  Connect to the spitcast API to populate the logs.
3)  Chart.js to create user statistics based on the "more verbose" logs after the forecasts are added to the logs.
4)  Create show-page on-click of a calendar entry
5)  Re-design homepage
******************************/

 
/******* GRAB HIDDEN INPUT VALUES FROM DOM  **********/

//All hidden time input values  --> May not need this
// var timeArray = $('.time').map(function() {return $(this).val(); });

//All hidden location input values
var locationArray = $('.location').map(function() {return $(this).val(); });

//All hidden time input values  --> cal date fields can receive ISO date
var dateArray = $('.date').map(function() {return $(this).val(); });

/*******************************************************/

/***** MAKING A NEW CALENDAR EVENTS   ***********/
var log = new Array();
for(var i = 0; i < locationArray.length; i++)
{
    var logSource = new Object();
    logSource.title = locationArray[i];
    logSource.start = new Date(dateArray[i]);
    log[i] = logSource;
}
/************************************************/

// Array that will be rendered in calendar

// var testTime = timeArray[0].split(':');

// testTime[0] = testTime[0].charAt(1);
// Eliminate leading zero w/ base ten # system
// if testTime[0] < 10

// parseInt(testTime[0],10);

 // var logSource = new Object();
 // logSource.title = locationArray[0]; // this should be string
 // logSource.start = new Date(dateArray[0]);
 // var logSource2 = new Object();
 // logSource2.title = locationArray[1]; // this should be string
 // logSource2.start = new Date(dateArray[1]);
// log[0] = logSource;
// log[1] = logSource2;


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
       
});