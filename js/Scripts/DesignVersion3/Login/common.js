/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*=========Front-End Code=========*/

$(document).ready(function () {

    /****===Home Content===****/

    if ($('.main-slider .swiper-container').length > 0) {
        var intro = new Swiper('.main-slider .swiper-container', {
            pagination: '.main-slider .swiper-pagination',
            paginationClickable: true,
            spaceBetween: 0,
            autoplay: 5000,
            speed: 700,
            autoplayDisableOnInteraction: false,
            loop: true,
            effect: 'fade'
        });
        var msg = new Swiper('.messages .swiper-container', {
            pagination: '.messages .swiper-pagination',
            paginationClickable: true,
            spaceBetween: 0,
            autoplay: 5000,
            speed: 700,
            autoplayDisableOnInteraction: false,
            loop: true
        });
        var carousel = new Swiper('.service .swiper-container', {
            slidesPerView: 3,
            spaceBetween: 11,
            // autoplay: 5000,
            centeredSlides: true,
            speed: 700,
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                    centeredSlides: false
                },
                768: {
                    slidesPerView: 2,
                    centeredSlides: false
                },
                640: {
                    slidesPerView: 1,
                    centeredSlides: false
                }
            },

            autoplayDisableOnInteraction: false,
            nextButton: '.service .swiper-button-next',
            prevButton: '.service .swiper-button-prev',
            loop: true
        });
    }

    /****===Internal Content===****/
    var mediaQuery = $(window).width();
    $('.menu-toggle').click(function () {
        if (mediaQuery > 1024) {
            $('.rightBlock,.leftBlock').toggleClass('opened');
        } else {
            $('.rightBlock').slideToggle().removeClass('.opened');
        }
    });
    
    $('.alert').each(function (){
        $(this).find('.dismiss').click(function (){
            $(this).parent('.alert').fadeOut('fast');
        });
    });
	
	
	$('#myTabs a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})
});

function noCopyMouse(e) {
    var isRight = (e.button) ? (e.button == 2) : (e.which == 3);


    if (isRight) {
        alert('You are prompted to type this twice for a reason!');
        return false;
    }
    return true;
}


function noCopyKey(e) {
    var forbiddenKeys = new Array('c', 'x', 'v');
    var keyCode = (e.keyCode) ? e.keyCode : e.which;
    var isCtrl;


    if (window.event)
        isCtrl = e.ctrlKey
    else
        isCtrl = (window.Event) ? ((e.modifiers & Event.CTRL_MASK) == Event.CTRL_MASK) : false;


    if (isCtrl) {
        for (i = 0; i < forbiddenKeys.length; i++) {
            if (forbiddenKeys[i] == String.fromCharCode(keyCode).toLowerCase()) {
                alert('You are prompted to type this twice for a reason!');
                return false;
            }
        }
    }
    return true;
}

/*=========Developers Code=========*/

//Type your Code here