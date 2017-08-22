$EVENTLIST = $('[data-role="events-container"]');

gapi.analytics.ready(() => {
    
    gapi.analytics.auth.authorize({
        // auth-container is dom element that hosts the sign-in button during a sessions first load. sign in button can also contain an event listener to do something     else as well
        container: 'embed-api-auth-container3',
        //client ID of our project from developers console (using Sarahs)
        clientid: CLIENT_ID,
    })

    // return user info to console when they sign in... (name, email, profilePic)
    gapi.analytics.auth.on('signIn', function() {
     
    })
    const mainGraphDateRange = {
        'start-date': '7daysAgo',
        'end-date': '0daysAgo'
    }

    const viewSelectorEvents = new gapi.analytics.ext.ViewSelector2({
        container: 'events-view-selector-container'
        })
            .execute();
    const dateRangeSelectorEvents = new gapi.analytics.ext.DateRangeSelector(
        {
            container: 'date-range-selector-container-events'
        })
            .set(mainGraphDateRange)
            .execute()
    viewSelectorEvents.on('viewChange', (data) => {
        var request = {};
        request['propertyid'] = data.property.id;
        request['accountid'] = data.account.id;
        var dateArray = $('#date-range-selector-container-events > .DateRangeSelector > .DateRangeSelector-item').find('input[type="date"]');
        request['enddate'] = dateArray[0].attributes[2].value;
        request['startdate'] = dateArray[1].attributes[2].value;

        $.post('/api/events', request)
            .then(formatDates)
            .then(createGroups)
            .then(createList)
    })
    
    dateRangeSelectorEvents.on('change', (data) => {
        var request = {}
        request['startdate'] = data['start-date'];
        request['enddate'] = data['end-date'];
        var idArray = $('#events-view-selector-container > .ViewSelector2 > .ViewSelector2-item > .FormField').find(":selected");
        request['accountid'] = idArray[0].attributes[1].value;
        request['propertyid'] = idArray[1].attributes[1].value;

        $.post('/api/events', request)
            .then(formatDates)
            .then(createGroups)
            .then(createList)
    })
})

// Formats each date ex: Aug 21 2017
function formatDates(result) {
    result.forEach(function(event) {
        event.date_added = moment(event.date_added).format('MMM DD YYYY');
        event.event_date = moment(event.event_date).format('MMM DD YYYY');
        event.method = event.method.trim();
    })
    return result
}

// Groups all events with same event_date together in an array
function createGroups(result) {
    let temparr = [];
    let finalarr = [];
    let tempdate = "";
    result.forEach(function(event) {
        if (event.event_date === tempdate) {
            temparr.push(event);
        } else {
            if (temparr.length !== 0) {
                finalarr.push(temparr);
                temparr = [];
            }
            tempdate = event.event_date;
            temparr.push(event);
        }
    })
    finalarr.push(temparr);
    return finalarr;
}


function createList(result) {
    if($EVENTLIST.children()) {
        $EVENTLIST.empty();
    }
    var $eventcontainer = $('<div></div>', {
            "class" : "event-container"
        });
    result.forEach(function(date) {
        let $datecontainer = $('<div></div>', {
            'text': date[0].event_date
        });
        date.forEach(function(event) {
            let $event = $('<div></div>', {
                'id': event.event_id
            });
            let $description = $('<span></span>', {
                'text': `Description: ${event.description}`
            })
            $event.append($description);
            if (event.eventlink !== null) {
                let $link = $('<a></a>', {
                    'href': `${event.eventlink}`,
                    'text': 'Link to event'
                })
                $event.append($link);
            }
            let $name = $('<span></span>', {
                'text': `Posted by: ${event.firstname}`
            })
            $event.append($name);
            let $dateadded = $('<span></span>', {
                'text': `Date added: ${event.date_added}`
            })
            $event.append($dateadded);
            let $icondiv = $('<div></div>', {});
            let icon = chooseIcon(event.method);
            let $icon = $('<img>', {
                'src': icon,
                'alt': "icon"
            })
            $icondiv.append($icon);
            $event.append($icondiv);
            let $update = $('<a></a>', {
                'text': 'Edit',
                'href': `/eventlist/edit/${event.event_id}`
            })
            $event.append($update);
            let $delete = $('<a></a>', {
                'text': 'Delete',
                'href': `#`,
                'data-role': 'delete'
            })
            $event.append($delete);
            $datecontainer.append($event);
        })
        $eventcontainer.append($datecontainer)
    })
    $EVENTLIST.append($eventcontainer);
}

function addDeleteListener() {
    $EVENTLIST.on('click', "[data-role='delete']", function(event) {
        event.preventDefault();
        $element = $(event.target.parentNode);
        console.log($element);
        // deletePlace($element, $element[0]["attributes"][2]['nodeValue']);
    })
}

function chooseIcon(method) {
    let newImage = {
         "General": "../images/defaulticon.svg",
        "Email":"../images/email.png",
        "Facebook": "https://cdn.worldvectorlogo.com/logos/facebook-icon.svg",
        "Tweet": "https://cdn.worldvectorlogo.com/logos/twitter-4.svg",
        "Google Plus": "../images/google-plus.svg",
        "Linkedin": "../images/linkedin.png",
        "Instagram": "https://cdn.worldvectorlogo.com/logos/instagram-2016.svg",
        "Important": "../importanticon.svg",
        "Outdoor": "../images/tent.png",
        "Multiplatform": "../images/multipleplatform.png",
        "Social": "../images/socialevent.png"
    }
    return newImage[method]
}

addDeleteListener();