$EVENTCONTAINER = $('[data-role="events-container"]');

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
        request['startdate'] = dateArray[0].attributes[2].value;
        console.log(dateArray);
        // $.post('/api/events', request);
    })
    
    dateRangeSelectorEvents.on('change', (data) => {
        var request = {}
        request['startdate'] = data['start-date'];
        request['enddate'] = data['end-date'];
        var idArray = $('#events-view-selector-container > .ViewSelector2 > .ViewSelector2-item > .FormField').find(":selected");
        request['accountid'] = idArray[0].attributes[1].value;
        request['propertyid'] = idArray[1].attributes[1].value;
        $.post('/api/events', request)
            .then((results) => {
                console.log(results);
            })
    })
})