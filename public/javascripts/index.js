$(window).scroll(function() {
    parallax();
})

const parallax = () => {
    var wScroll = $(window).scrollTop();
    $('.parallax').css('background-position', 'center ' + (wScroll) + 'px')
}