$(window).scroll(function() {
    parallax();
})
// scroll effect for first window
const parallax = () => {
    const wScroll = $(window).scrollTop();
    $('.parallax').css('background-position', 'center ' + (wScroll) + 'px')
}
