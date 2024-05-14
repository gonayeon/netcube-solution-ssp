$(function(){
    setInterval(nextSlide, 3000)
});

function nextSlide() {
    $('#notice').animate({
        top:"-100%"
    }, function (){
        $('#notice > li').eq(0).appendTo('#notice');
        $('#notice').css({
            top:0
        });
    });
}

function prevSlide() {
    $('#notice > li').last().prependTo('#notice');
    $('#notice').css({
        top: '-100%'
    }).animate({
        top: 0
    });
}

function pageButtonSelect(element) {
    $(element).children('a').addClass('active');
    $(element).siblings('.paging-btn').children('a').removeClass('active');
}