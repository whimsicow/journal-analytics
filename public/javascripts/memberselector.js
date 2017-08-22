const $MEMBERLIST = $('[data-role="member-list"]');

// Must authorize through Google in order to show ViewSelector2
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
    // Searches database when search changes
    viewSelectorMembers.on('viewChange', (data) => {
        var request = {};
        request['propertyid'] = data.property.id;
        request['accountid'] = data.account.id;
       
        $.get('/teammembers/search', request)
            .then(createList)
            
            // Appends error message if database/server connection error
            .catch((error) => {
                if($MEMBERLIST.children()) {
                    $MEMBERLIST.empty();
                }
                $MEMBERLIST.append(error.responseText);
            }) 
    })
})

// Appends results of search to DOM
function createList(result) {
    console.log(result);
    if($MEMBERLIST.children()) {
            $MEMBERLIST.empty();
    }

    if (result.length === 0) {
        $noevents = $('<p></p>', {
            'text': `No events found. Please try your search again.`,
            'class': 'event-error'
        })
        $MEMBERLIST.append($noevents);
    } else {
        var $memberscontainer = $('<div></div>', {
                "class" : "members-container"
            });
        result.forEach(function(member) {
            let $member = $('<div></div>', {
                "class" : "individual-member-container"
            });
            let $profpic = $('<img>', {
                'src': `${member.picture}`,
                'alt': "profile picture"
            })
            $member.append($profpic);
            let firstname = capitalizeFirstLetter(member.firstname)
            let $link = $('<a></a>', {
                'src': `/teammembers/${member.email}`,
                'text': `${firstname}: ${member.email}`
            })
            $member.append($link);
            // let $email = $('<span></span>', {
            //     'text': `${member.email}`
            // })
            // $member.append($email);
            $memberscontainer.append($member);
        })
        $MEMBERLIST.append($memberscontainer);
    }
}

// Capitalizes first letter of first word in a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }