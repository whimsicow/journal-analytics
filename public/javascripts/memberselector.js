const $MEMBERLIST = $('[data-role="member-list"]');

gapi.analytics.ready(() => {
    
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
            .catch((error) => {
                $('[data-role="error-msg"]').append(error);
            }) 
    })
})

function createList(result) {
    if($MEMBERLIST.children()) {
            $MEMBERLIST.empty();
    }
    var $memberscontainer = $('<div></div>', {
            "class" : "picture-box"
        });
    result.forEach(function(member) {
        let $member = $('<div></div>', {});
        let $profpic = $('<img>', {
            'src': `${member.picture}`,
            'alt': "profile picture"
        })
        $member.append($profpic);
        let $link = $('<a></a>', {
            'src': `/teammembers/${member.email}`,
            'text': `${member.firstname}`
        })
        $member.append($link);
        let $email = $('<span></span>', {
            'text': `${member.email}`
        })
        $member.append($email);
        $memberscontainer.append($member);
    })
    $MEMBERLIST.append($memberscontainer);
}