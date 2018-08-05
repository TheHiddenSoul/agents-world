(function ($) {
    'use strict';

    jQuery(document).ready(function () {

        /* Preloader */
        $(window).on('load', function () {
            $('body').addClass('loaded');
        });

        /* Scroll Naviagation Background Change with Sticky Navigation */
        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 100) {
                $('.header-top-area').addClass('navigation-background');
            } else {
                $('.header-top-area').removeClass('navigation-background');
            }
        });

        /* Mobile Navigation Hide or Collapse on Click */
/*        $(document).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
                $(this).collapse('hide');
            }
        });*/

        $('body').scrollspy({
            target: '.navbar-collapse',
            offset: 195
        });

        /* Scroll To Top */
        $(window).scroll(function () {
            if ($(this).scrollTop() >= 500) {
                $('.scroll-to-top').fadeIn();
            } else {
                $('.scroll-to-top').fadeOut();
            }
        });

        $('.scroll-to-top').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 800);
            return false;
        });

        $(".carousel").swipe({
            swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                if (direction == 'left') $(this).carousel('next');
                if (direction == 'right') $(this).carousel('prev');
            },
            allowPageScroll: "vertical"
        });

        // Smooth scroll
        $('a[href*="#"]')
            .not('[href="#"]')
            .not('[href="#0"]')
            .click(function (event) {
                if (
                    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                    &&
                    location.hostname == this.hostname
                ) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        event.preventDefault();
                        $('html, body').animate({
                            scrollTop: target.offset().top
                        }, 1000, function () {
                            var $target = $(target);
                            $target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                                $target.focus(); // Set focus again
                            }
                        });
                    }
                }
            });

        /* Typed.js */
        $(window).on('load', function () {
            $(".typing").typed({
                strings: ["Are you interested in Singapore properties ?", "With a stable environment,", "Singapore provides stability", "and growth potential.", "Find out more. Contact us today."],
                typeSpeed: 60,
                loop: true,
                loopCount: Infinity
            });
        });
    });

    /* lazy loading */
    $(function($) {
        $("img.lazy").Lazy();
    });

})
(jQuery);
