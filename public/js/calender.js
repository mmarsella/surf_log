$(document).ready(function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    // page is now ready, initialize the calendar...


/*********

FOR WED

1)  FIGURE OUT HOW TO ADD EVENTS OBJECTS TO THE CALENDAR BY ACCESSIING THE HIDDEN INPUT VALUES IN THE DOM

2)  Connect to the spitcast API to populate the logs.

3)  Chart.js to create user statistics based on the "more verbose" logs after the forecasts are added to the logs.

4)  Create show-page on-click of a calendar entry

5)  Re-design homepage

******************************/



    /***** MAKING A NEW CALENDAR EVENT   ***********/
    var logSource = new Object();
    logSource.title = 'PACHECO'; // this should be string
    logSource.start = new Date(y, m, 2, 10, 00); // this should be date object

    var log = new Array();
    log[0] = logSource;
    /************************************************/

    




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

        events: [ 
        {
            title: "Ocean Beach",
            start: new Date(y, m, 1, 9, 00),
            url: "https://www.google.com/?gws_rd=ssl",
            editable:true,
           
            allDay:false
        },


        ]

    });

    $('#calendar').fullCalendar('addEventSource', log);
    $('#calendar').fullCalendar('renderEvents');
       



});