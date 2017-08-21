$MEMBERLIST = $('[data-role="member-list"]');

gapi.analytics.ready(() => {
    
    gapi.analytics.auth.authorize({
        // auth-container is dom element that hosts the sign-in button during a sessions first load. sign in button can also contain an event listener to do something     else as well
        container: 'embed-api-auth-container2',
        //client ID of our project from developers console (using Sarahs)
        clientid: CLIENT_ID,
    })

    // return user info to console when they sign in... (name, email, profilePic)
    gapi.analytics.auth.on('signIn', function() {
     
    })
    const viewSelectorMembers = new gapi.analytics.ext.ViewSelector2({
        container: 'members-view-selector-container'
        })
            .execute();

    viewSelectorMembers.on('viewChange', (data) => {
        var request = {};
        request['propertyid'] = data.property.id;
        request['accountid'] = data.account.id;
        console.log(request);
        $.get('/teammembers/search', request)
            .then(createList)
    })
})

function createList(result) {
    var $memberscontainer = $('<div></div>', {
            "class" : "picture-box"
        });
    result.forEach(function(member) {
        var $member = $('<span></span>', {});
        var $profpic = $('<img>', {
            'src': `${member.picture}`,
            'alt': "profile photo"
        })
    })
    

}


// list">
//         <img src='{{picture}}' alt='profile photo'>
//         <a href="/teammembers/{{email}}">{{firstname}} </a>
//         {{email}} 
//     </span> 