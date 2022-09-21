//document.addEventListener('DOMContentLoaded', function ()
var calendarEl = document.getElementById('calendarDash');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            center: 'title',
            right: 'prev,next today'
        },
        initialDate: new Date(),
        navLinks: true, // can click day/week names to navigate views
        businessHours: true, // display business hoursThis month
        editable: true,
        selectable: true,
        events: [
            {
                title: 'Business Lunch',
                start: '2022-05-24T13:00:00',
                constraint: 'businessHours'
            },
            {
                title: 'Meeting',
                start: '2022-05-23T11:00:00',
                constraint: 'availableForMeeting', // defined below
                color: '#257e4a'
            },
            {
                title: 'Conference',
                start: '2020-09-18',
                end: '2020-09-20'
            },
            {
                title: 'Party',
                start: '2020-09-29T20:00:00'
            },

             
            {
                groupId: 'availableForMeeting',
                start: '2020-09-11T10:00:00',
                end: '2020-09-11T16:00:00',
                display: 'background'
            },
            {
                groupId: 'availableForMeeting',
                start: '2020-09-13T10:00:00',
                end: '2020-09-13T16:00:00',
                display: 'background'
            },

             
            {
                start: '2020-09-24',
                end: '2020-09-28',
                overlap: false,
                display: 'background',
                color: '#ff9f89'
            },
            {
                start: '2020-09-06',
                end: '2020-09-08',
                overlap: false,
                display: 'background',
                color: '#ff9f89'
            }
        ]
    });

calendar.render();

