$(document).ready(function() {
    checkProgramInstall();
    init();
});

function init() {
    (userAccessInfo.deviceType === deviceTypes.PC) ? findNoticeTop5() : mobileViewSideBar();
}

function findNoticeTop5() {
    callApiWithGet("/api/v1/notices/top5").then(response => {
        drawNoticeTop5(response.data);
    }).then(()=> {
        noticeRolling(true);
    });
}
function drawNoticeTop5(notices) {
    let html = "";

    if(notices.length === 0) {
        html += `<li class="flex items-center w-full h-full text-[15px] pl-[8.5%]" style="background: #fff url(/images/main/noticeBell.svg) no-repeat 3% center/18px auto;">${javaScriptMessage.NOTICE_LO_LIST}</li>`;
        $(".scroll-updown").hide();
    } else {
        let newDate = new Date();
        let dayOfMonth = newDate.getDate();
        newDate.setDate(dayOfMonth - 7);

        let beforeWeek = newDate.getTime();
        let nowDate = new Date().getTime();

        notices.forEach(notice => {
            let listDate = new Date(notice.modifyDate).getTime();

            html += `
                        <li class="w-full h-full text-[15px] pl-[8.5%]" style="background: #fff url(/images/main/noticeBell.svg) no-repeat 3% center/18px auto;">
                            <a href='/notice/detail/${notice.noticeId}' class="grow flex items-center h-full mr-3 overflow-hidden">`;

            if(listDate <= nowDate && listDate >= beforeWeek){
                html += `<span class="mr-2">[NEW]</span>`;
            }

            html += `<span class='inline-block w-[25vw] whitespace-nowrap overflow-hidden text-ellipsis'>
                            ${notice.noticeTitle}
                            </span>
                        </a>
                    </li>`;
        });
    }

    $("#notice").html(html);
}
function noticeRolling(autoStart) {
    let $element = $('.noticeGroup').find('#notice');
    let $prev = $('#up');
    let $next = $('#down');
    let autoPlay = autoStart;
    let auto = null;
    let speed = 2000;
    let timer = null;
    let move = $element.children().outerHeight();
    let first = false;
    let lastChild;

    lastChild = $element.children().eq(-1).clone(true);
    lastChild.prependTo($element);
    $element.children().eq(-1).remove();

    if($element.children().length <= 1){
        $element.css('top','0px');
        return false;
    } else {
        $element.css('top','-'+move+'px');
    }

    if(autoPlay){
        timer = setInterval(moveNextSlide, speed);
        auto = true;
    }

    $element.find('>li').bind({
        'mouseenter': function(){
            if(auto){
                clearInterval(timer);
            }
        },
        'mouseleave': function(){
            if(auto){
                timer = setInterval(moveNextSlide, speed);
            }
        }
    });

    $prev.bind({
        'click': function(){
            movePrevSlide();
            return false;
        },
        'mouseenter': function(){
            if(auto){
                clearInterval(timer);
            }
        },
        'mouseleave': function(){
            if(auto){
                timer = setInterval(moveNextSlide, speed);
            }
        }
    });

    $next.bind({
        'click': function(){
            moveNextSlide();
            return false;
        },
        'mouseenter': function(){
            if(auto){
                clearInterval(timer);
            }
        },
        'mouseleave': function(){
            if(auto){
                timer = setInterval(moveNextSlide, speed);
            }
        }
    });

    function movePrevSlide(){
        $element.each(function(idx){
            if(!first){
                $element.eq(idx).animate({'top': '0px'},'normal',function(){
                    lastChild = $(this).children().eq(-1).clone(true);
                    lastChild.prependTo($element.eq(idx));
                    $(this).children().eq(-1).remove();
                    $(this).css('top','-'+move+'px');
                });
                first = true;
                return false;
            }

            $element.eq(idx).animate({'top': '0px'},'normal',function(){
                lastChild = $(this).children().filter(':last-child').clone(true);
                lastChild.prependTo($element.eq(idx));
                $(this).children().filter(':last-child').remove();
                $(this).css('top','-'+move+'px');
            });
        });
    }

    function moveNextSlide(){
        $element.each(function(idx){
            let firstChild = $element.children().filter(':first-child').clone(true);
            firstChild.appendTo($element.eq(idx));
            $element.children().filter(':first-child').remove();
            $element.css('top','0px');
            $element.eq(idx).animate({'top':'-'+move+'px'},'normal');
        });
    }
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
