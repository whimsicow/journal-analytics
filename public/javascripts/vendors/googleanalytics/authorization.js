/******************************************************************
  LOAD GOOGLE ANALYTICS LIBRARY (gives us gapi api in global scope)
******************************************************************/
(function(w,d,s,g,js,fs){
  g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(f){this.q.push(f);}};
  js=d.createElement(s);fs=d.getElementsByTagName(s)[0];
  js.src='https://apis.google.com/js/platform.js';
  fs.parentNode.insertBefore(js,fs);js.onload=function(){g.load('analytics');};
}(window,document,'script'));

gapi.analytics.ready(() => {
    gapi.analytics.auth.authorize({
        // auth-container is dom element that hosts the sign-in button during a sessions first load. sign in button can also contain an event listener to do something     else as well
        container: 'embed-api-auth-container',
        //client ID of our project from developers console (using Sarahs)
        clientid: CLIENT_ID
    })

    // return user info to console when they sign in... (name, email, profilePic)
    gapi.analytics.auth.on('signIn', function() {
        const profile = gapi.analytics.auth.getUserProfile();
        $('#embed-api-auth-container').addClass('hidden');
        $('.search-field').removeClass('hidden');
        $('.chart-navigation').removeClass('hidden');
         $('.all-charts-container').removeClass('hidden');
        $('.selector-container').removeClass('hidden');
        $('.user-info-container').removeClass('hidden');
        $('.add-event-button').removeClass('hidden');
        $.post('/users/profile', profile);
        $.post('/api/picture', profile)
            .then(setPicture)
    })

    // If user is not authorized via Google Analytics, display error message
    gapi.analytics.auth.on('needsAuthorization', function() {
        $('#embed-api-auth-container').removeClass('hidden');
        $('.search-field').addClass('hidden');
        $('.chart-navigation').addClass('hidden');
        $('.all-charts-container').addClass('hidden');
        $('.selector-container').addClass('hidden');
        $('.user-info-container').addClass('hidden');
        $('.add-event-button').addClass('hidden');
        // $('.all-charts-container').append($('<h2></h2>', {
        //     'text': 'It appears you do not have an account set up with Google Analytics. Please create an account to start visualizing your site data.',
        //     'class': 'ga-error'}));
    })
    function setPicture(result) {
        $('[data-role="profilepic"]').attr("src", result.picture); 
    }
})