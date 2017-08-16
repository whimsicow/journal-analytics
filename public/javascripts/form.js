const $ADD_EVENT = $('[data-type="open-event-popup"]');
const $FORM_CONTAINER = $('[data-popup="form-container"]');
const $CLOSE_POPUP = $('[data-popup="close-event-popup"]');

// create class and export to main.js

const saveForm = () => {
    $('[data-popup="form-container"]').submit(() => {
        event.preventDefault();
        getFormDescription();
        getDate();
        getMethod();
        console.log("saved form");
    })
}

var theDataz = {};


const getFormDescription = () => {
    var description = 'description';
    var $descrptionValue = $('[data-type="form-description"]').val();
    setLocalStorageValues(description, $descrptionValue);
}

const getDate = () => {
    var date = 'date';
    var dateValue = new Date($('input[type="date"]').val());
    dateValue = new Date( dateValue.getTime() - dateValue.getTimezoneOffset() * -60000 );
    if (isNaN(dateValue) === true) {
        dateValue = new Date();
    }
    
    setLocalStorageValues(date, dateValue);
}

function getMethod() {
    var method = $('#myDropdown').find(":selected");
    method = method['prevObject'][0]['innerText'];
    setLocalStorageValues('method', method);
}

const setLocalStorageValues = (key, keyValue) => {
    localStorage.setItem(key, keyValue);
    theDataz[key] = keyValue;
};


// event listeners for adding events and closing event popup
const plusSignButton = () => {
    $ADD_EVENT.click((event) => {
        event.preventDefault();
        openEventAddForm();
    });
};
const closePopupButton = () => {
    $CLOSE_POPUP.click((event) => {
        event.preventDefault();
        closeEventAddForm();
    });
};

const openEventAddForm = () => {
    $FORM_CONTAINER.show('slow');
};
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
document.getElementById('date').valueAsDate = new Date();


const hamburgerMenu = () => {
    $(".hamburger-icon").on('click', (event) => {
        event.preventDefault();
        console.log("Working")
        if ($('.nav-menu-mobile').is(':visible')) {
            $('.nav-menu-mobile').hide('slow');
        } else {
            $('.nav-menu-mobile').show('slow');
        }
    })
}


$('.nav-menu-mobile').hide();
hamburgerMenu();