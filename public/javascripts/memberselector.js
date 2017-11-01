const $MEMBERLIST = $('[data-role="member-list"]');

// Must authorize through Google in order to show ViewSelector2
gapi.analytics.ready(() => {
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
    if($MEMBERLIST.children()) {
            $MEMBERLIST.empty();
    }

    if (result.length === 0) {
        $nomems = $('<p></p>', {
            'text': `No active team members found. Please try your search again.`,
            'class': 'event-error'
        })
        $MEMBERLIST.append($nomems);
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
            
            var $namediv = $('<div></div>', {});
            let firstname = capitalizeFirstLetter(member.firstname)
            let $name = $('<span></span>', {
                'class': 'memname',
                'text': `${firstname}: `
            })
            $namediv.append($name);
            let $link = $('<a></a>', {
                'src': `/teammembers/${member.email}`,
                'text': `${member.email}`
            })
            $namediv.append($link);
            $member.append($namediv);
            $memberscontainer.append($member);
        })
        $MEMBERLIST.append($memberscontainer);
    }
}

// Capitalizes first letter of first word in a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }