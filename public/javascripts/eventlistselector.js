const $EVENTLIST = $('[data-role="events-container"]');
const $EVENTMODALCONT = $('[data-role="event-modal"]');
const $EVENTMODAL = $('#event-modal');

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
            .catch((error) => {
                if($EVENTLIST.children()) {
                    $EVENTLIST.empty();
                }
                $EVENTLIST.append(error.responseText);
            })
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
            .catch((error) => {
                if($EVENTLIST.children()) {
                    $EVENTLIST.empty();
                }
                $EVENTLIST.append(error.responseText);
            })
    })
})

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
}

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
}


function createList(result) {
    if($EVENTLIST.children()) {
        $EVENTLIST.empty();
    }

    if (result.length === 0) {
        $noevents = $('<p></p>', {
            'text': `No events found. Please try your search again.`,
            'class': 'event-error'
        })
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
                    'class' : "event-content"
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
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
// Adds click listener to Edit link for each event
function addEditListener() {
    $EVENTLIST.on('click', "[data-role='edit']", function(event) {
        event.preventDefault();
        $child = $(event.target);
        $element = $(event.target.parentNode.parentNode);
        $parent = $(event.target.parentNode.parentNode.parentNode);
        console.log($parent);
        console.log($element);
        createEventModal($element, $parent);
        $EVENTMODAL.css('display', 'block');
        window.addEventListener('click', (e) => {
            if (e.target === $EVENTMODAL) {
                $EVENTMODAL.css('display', 'none');
                $('[data-role="modal-content"]').remove();
            }
        })
    })
}

function addModalCloseListener() {
    $('[data-role="close"]').on('click', function(event) {
        event.preventDefault();
        $EVENTMODAL.css('display', 'none');
        $('[data-role="modal-content"]').remove();
    })
}

// Adds click listener to Delete link for each event
function addDeleteListener() {
    $EVENTLIST.on('click', "[data-role='delete']", function(event) {
        event.preventDefault();
        $child = $(event.target);
        $element = $(event.target.parentNode.parentNode);
        $parent = $(event.target.parentNode.parentNode.parentNode);
        deleteEvent($child, $element, $parent);
    })
}

function createEventModal(element, parent) {
    let $modalform = $('<form></form>', {
        'name': 'edit-event',
        'class': 'modal-content',
        'data-role': 'modal-content'
    });
    let $datediv = $('<div></div>', {});
    let $datelabel = $('<label></label>', {
        'text': 'Event Date:'
    });
    $datediv.append($datelabel);
    let $date = $('<input>', {
        'name': 'date',
        'type': 'date',
        'autocomplete': 'on',
        'required': ''
    });
    $datediv.append($date);
    $modalform.append($datediv);
    
    let $descdiv = $('<div></div>', {});
    let $desctxt = $('<textarea></textarea>', {
        'name': 'event-description',
        'rows': '3',
        'cols': '50',
        'required': ''
    })
    $descdiv.append($desctxt);
    $modalform.append($descdiv);
    let $linkdiv = $('<div></div>', {});
    let $linktxt = $('<input>', {
        'name': 'link',
        'type': 'text',
        'cols': '50'
    })
    $linkdiv.append($linktxt);
    $modalform.append($linkdiv);

    let $dropdown = $('<div></div>', {
        'id': 'eventDropdown'
    })
    let $option1 = $('<option></option>', {
        'class': 'icon',
        'value': 'General',
        'data-imagesrc': '../images/defaulticon.svg',
        'data-description': 'General'
    })
    $dropdown.append($option1);
    let $option2 = $('<option></option>', {
        'class': 'icon',
        'value': 'Multiplatform',
        'data-imagesrc': '../images/multipleplatform.png',
        'data-description': 'Multiplatform'
    })
    $dropdown.append($option2);
    let $option3 = $('<option></option>', {
        'class': 'icon',
        'value': 'Outdoor',
        'data-imagesrc': '../images/tent.png',
        'data-description': 'Outdoor'
    })
    $dropdown.append($option3);
    let $option4 = $('<option></option>', {
        'class': 'icon',
        'value': 'Important',
        'data-imagesrc': '../images/importanticon.svg',
        'data-description': 'Important'
    })
    $dropdown.append($option4);
    let $option5 = $('<option></option>', {
        'class': 'icon',
        'value': 'Social',
        'data-imagesrc': '../images/socialevent.png',
        'data-description': 'Social'
    })
    $dropdown.append($option5);
    let $option6 = $('<option></option>', {
        'class': 'icon',
        'value': 'Email',
        'data-imagesrc': '../images/email.png',
        'data-description': 'Email'
    })
    $dropdown.append($option6);
    let $option7 = $('<option></option>', {
        'class': 'icon',
        'value': 'Facebook',
        'data-imagesrc': 'https://cdn.worldvectorlogo.com/logos/facebook-icon.svg',
        'data-description': 'Facebook'
    })
    $dropdown.append($option7);
    let $option8 = $('<option></option>', {
        'class': 'icon',
        'value': 'Tweet',
        'data-imagesrc': 'https://cdn.worldvectorlogo.com/logos/twitter-4.svg',
        'data-description': 'Tweet'
    })
    $dropdown.append($option8);
    let $option9 = $('<option></option>', {
        'class': 'icon',
        'value': 'Google Plus',
        'data-imagesrc': '../images/google-plus.svg',
        'data-description': 'Google Plus'
    })
    $dropdown.append($option9);
    let $option10 = $('<option></option>', {
        'class': 'icon',
        'value': 'Linkedin',
        'data-imagesrc': '../images/linkedin.png',
        'data-description': 'Linkedin'
    })
    $dropdown.append($option10);
    let $option11 = $('<option></option>', {
        'class': 'icon',
        'value': 'Instagram',
        'data-imagesrc': 'https://cdn.worldvectorlogo.com/logos/instagram-2016.svg',
        'data-description': 'Instagram'
    })
    $dropdown.append($option11);
    // $modalform.append($dropdown);
    let $buttondiv = $('<div></div>', {
        'class': 'button-container'
    })
    let $update= $('<button></button>', {
        'type': 'submit',
        'class': 'submit-event',
        'data-role': 'update',
        'text': 'Update'
    })
    $buttondiv.append($update);
    $modalform.append($buttondiv);
    $EVENTMODALCONT.append($modalform);
}

// Deletes event from DOM and makes api call to delete from database
function deleteEvent(child, element, parent) {
    $.get(`/eventlist/delete/${element[0].id}`)
        .then((result) => {
            element.remove();
            if (parent[0].childElementCount === 0) {
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
        "Important": "../images/importanticon.svg",
        "Outdoor": "../images/tent.png",
        "Multiplatform": "../images/multipleplatform.png",
        "Social": "../images/socialevent.png"
    }
    return newImage[method]
}

$('#eventDropdown').ddslick({
    width: "200px",
    height: "200px",
    imagePosition: "right" 
});

addDeleteListener();
addEditListener();
addModalCloseListener();