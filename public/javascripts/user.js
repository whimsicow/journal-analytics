
// $(document).ready(() => {
//   //fetch events data from db
//     var request = {};
//     var accInfo = $('#view-selector-container > .ViewSelector2 > .ViewSelector2-item > .FormField').find(":selected");
//     // var max = $('#data-range-selector-container > .DataRangeSelector > .input').max();
    

//     console.log(accInfo);

//     $.get('/api/events', request)
//         .then(response => response.json())
//         .then(results => {
//             graph.catpureEventsData(results[0]);
//         })
// })


// Wait for window load
$(window).load(function() {
    // Animate loader off screen
    $("#loader").animate({
        top: -200
    }, 1500);
});
	