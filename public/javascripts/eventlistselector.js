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
        console.log(data);
        var request = {};
        request['propertyid'] = data.property.id;
        request['accountid'] = data.account.id;
        console.log(request);
        $.get('/events/search', request);
    })
    
    dateRangeSelectorEvents.on('change', (data) => {
        console.log(data);

    })
})