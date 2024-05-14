$(function(){

});

function nextSlide(){
    $('#notice').animate({
        top:"-100%"
    }, function (){
        $('#notice > li').eq(0).appendTo('#notice');
        $('#notice').css({
            top:0
        });
    });
};


// to do: notice slide

// function movePrevSlide(){
//     $element.each(function(idx){
//         if(!first){
//             $element.eq(idx).animate({'top': '0px'},'normal',function(){
//                 lastChild = $(this).children().eq(-1).clone(true);
//                 lastChild.prependTo($element.eq(idx));
//                 $(this).children().eq(-1).remove();
//                 $(this).css('top','-'+move+'px');
//             });
//             first = true;
//             return false;
//         }

//         $element.eq(idx).animate({'top': '0px'},'normal',function(){
//             lastChild = $(this).children().filter(':last-child').clone(true);
//             lastChild.prependTo($element.eq(idx));
//             $(this).children().filter(':last-child').remove();
//             $(this).css('top','-'+move+'px');
//         });
//     });
// }

// function moveNextSlide(){
//     $element.each(function(idx){
//         let firstChild = $element.children().filter(':first-child').clone(true);
//         firstChild.appendTo($element.eq(idx));
//         $element.children().filter(':first-child').remove();
//         $element.css('top','0px');
//         $element.eq(idx).animate({'top':'-'+move+'px'},'normal');
//     });
// }