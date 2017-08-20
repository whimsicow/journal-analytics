// controls hamburger menu on small navigation
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

// starts out with menu hidden
$('.nav-menu-mobile').hide();
// initializes
hamburgerMenu();