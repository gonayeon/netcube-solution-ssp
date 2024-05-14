$(function(){
    mobileViewSideBar();
    headerMenuImageOn();
});

function headerMenuImageOn() {
    $(".nav-item").hover(function(){
        $(this).next(".menu-explain").stop().slideDown(300);
    },function(){
        $(this).next(".menu-explain").stop().slideUp(200);
    });
}

function mobileViewSideBar() {
    $('#hamburger-button').click(function(){
        $('#sideMenuWrap').animate({left: 0}, 1000);
        $('#sideMenu').animate({left: 0}, 800);
    });

    $('#sideMenuWrap').click(function(e){
        if (!$(event.target).closest('#sideMenu').length){
            $('#sideMenuWrap').animate({left: "-100%"}, 1000);
            $('#sideMenu').animate({left: "-100%"}, 1000);
        }
    });
}