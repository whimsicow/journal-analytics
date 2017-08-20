const $ADD_EVENT = $('[data-type="open-event-popup"]');
const $FORM_CONTAINER = $('[data-popup="form-container"]');
const $CLOSE_POPUP = $('[data-popup="close-event-popup"]');

var eventData = {};

//gathers all information user intered into form and saves it to local storage
const saveForm = () => {
    $FORM_CONTAINER.submit(() => {
        event.preventDefault();
        if($('[data-role="status-msg"]').children()) {
            $('[data-role="status-msg"]').empty();
        }
        getFormDescription();
        getDate();
        getMethod();
        getAccount();
        getLink();
        dbStoreEvent();
        resetForm();
    })
}

// resets form if reset button is clicked
const resetButton = () => {
    $('[data-role="reset"]').click(() => {
        event.preventDefault();
        if($('[data-role="status-msg"]').children()) {
            $('[data-role="status-msg"]').empty();
        }
        resetForm();
    })
}
// when form is reset, the date changes back to current date 
const resetForm = () => {
    document.forms["eventform"].reset()
    setDefaultDate();
}
// stores event in database
const dbStoreEvent = () => {
    $.post('/api/eventstore', eventData)
        //prints to DOM that submition was successful
        .then((res) => {
            $('[data-role="status-msg"]').append(res).delay(2000).queue(function() {
                $('.status-msg').empty(); })
        })
        // catches error if any issues with savinmg 
        .catch((err) => {
            var $status = $('<span></span>', {
                'text': 'Sorry, your event could not be added at this time. Please try again.',
                'class': 'status-msg'
            });
            // prints to DOM that submition of event was unsuccesful
            $('[data-role="status-msg"]').append($status).delay(2000).queue(function() {
                $('.status-msg').empty(); })
        })
}



// stores optional link to local storage
const getLink = () => {
    var link = $('[name="link"]').val();
    setLocalStorageValues('eventlink', link);
}

// get the account property info to store in database
const getAccount = () => {
    var infoArray = $('#view-selector-container2 > .ViewSelector2 > .ViewSelector2-item > .FormField').find(":selected");
    var accountName = infoArray[0]['text'];
    var accountId = infoArray[0]['value'];
    var propertyName = infoArray[1]['text'];
    var propertyId = infoArray[1]['value'];
    setLocalStorageValues('accountName', accountName);
    setLocalStorageValues('accountId', accountId);
    setLocalStorageValues('propertyName', propertyName);
    setLocalStorageValues('propertyId', propertyId);
}

// stores description in form submition to local storage
const getFormDescription = () => {
    var description = 'description';
    var $descrptionValue = $('[data-type="form-description"]').val();
    setLocalStorageValues(description, $descrptionValue);
}

// gets date value of how local storage saves date data and saves to local storage
const getDate = () => {
    var date = 'date';
    var dateValue = new Date($('input[name="date"]').val());
    dateValue = new Date( dateValue.getTime() - dateValue.getTimezoneOffset() * -60000 ).toUTCString();
    // could take off timestamps:
    // dateValue=dateValue.split(' ').slice(0, 4).join(' ')
    setLocalStorageValues(date, dateValue);
}

// sets default date of form to current day
const setDefaultDate = () => {
    var d = new Date();
    document.getElementById('date').valueAsDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}
// method is dropdown list of icons. can selet one and save to database to be used later for overlay of maps and gathering further information
function getMethod() {
    var method = $('#myDropdown').find(":selected");
    method = method['prevObject'][0]['innerText'];
    setLocalStorageValues('method', method);
}

// how local storage is set
const setLocalStorageValues = (key, keyValue) => {
    localStorage.setItem(key, keyValue);
    eventData[key] = keyValue;
};


// event listeners for adding events and closing event popup
const plusSignButton = () => {
    $ADD_EVENT.click((event) => {
        event.preventDefault();
        if($('[data-role="status-msg"]').children()) {
            $('[data-role="status-msg"]').empty();
        }
        openEventAddForm();
    });
};

// closes popup form
const closePopupButton = () => {
    $CLOSE_POPUP.click((event) => {
        event.preventDefault();
        closeEventAddForm();
    });
};
// opens popup form
const openEventAddForm = () => {
    $FORM_CONTAINER.show('slow');
};
// closes popup form
const closeEventAddForm = () => {
    $FORM_CONTAINER.hide('slow');
};

// drop down icon menu
$('#myDropdown').ddslick({
    width: "200px",
    height: "200px",
    imagePosition: "right" 
});


////Initialization
$FORM_CONTAINER.hide();
closePopupButton();
plusSignButton();
saveForm();
resetButton();
setDefaultDate();
