const $EVENTLIST = $('[data-role="events-container"]');
const $EVENTFORM = $('[data-role="event-edit"]');
const $CLOSEFORM = $('[data-role="close-event-form"]');
const $STATUSDIV = $('[data-role="status-msg"]');

var eventUpdate = {};

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

        getEvents(request);
    })
    
    dateRangeSelectorEvents.on('change', (data) => {
        var request = {}
        request['startdate'] = data['start-date'];
        request['enddate'] = data['end-date'];
        var idArray = $('#events-view-selector-container > .ViewSelector2 > .ViewSelector2-item > .FormField').find(":selected");
        request['accountid'] = idArray[0].attributes[1].value;
        request['propertyid'] = idArray[1].attributes[1].value;

        getEvents(request);
    })
});

// Calls API to query database for events w/in given dates/account ids
function getEvents(request) {
    $.post('/api/events', request)
        .then(formatDates)
        .then(createGroups)
        .then(createList)
        .catch((error) => {
            if($EVENTLIST.children()) {
                $EVENTLIST.empty();
            }
            $EVENTLIST.append(error.responseText);
        })
};

// Formats each date ex: Aug 21 2017
function formatDates(result, request) {
    if (result.length === 0) {
        return result;
    } else {
        result.forEach(function(event) {
            event.date_added = moment(event.date_added).format('MMM DD YYYY');
            event.event_date = moment(event.event_date).format('MMM DD YYYY');
            event.method = event.method.trim();
        })
        return result
    }
};

// Groups all events with same event_date together in an array
function createGroups(result) {
     if (result.length === 0) {
        return result;
    } else {
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
};


function createList(result) {
    if($EVENTLIST.children()) {
        $EVENTLIST.empty();
    };

    if (result.length === 0) {
        $noevents = $('<p></p>', {
            'text': `No events found. Please try your search again.`,
            'class': 'event-error'
        });
        $EVENTLIST.append($noevents);
    } else {
        var $eventcontainer = $('<div></div>', {
                "class" : "event-container"
            });
        result.forEach(function(date) {
            let $datecontainer = $('<div></div>', {
                'class' : 'full-date-container'
            });
            let $datetext = $('<div></div>' , {
                'class': 'event-date',
                'text': date[0].event_date
            });
            $datecontainer.append($datetext);
            date.forEach(function(event) {
                let firstname = capitalizeFirstLetter(event.firstname)
                let $event = $('<div></div>', {
                    'id': event.event_id,
                    'name': event.method,
                    'class' : "event-content"
                });
                let $description = $('<span></span>', {
                    'text': `Description: ${event.description}`
                })
                $event.append($description);
                if (event.eventlink !== null) {
                    let $link = $('<a></a>', {
                        'href': `${event.eventlink}`,
                        'target': "_blank",
                        'rel': "noopener noreferrer", 
                        'text': 'Link to event'
                    })
                    $event.append($link);
                }
                let $name = $('<span></span>', {
                    'text': `Posted by: ${firstname}`
                })
                $event.append($name);
                let $dateadded = $('<span></span>', {
                    'text': `Date added: ${event.date_added}`
                })
                $event.append($dateadded);
                let $icondiv = $('<div></div>', {});
                let icon = chooseIcon(event.method);
                let $icon = $('<img>', {
                    'class': 'icon-events',
                    'src': icon,
                    'alt': "icon"
                })
                $icondiv.append($icon);
                $event.append($icondiv);

                let $anchor = $('<div></div>', {})
                let $edit = $('<a></a>', {
                    'class': 'event-anchor',
                    'text': 'Edit',
                    'data-role': 'edit',
                    'href': `#`
                })
                $anchor.append($edit);
                let $delete = $('<a></a>', {
                    'class': 'event-anchor',
                    'text': 'Delete',
                    'href': `#`,
                    'data-role': 'delete'
                })
                $anchor.append($delete);
                $event.append($anchor)
                $datecontainer.append($event);
            })
            $eventcontainer.append($datecontainer)
        })
        $EVENTLIST.append($eventcontainer);
    }
};
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
// Adds click listener to Edit link for each event
function addEditListener() {
    $EVENTLIST.on('click', "[data-role='edit']", function(event) {
        event.preventDefault();
        if($STATUSDIV.children()) {
            $STATUSDIV.empty();
        }
        $child = $(event.target);
        $element = $(event.target.parentNode.parentNode);
        $parent = $(event.target.parentNode.parentNode.parentNode);
        console.log($parent);
        console.log($element);
        console.log(eventUpdate);
        $EVENTFORM.show('slow');
        setDefaults($element, $parent);
        eventUpdate = {};
        eventUpdate['id'] = $element[0].id;
    })
};

function addModalCloseListener() {
    $CLOSEFORM.click((event) => {
        event.preventDefault();
        $EVENTFORM.hide('slow');
    })
};

// Adds click listener to Delete link for each event
function addDeleteListener() {
    $EVENTLIST.on('click', "[data-role='delete']", function(event) {
        event.preventDefault();
        $child = $(event.target);
        $element = $(event.target.parentNode.parentNode);
        $parent = $(event.target.parentNode.parentNode.parentNode);
        deleteEvent($child, $element, $parent);
    })
};

function setDefaults(element, parent) {
    let d = new Date(parent[0].childNodes[0].textContent);
    document.getElementById('event-date').valueAsDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
    let description = element[0].childNodes[0].textContent;
    let end = description.length;
    description = description.slice(13, end);
    $('[data-type="form-description"]').val(description);
    $('[data-role="dropdown"]').find(`option[value='${element[0].attributes[1].value}']`).prop('selected', true);
    // $(`#eventDropdown  option[value='${element[0].attributes[1].value}']`).attr('selected', 'selected');
    if(element[0].childElementCount === 6) {
        $('[data-role="event-link"]').val(element[0].childNodes[1].attributes[0].value);
    };
};

// Deletes event from DOM and makes api call to delete from database
function deleteEvent(child, element, parent) {
    $.get(`/eventlist/delete/${element[0].id}`)
        .then((result) => {
            element.remove();
            if (parent[0].childElementCount === 1) {
                parent.remove();
            } 
        })
        // Appends server error message to child, removes if it already exists
        .catch((error) => {
            if (child.children()) {
                child.children().remove();
            }
            child.append(error.responseText);
        })
};

function chooseIcon(method) {
    let newImage = {
        "General": "../images/defaulticon.svg",
        "Email":"../images/email.png",
        "Facebook": "https://cdn.worldvectorlogo.com/logos/facebook-icon.svg",
        "Tweet": "https://cdn.worldvectorlogo.com/logos/twitter-4.svg",
        "Google Plus": "../images/google-plus.svg",
        "Linkedin": "../images/linkedin.png",
        "Instagram": "https://cdn.worldvectorlogo.com/logos/instagram-2016.svg",
        "Important": "../images/importanticon.svg",
        "Outdoor": "../images/tent.png",
        "Multiplatform": "../images/multipleplatform.png",
        "Social": "../images/socialevent.png"
    }
    return newImage[method]
};

function updateForm() {
    $EVENTFORM.submit(() => {
        event.preventDefault();
        if($STATUSDIV.children()) {
            $STATUSDIV.empty();
        }
        
        getFormDescription();
        getDate();
        getMethod();
        getLink();
        dbUpdateEvent();
    })
};

function dbUpdateEvent() {
    $.post('/eventlist/edit', eventUpdate)
        .then((result) => {
            $STATUSDIV.append(result);
            $EVENTFORM.delay(1000).hide('slow');
            var request = {}
            request['startdate'] = moment(eventUpdate['date']).subtract(1, 'days').format('YYYY-MM-DD');
            request['enddate'] = moment(eventUpdate['date']).format('YYYY-MM-DD');

            var idArray = $('#events-view-selector-container > .ViewSelector2 > .ViewSelector2-item > .FormField').find(":selected");
            request['accountid'] = idArray[0].attributes[1].value;
            request['propertyid'] = idArray[1].attributes[1].value;
            
            var dateArray = $('#date-range-selector-container-events > .DateRangeSelector > .DateRangeSelector-item').find('input[type="date"]');

            var newDateRange = {
            'start-date': request.startdate,
            'end-date': request.enddate
            }

            dateRangeSelectorEvents.set(newDateRange).execute()

            // dateArray[0].attributes[2].value = request.startdate;
            // dateArray[1].attributes[2].value = request.enddate;
            getEvents(request);
        })
        .catch((error) => {
            $STATUSDIV.append(error.responseText);
        });
}

// stores description in form submition to local storage
const getFormDescription = () => {
    var description = 'description';
    var $descriptionValue = $('[data-type="form-description"]').val();
    setValues(description, $descriptionValue);
}

// gets date value of how local storage saves date data and saves to local storage
function getDate() {
    var date = 'date';
    var dateValue = new Date($('input[name="date"]').val());
    dateValue = new Date( dateValue.getTime() - dateValue.getTimezoneOffset() * -60000 ).toUTCString();

    setValues(date, dateValue);
};

// method is dropdown list of icons. can selet one and save to database to be used later for overlay of maps and gathering further information
function getMethod() {
    var method = $('#eventDropdown').find(":selected");
    method = method['prevObject'][0]['innerText'];
    method = method.trim()
    setValues('method', method);
};

// stores optional link to local storage
function getLink() {
    var link = $('[name="link"]').val();
    setValues('eventlink', link);
};

function setValues(key, keyValue) {
    eventUpdate[key] = keyValue;
};

// resets form if reset button is clicked
const resetButton = () => {
    $('[data-role="reset"]').click(() => {
        event.preventDefault();
        if($('[data-role="status-msg"]').children()) {
            $('[data-role="status-msg"]').empty();
        }
        document.forms["eventform"].reset()
    })
}


updateForm();
addDeleteListener();
addEditListener();
addModalCloseListener();
resetButton();


$('#eventDropdown').ddslick({
    width: "200px",
    height: "200px",
    imagePosition: "right" 
});

$EVENTFORM.hide();
