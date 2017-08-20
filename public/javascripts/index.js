$(window).scroll(function() {
    parallax();
})

const parallax = () => {
    const wScroll = $(window).scrollTop();
    $('.parallax').css('background-position', 'center ' + (wScroll) + 'px')
}
