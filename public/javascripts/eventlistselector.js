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
        // var request = {};
        // request['propertyid'] = data.property.id;
        // request['accountid'] = data.account.id;
        // console.log(request);
        // $.get('teammembers/search', request);
    })
    
    dateRangeSelectorEvents.on('change', (data) => {
        // updates graph
        // mainGraph.set({
        //     query: data // new start date and end date
        // }).execute()

        // Update the "from" dates text.
        // const datefield = document.getElementById('from-dates')
        // datefield.textContent = `${data['start-date']} '&mdash' ${data['end-date']}`
    })
})