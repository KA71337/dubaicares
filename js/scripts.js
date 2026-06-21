"use strict";

var $el = {},
  _screenWidth,
  _screenHeight,
  _footerHeight,
  userloggedIn,
  isDevice,
  screenWidth = $(window).width();

$(document).ready(domReady);

function cacheDom() {
  $el.htmlNbody = $("body, html");
  $el.body = $("body");
  $el.siteLoader = $(".site-loader");
  $el.header = $(".header");
  $el.siteBody = $(".site-body");
  $el.footer = $("footer");
  $el.gotoTop = $("#gotoTop");
  $el.wrapper = $(".wrapper");
  $el.instagram = $(".insta-feed__wrap");
  $el.sectionNav = $(".section-nav__header");
  $el.bannerSingleWrap = $(".banner-single__wrap");
  $el.bannerWrap = $(".banner-slider__wrap");
  $el.bannerFullScreen = $(".banner-slider__has-image");
  $el.pushDiv = $(".push");
  $el.threeColumnCarousel = $(".carousel-three-column");
  $el.threeColumnCarousel2 = $(".carousel-three-column2");
  $el.fourColumnCarousel = $(".carousel-four-column");
  $el.floatedCTA = $(".floated-cta");
  $el.carouselGallery = $(".carousel-gallery");
  $el.donationForm = $("#onlineDonation");
  $el.filters = $(".filters");
  $el.toggleBox = $(".toggle-box");
  $el.equalHeightChildren = $(".equalHeightChildren");
  $el.ceoExtraBtn = $(".about__content--extra-button");
  $el.ceoExtraDiv = $(".about__content--extra");
  $el.customScroll = $(".custom-scroll");
  $el.membersList = $(".members-list");
  $el.sectionNav = $(".section-nav");
  $el.counterSection = $(".counter-section");
  $el.siteSearchButton = $("#siteSearchButton");
  $el.topSearchPanal = $(".search-panal__wrap--top");
  $el.productList = $(".store__product-list__wrap");
  $el.productShare = $(".store__product__share-it");
  //   $el.partnership           = $('#ff_7');
  $el.partnership = $(".partner-with-us-form");
  $el.languageSwitcher = $(".language-switcher-btn");
  $el.popup = $(".popup");
  $el.signUpWithEmail = $("#signUpWithEmail");
  $el.partnersSlider = $(".partners-slider");
  $el.partnersList = $(".partners_listing");
  userloggedIn = $el.body.hasClass("logged-in") == true;
  isDevice = navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/i) != null;
}

function domReady() {
  cacheDom();

  setEvents();

  // handleSplashScreen();

  screenResize();

  bigSliderBanner(); //HomePage Banner

  search();

  //$("#wrapper").smoothWheel();

  instaFeedSlider();

  form(); //Forms

  siteNav(); //Top menu
  subMenuItems(); // Added sub menu
  scrollToDonateForm(); // scroll to donate from
  customSelect();

  $el.threeColumnCarousel.length &&
    pageListCarousel($el.threeColumnCarousel, 3); //slick
  pageListCarousel2($el.threeColumnCarousel2, 3); //slick
  $el.threeColumnCarousel.length && pageListCarousel($el.fourColumnCarousel, 4); //slick
  $el.floatedCTA.length &&
    _screenWidth >= 1000 &&
    $el.floatedCTA.stick_in_parent({ offset_top: 120, recalc_every: true }); //Call to action

  $el.carouselGallery.length && carouselGallery($el.carouselGallery); //slick
  $el.sectionNav.length && sectionNav($el.sectionNav); //membersList
  $el.membersList.length && membersList($el.membersList); //membersList
  $el.customScroll.length && customScroll($el.customScroll); //slick
  $el.filters.length && listFilters(); //filters
  $el.toggleBox.length && toggleWindow(); //Faqs
  $el.popup.length && popupContent($el.popup); //

  $el.counterSection.length && counterSection($el.counterSection); //counterSection

  $el.productList.length && porductPopUp($el.productList); //product popup
  $el.signUpWithEmail.length && signUpWithEmail(); //e.g HOME / INITIATIVES

  jarallax(document.querySelectorAll(".jarallax"), {
    disableParallax: /iPad|iPhone|iPod|Android/,
    disableVideo: /iPad|iPhone|iPod|Android/,
  });

  $el.partnersSlider.length && partnersSlider($el.partnersSlider);
  $el.partnersList.length && partnersList($el.partnersList);

  if ($(".partner-listing-mainContainer").length) {
    partnerListing();
  }
}

function scrollToDonateForm() {
  $(".form__input-wrap--radio label.d-lavel").on("click", function () {
    console.log("yess");

    if ($("#stepTwo").length) {
      setTimeout(function () {
        $("html,body").animate(
          {
            scrollTop: $("#stepTwo").offset().top - 100,
          },
          "slow",
        );
      }, 500);
    }
  });
}

function subMenuItems() {
  var ourwork = $(".submenus .our-work ul.nav");
  var volunteer = $(".submenus .volunteer ul.nav");
  var supportsus = $(".submenus .support-us ul.nav");
  var initiatives = $(".submenus .initiatives ul.nav");
  $("li#our-work").append(ourwork);
  $("li#volunteer").append(volunteer);
  $("li#support-us").append(supportsus);
  $("li#initiatives").append(initiatives);
}

function setEvents() {
  $(window)
    .load(handleWidgetsLoading)
    .resize(screenResize)
    .scroll(windowScroll);

  //scroll to top
  $el.gotoTop.click(function () {
    $("body,html").animate({
      scrollTop: 0,
    });
  });

  //close IE9 overlay
  $(".ie-overlay span").click(function () {
    $(".ie-overlay").fadeOut("slow");
  });

  $el.body.prognroll();

  $el.ceoExtraBtn.click(function () {
    $el.ceoExtraBtn.next().addClass("inn");
    $el.ceoExtraBtn.hide();
  });

  $el.languageSwitcher.on("click", function (event) {
    $.getJSON($(this).attr("href"), function (data) {
      if (data.success) {
        window.location.href = data.url + window.location.search;
        // console.log(data);
        //refreshPage();
      }
    });
    event.preventDefault();
    return false;
  });

  $(".open-popup").on("click", function () {
    $.fancybox.open({
      src: "#popupForm",
      type: "inline",
      touch: false,
      dragToClose: false,
    });

    $el.body.on("click", ".fancybox-close-small", function (e) {
      e.preventDefault();
      $.fancybox.close();
    });
  });

  document
    .querySelectorAll('a[href^="#"].advance-content__button')
    .forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
}

function screenResize() {
  _screenWidth = $(window).width();
  _screenHeight = $(window).height();

  screenWidth = $(window).width();

  //calculate footer height and assign it to wrapper and push/footer div

  // _footerHeight = $el.footer.outerHeight();
  // if(userloggedIn)
  // {
  //     $el.wrapper.css("margin-bottom", -_footerHeight + 50);
  //     $el.pushDiv.height(_footerHeight + 50);
  // }
  // else
  // {
  //     $el.wrapper.css("margin-bottom", -_footerHeight);
  //     $el.pushDiv.height(_footerHeight);
  // }

  fullscreen(".fulscreen,.advance-content--fullscreen");

  equalHeight($el.equalHeightChildren, screenWidth);

  var iframe = $(".iframeContainer iframe");
  var wrapperHeight = iframe.closest(".banner-slider__wrap").height();

  if (iframe.length) {
    //video screen sizing
    setTimeout(function () {
      iframe.closest(".banner-slider__item__video").css("opacity", "1");
    }, 1000);
    var videocontainerHeight = wrapperHeight;
    var hdmoviewidth = $(window).width();
    var iframeAspectRatio = iframe.data("aspect-ratio") || 1.7777777778;
    var heightswitch = videocontainerHeight * iframeAspectRatio;
    var hdmovieml = (heightswitch - $(window).width()) / -2;

    if ($(window).width() < heightswitch) {
      iframe.height(videocontainerHeight);
      iframe.width(heightswitch);
      iframe.css({ top: "0px" });
      iframe.css({ left: hdmovieml });
    } else {
      var hdmovieheight = $(window).width() / iframeAspectRatio;
      iframe.height(hdmovieheight);
      iframe.width(hdmoviewidth);
      iframe.css({ left: "0px", top: "0" });
    }
    if (iframe.height() > videocontainerHeight) {
      var vertVideoCenter = (iframe.height() - videocontainerHeight) / 2;
      //$("iframe").css({'margin-top':'0px'});
      iframe.css({ top: "-" + vertVideoCenter + "px" });
    }
  }
}

var search = function search() {
  $el.siteSearchButton.click(function (e) {
    e.stopPropagation();
    $el.topSearchPanal.addClass("inn");
    $el.topSearchPanal.parent().addClass("inn");
  });
  $(document).click(function (e) {
    var container = $el.topSearchPanal;
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.removeClass("inn");
      container.parent().removeClass("inn");
    }
  });
};

var bigSliderBanner = function bigSliderBanner() {
  var $slider = $el.bannerWrap.find(".banner-slider"),
    $this,
    $progressWrap,
    $paginStatus,
    $slidesLength,
    $circle,
    tick,
    val,
    percentTime,
    time = 8; //8sec

  if ($slider.length) {
    //wrap height
    if ($el.bannerFullScreen.length && $el.body.is(".ie8, .ie9, .ie10")) {
      if (_screenHeight > 900) {
        $el.bannerFullScreen.height(900);
      } else {
        $el.bannerFullScreen.height($(window).height());
      }
      $(window).resize(function () {
        if (_screenHeight > 900) {
          $el.bannerFullScreen.height(900);
        } else {
          $el.bannerFullScreen.height($(window).height());
        }
      });
    }

    $.each($slider, function () {
      $this = $(this);
      $slidesLength = $this.find(".banner-slider__item").length;
      $paginStatus = $this.parent().find(".progress__paging");
      $progressWrap = $this.parent().find(".progress__wrap");

      $this.on(
        "init reInit afterChange",
        function (event, slick, currentSlide, nextSlide) {
          //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
          var i = (currentSlide ? currentSlide : 0) + 1;
          $paginStatus.html(i + "<span>/</span>" + slick.slideCount);
        },
      );

      if ($slidesLength > 1) {
        $progressWrap.show(); //show slide counter
        $circle = $progressWrap.find(".bar");

        var startProgressbar = function startProgressbar() {
          resetProgressbar();
          percentTime = 0;
          tick = setInterval(interval, 10);
        };

        var interval = function interval() {
          percentTime += 1 / (time + 0.1);
          if (percentTime >= 100) {
            $this.slick("slickNext");
            startProgressbar();
          }

          val = Math.floor(percentTime);
          var r = $circle.attr("r"),
            c = Math.PI * (r * 2.05),
            pct = (val / 100) * c;

          $circle.css({ strokeDashoffset: pct });
        };

        var resetProgressbar = function resetProgressbar() {
          clearTimeout(tick);
        };
        startProgressbar();
      }
    });

    //slider init
    $slider.slick({
      autoplay: true,
      autoplaySpeed: 8000,
      infinite: true,
      dots: false,
      fade: true,
      cssEase: "linear",
      // nextArrow: '',
      // prevArrow: ''
      nextArrow:
        '<span class="carousel-gallery__arrows carousel-gallery__arrows--next"><i class="icon__next"></i></span>',
      prevArrow:
        '<span class="carousel-gallery__arrows carousel-gallery__arrows--prev"><i class="icon__prev"></i></span>',
    });
  }
};

var fullscreen = function fullscreen(element) {
  var $fs = $(element);
  if ($fs.length && $el.body.is(".ie8, .ie9, .ie10")) {
    $fs.width(_screenWidth);
    $fs.height(_screenHeight);
  }
};

var carouselGallery = function carouselGallery(el) {
  var slider = el;

  slider.slick({
    dots: false,
    infinite: false,
    centerMode: true,
    centerPadding: "7em",
    slidesToShow: 1,
    nextArrow:
      '<span class="carousel-gallery__arrows carousel-gallery__arrows--next"><i class="icon__next"></i></span>',
    prevArrow:
      '<span class="carousel-gallery__arrows carousel-gallery__arrows--prev"><i class="icon__prev"></i></span>',
    responsive: [
      {
        breakpoint: 767,
        settings: {
          dots: true,
          arrows: false,
          centerPadding: "15px",
          centerMode: false,
        },
      },
    ],
  });
};

var partnersSlider = function partnersSlider(el) {
  var slider = el;

  slider.slick({
    slidesToShow: 4.5,
    arrows: false,
    centerMode: false,
    infinite: true,
    autoplay: true,
    slidesToScroll: 1,
    swipeToSlide: true,
    speed: 5000,
    autoplaySpeed: 0,
    cssEase: "linear",
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3.5,
          // slidesToScroll: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          // slidesToScroll: 3,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          // slidesToScroll: 2,
        },
      },
    ],
  });
};

var pageListCarousel = function pageListCarousel(el, toShow) {
  var slider = $(el),
    nextBtn = slider.closest(".carousel-wrap").find(".carousel-next"),
    prevBtn = slider.closest(".carousel-wrap").find(".carousel-prev");
  // console.log(slider, toShow);
  slider.slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: toShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: "",
    prevArrow: "",
  });
  nextBtn.click(function () {
    slider.slick("slickNext");
  });
  prevBtn.click(function () {
    slider.slick("slickPrev");
  });
};

var pageListCarousel2 = function pageListCarousel2(el, toShow) {
  var slider = $(el),
    nextBtn = slider.closest(".carousel-wrap").find(".carousel-next"),
    prevBtn = slider.closest(".carousel-wrap").find(".carousel-prev");
  // console.log(slider);
  slider.slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: toShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: "",
    prevArrow: "",
  });
  nextBtn.click(function () {
    slider.slick("slickNext");
  });
  prevBtn.click(function () {
    slider.slick("slickPrev");
  });
};

var customScroll = function customScroll($element) {
  var $this = $($element);
  if (!$el.body.hasClass("edit-mode") && !isDevice) {
    $this.mCustomScrollbar({
      theme: "light-thick",
      scrollInertia: 400,
    });
  }
};
var equalHeight = function equalHeight(equalHeightChildren, _screenWidth) {
  var screenWidth = _screenWidth || $(window).width();
  equalHeightChildren.each(function (index, element) {
    var height = 0,
      children = $(element).children(),
      limit = $(element).data("responsive-limit") || 999;

    children.height("auto");

    if (_screenWidth <= limit) return;

    children.each(function (index2, child) {
      height = Math.max(height, $(child).outerHeight(true));
    });

    children.height(height);
  });
};

function windowScroll() {
  //toggle goto top button
  $el.gotoTop.toggleClass("active", $(window).scrollTop() > _screenHeight / 2);
}

var handleMobileMenu = function handleMobileMenu() {
  var menu = $el.header.find(".site-nav__wrap");
  if ($(undefined).hasClass("active")) {
    $(undefined).removeClass("active");
    menu.removeClass("inn");
    $el.header.removeClass("fixed");
  } else {
    $(undefined).addClass("active");
    menu.addClass("inn");
    $el.header.addClass("fixed");
  }
};

// const handleSplashScreen = () => {
//   /* loading screen */

//   /*$('.logo-middle').fadeIn(300);
//   $el.siteLoader.delay(2300).fadeOut(500);*/

//   function play_video() {
//     let played = false;
//     const player = new Vimeo.Player('logo-one', {
//       id: 808199379,
//       width: 320,
//       muted: true,
//       loop: false,
//       background: true,
//       autoplay: 1,
//     });

//     player.setPlaybackRate(0.75);

//     player.on('play', function () {
//       if (played) {
//         return;
//       }

//       player.pause();
//       player.setCurrentTime(0);
//       const player2 = new Vimeo.Player('logo-two', {
//         id: 808199392,
//         width: 320,
//         muted: true,
//         loop: false,
//         background: true,
//         autoplay: 1,
//       });

//       player2.setPlaybackRate(0.75);

//       player2.on('play', function () {
//         // player2.pause();
//         player2.setCurrentTime(0);
//         // setTimeout(() => {
//         played = true;
//         player.play();
//         player2.play();

//         $(
//           '.logo_part_one iframe , .logo_part_two iframe, .header__logo__new'
//         ).addClass('onload');
//         $('.header__logo__new a').removeClass('no_video_play');
//         setTimeout(function () {
//           if ($('.header').hasClass('animation_on')) {
//             $('.logo-video').addClass('afterload');
//             $('.logo_part_one iframe, .logo_part_two iframe').addClass(
//               'afterload'
//             );
//             $('.header__logo__new a').addClass('transform_a');
//             console.log('onload');
//             setTimeout(function () {
//               console.log('afterload');
//               $('.header__wrap, .header__logo__new').addClass('afterload');
//               // setTimeout(function() {
//               $('.header__logo__new a').addClass('afterload');
//               // }, 300);
//             }, 1000);
//             setTimeout(function () {
//               $('.header__nav--wrap').addClass('afterload');
//                   $('.header__logo__new a').addClass('first_no_video_play');
//             }, 1000);
//           }
//         }, 3600);
//         // }, 50);
//       });
//     });
//   }

//   // if ($(window).width() > 1024) {
//   // setTimeout(function () {
//   if ($('.header').hasClass('animation_on')) {
//     /*$(".logo_part_one")[0].src += "&autoplay=true";
//           $(".logo_part_two")[0].src += "&autoplay=true";*/
//     play_video();
//   }
//   // }, 100);
//   // } else {
//   // 	$('.logo-middle').fadeIn(300);
//   // 	$el.siteLoader.delay(2300).fadeOut(500);
//   // }

//   if (!$('.header').hasClass('animation_on')) {
//     setTimeout(function () {
//       // $('.logo_part_one')[0].src += '&autoplay=false';
//       // $('.logo_part_two')[0].src += '&autoplay=false';
//       $('.header__logo__new a').addClass('no_video_play');
//       $('.header__wrap').addClass('no_video_play');
//     }, 100);
//   }
// };

var handleWidgetsLoading = function handleWidgetsLoading() {
  // document.addEventListener('contextmenu', event => event.preventDefault());
};
var customSelect = function customSelect() {
  // $('option').on('mouseover', e => {
  //   const $this = $(e.currentTarget);
  //   console.log('enter');
  //   $this.removeClass('off');
  //   $this.addClass('on');
  // });
  // $('option').on('mouseleave', e => {
  //   const $this = $(e.currentTarget);
  //   $this.removeClass('on');
  //   $this.addClass('off');
  // });
};

var siteNav = function siteNav() {
  var previousScroll = 0,
    $header = $el.header,
    $wrapper = $header.parent(),
    $nav = $header.find(".header__nav--static, .header__nav--site"),
    $mToggle = $header.find("#mobileMenuToggle"),
    $toggle = $header.find("#menuToggle");

  $(window).scroll(function () {
    if (_screenWidth >= 1000) {
      var currentScroll = $(this).scrollTop();
      if (currentScroll == 0) {
        window.setTimeout(defaultNav, 50);
      } else if (
        currentScroll > 150 &&
        currentScroll < $(document).height() - $(window).height()
      ) {
        if (currentScroll > previousScroll) {
          window.setTimeout(hideNav, 50);
        } else {
          window.setTimeout(showNav, 50);
        }
        previousScroll = currentScroll;
      }
    } else if (_screenWidth < 1000) {
      window.setTimeout(defaultNav, 50);
    }
  });

  //remove classes on resize
  $(window).resize(function () {
    if (_screenWidth < 1000) {
      window.setTimeout(defaultNav, 50);
      $wrapper.addClass("header__wrap--mobile");
    } else if (_screenWidth >= 1000) {
      $wrapper.removeClass("header__wrap--mobile");
    }
  });
  //remove classes on load
  if (_screenWidth < 1000) {
    if (
      $wrapper.hasClass("header__is-hidden") ||
      $wrapper.hasClass("header__is-visible")
    ) {
      window.setTimeout(defaultNav, 50);
    }
    $wrapper.addClass("header__wrap--mobile");
  } else if (_screenWidth >= 1000) {
    $wrapper.removeClass("header__wrap--mobile");
  }

  var hideNav = function hideNav() {
    $wrapper.removeClass("header__is-visible").addClass("header__is-hidden");
  };
  var showNav = function showNav() {
    $wrapper.removeClass("header__is-hidden").addClass("header__is-visible");
  };
  var defaultNav = function defaultNav() {
    $wrapper.removeClass("header__is-hidden, header__is-visible");
  };

  var menuToggle = $toggle.click(function () {
    $(undefined).toggleClass("menu-open");
    $wrapper.toggleClass("header__full");
  });

  //Mobie menu
  var mobileMneu = $mToggle.click(function () {
    $nav.toggleClass("inn");
  });
};

var sectionNav = function sectionNav($element) {
  var scrollLink = $($element).find(".sub-nav__link");
  var offsetVal = 60,
    offsetFix = function offsetFix() {
      if (userloggedIn) {
        var v = offsetVal + 50;
        return v;
      } else {
        var _v = offsetVal;
        return _v;
      }
    };

  scrollLink.click(function (e) {
    e.preventDefault();
    $("body,html")
      .stop()
      .animate(
        {
          scrollTop: $(this.hash).offset().top - offsetFix(),
        },
        1000,
      );
    return false;
  });

  // $(window).scroll(function() {
  //     // var scrollbarLocation = $(this).scrollTop();
  //     scrollLink.each(function() {
  //     var sectionOffset = $(this.hash).offset().top - offsetFix();
  //     });
  // })
};

var counterSection = function counterSection($element) {
  var $container = $($element),
    $counterEl = $container.find(".counter-value");

  var a = 0;
  $(window).scroll(function () {
    var oTop = $container.offset().top - window.innerHeight;
    if (a == 0 && $(window).scrollTop() > oTop) {
      $counterEl.each(function () {
        var $this = $(this);
        var num = $this.attr("data-count");
        $this.prop("Counter", 0).animate(
          {
            Counter: num,
          },
          {
            duration: 2000,
            easing: "swing",
            step: function step(now) {
              // $(this).text(Math.ceil(now));
              if (num % 1 === 0) {
                $(this).text(
                  String(Math.ceil(now)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                );
              } else {
                $(this).text(
                  now.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                );
              }
            },
          },
        );
        // $({
        //     countNum: $this.text()
        // }).animate({
        //     countNum: countTo
        // },
        // {
        // duration: 5000,
        // easing: 'swing',
        // step: function(now) {
        //     $(this).text(
        //         now.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        //       );
        //     // $this.text(Math.floor(this.countNum).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        // },
        // complete: function() {
        //     $this.text(this.countNum);
        //     $this.text(this.countNum.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        //     //alert('finished');
        // }
        // });
      });
      a = 1;
    }
  });
};

var listFilters = function listFilters() {
  var selectOrder = $el.filters.find("#order"),
    clickToUpdate = $el.filters.find(".select-click"),
    searchButton = $el.filters.find(".btn-go"),
    form = $el.filters.find("#searchform");

  clickToUpdate.click(function () {
    selectOrder.val($(this).data("val")).trigger("change");
  });

  searchButton.on("click", function () {
    form.submit();
  });
  selectOrder.on("change", function (event) {
    form.submit();
    return false;
  });
};

//Members list;
var membersList = function membersList($element) {
  var $this = $($element),
    $item = $this.find(".members-list__item");

  //listing see more
  // $this.each(function() {
  //     var $seeAll = $(this).next();

  //     $(window).resize(function() {
  //         if ($(window).width() > 767 && $(this).children().length > 3)
  //         {
  //             $seeAll.show();
  //         }
  //     });
  //     if ($(this).children().length > 3)
  //     {
  //         $seeAll.show();
  //         $seeAll.click(()=>{
  //             $(this).closest('.section-nav__body').removeClass('limited-view');
  //             $seeAll.hide();
  //         });
  //     }
  // });

  //PopUp window // e.g About page
  $item.on("click", function () {
    if ($("body.ar").length > 0) {
      // var backtopage = 'back to page';
      var backtopage = "العودة إلى الصفحة السابقة";
    } else {
      backtopage = "back to page";
    }
    var title = $(this).find(".members-list__title").text(),
      listingTitle = $(this)
        .closest("section")
        .find(".popup-back-caption")
        .text(),
      designation = $(this).find(".members-list__decp").text(),
      imageSrc = $(this).find(".members-list__image img").data("fullsize"),
      content = $(this).find(".members-list__content").html(),
      template =
        '<div class="member">\n                                <div class="member__column__wrap">\n                                    <div class="member__column__image">\n                                        <div class="member__image__src" style="background-image:url(' +
        imageSrc +
        ')"></div>\n                                    </div>\n                                    <div class="member__column__content">\n                                        <div class="member__column__body content">\n                                        <div class="member__close-button"><i class="icon__back"></i>' +
        backtopage +
        '</div>\n                                            <h2 class="member__name">' +
        title +
        "</h2>\n                                            " +
        (designation.length > 0 ? "<p>" + designation + "</p> <hr/>" : "") +
        "\n                                            " +
        (content.length > 0
          ? '<div class="member__content">' + content + "</div>"
          : "") +
        "\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>";

    function applePie() {
      return navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
    }

    $.fancybox.open(template, {
      touch: false,
    }); //init Popup

    //(!isDevice) && $(".member__content").mCustomScrollbar();//scroll bar

    $(".member__close-button").click(function () {
      $.fancybox.close();
    });

    return false;
  });
};

var partnerListing = function partnerListing() {
  var page = 1;
  var mainContainer = $(".partner-listing-mainContainer");
  var hasLoadMore = mainContainer.find("#hasLoadMore").val();
  var itemList = mainContainer.find(".listing-js");
  var timer = void 0;
  var nextPage = function nextPage() {
    clearTimeout(timer);
    hasLoadMore = false;
    timer = setTimeout(loadMore, 1000);
  };
  var loadMore = function loadMore() {
    page += 1;
    $.ajax({
      dataType: "html",
      type: "GET",
      data: {
        isAjax: true,
        page: page,
      },
      url: location.origin + location.pathname,
      success: appendItems,
    });
  };
  var appendItems = function appendItems(response) {
    console.log("nextPage");
    response = JSON.parse(response);
    hasLoadMore = response.loadMoreValue ? true : false;
    if (response.success && response.data) {
      itemList.append(response.data);
      $el.partnersList.length && partnersList($el.partnersList);
    }
  };

  $(window).scroll(function () {
    if (hasLoadMore) {
      nextPage();
    }
  });
};

//partners list
var partnersList = function partnersList($element) {
  var $this = $($element),
    $item = $this.find(".partner-card.popupEnabled");

  //PopUp window // e.g About page
  $item.on("click", function () {
    console.log($(this), "partner card");
    var campaign_title = "";
    var campaign_dur_title = "";
    var iacad_title = "";
    var read_more_title = "";
    if ($("body.ar").length > 0) {
      // var backtopage = 'back to page';
      var backtopage = "العودة إلى الصفحة السابقة";
      campaign_title = "Name of the campaign:";
      campaign_dur_title = "Campaign duration:";
      iacad_title = "IACAD permit number: ";
      read_more_title = "Read More";
    } else {
      backtopage = "back to page";
      campaign_title = "Name of the campaign:";
      campaign_dur_title = "Campaign duration:";
      iacad_title = "IACAD permit number: ";
      read_more_title = "Read More";
    }
    var title = $(this).attr("data-title");
    var description = $(this).attr("data-description");
    var campaignName = $(this).attr("data-campaign");
    var campaignDuration = $(this).attr("data-campaignduration");
    var icadCard = $(this).attr("data-card");
    var href = $(this).attr("data-href");

    console.log(href, "href");

    var imageSrc = $(this).attr("data-logo"),
      template =
        '<div class="member partners_popup">\n      <div class="overlay"></div>\n\t   <div class="member__column__wrap">\n\t  \t<div class="member__column__image">\n\t\t    ' +
        (imageSrc !== "undefined"
          ? '<img src="' + imageSrc + '" alt="' + title + '" />'
          : "") +
        '\n\t\t  </div>\n\t\t<div class="member__column__content">\n\t\t  <div class="member__column__body content">\n\t\t\t\n\t\t\t' +
        (description.length !== "undefined"
          ? '<div class="member__content">\n\t\t\t\t      ' +
            description +
            "\n             </div>"
          : "") +
        "\n\t\t\t  \n\t\t\t\t\n      " +
        (href !== ""
          ? '\n        <a class="advance-content__button" href="' +
            href +
            '" target="_blank">' +
            read_more_title +
            "</a>\n        "
          : "") +
        "\n\t\t  </div>\n\t\t</div>\n\t  </div>\n\t</div>\n\t\t\t  ";

    function applePie() {
      return navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
    }

    $.fancybox.open(template, {
      touch: false,
    }); //init Popup

    !isDevice && $(".partner__content").mCustomScrollbar(); //scroll bar

    $(".partner__close-button").click(function () {
      $.fancybox.close();
    });

    return false;
  });
};

//e.g One Column Popup //e.g SUPPORT A PROGRAM
var popupContent = function popupContent($element) {
  var $this = $($element),
    $item = $this.find(".popup__link");

  $item.on("click", function () {
    if ($("body.ar").length > 0) {
      // var backtopage = 'back to page';
      var backtopage = "العودة إلى الصفحة السابقة";
    } else {
      backtopage = "back to page";
    }
    var title = $(this).closest(".popup").find(".popup__title").text(),
      listingTitle = $(".page-banner__title").text(),
      designation = $(this).find(".popup__decp").text(),
      imageSrc = $(this)
        .closest(".popup")
        .find(".popup__image")
        .data("fullsize"),
      content = $(this).closest(".popup").find(".popup__content").html(),
      template =
        '<div class="member">\n                                <div class="member__column__wrap">\n                                    <div class="member__column__image">\n                                        <div class="member__image__src" style="background-image:url(' +
        imageSrc +
        ')"></div>\n                                    </div>\n                                    <div class="member__column__content">\n                                        <div class="member__column__body content">\n                                            <div class="member__close-button"><i class="icon__back"></i>' +
        backtopage +
        '</div>\n                                            <h2 class="member__name">' +
        title +
        "</h2>\n                                            " +
        (designation.length > 0 ? "<p>" + designation + "</p> <hr/>" : "") +
        "\n                                            " +
        (content.length > 0
          ? '<div class="member__content">' + content + "</div>"
          : "") +
        "\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>";

    function applePie() {
      return navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
    }

    $.fancybox.open(template); //init Popup

    //(!isDevice) && $(".member__content").mCustomScrollbar();//scroll bar

    $(".member__close-button").click(function () {
      $.fancybox.close();
    });

    return false;
  });
};

var porductPopUp = function porductPopUp($element) {
  var $container = $($element),
    $item = $container.find(".store__product-list__item--image");

  //PopUp window
  $.each($item, function () {
    var $this = $(this),
      link = $this.find(".store__product__link"),
      url = link.attr("href"),
      product_id = link.attr("rel"),
      overlay = void 0;

    $this.click(function () {
      //add overlay
      $el.body.append('<div class="store__product__ajax-overlay"></div>');

      var data = function data() {},
        overlay = $el.body.find(".store__product__ajax-overlay");

      overlay.fadeIn();

      $.ajax({
        url: url,
        success: function success(result) {
          data = $(result).find(".store__product").html();
          $.fancybox.open(data);

          // Remove overlay
          overlay.fadeOut();
          setTimeout(function () {
            overlay.remove();
            pageShare($(".store__product__share-it")); //add this share;
          }, 1000);
        },
      });

      function applePie() {
        return navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
      }

      $(".store__product__close-button").click(function () {
        $.fancybox.close();
      });

      return false;
    });
  });
};

var pageShare = function pageShare($element) {
  var $linkContainer = $($element),
    $linkFb = $linkContainer.find(".store__product__share-it--fb"),
    $linkLn = $linkContainer.find(".store__product__share-it--ln"),
    $linkTw = $linkContainer.find(".store__product__share-it--tw"),
    $linkEm = $linkContainer.find(".store__product__share-it--em");

  setTimeout(function () {
    var $addThisContainer = $(".at-resp-share-element"),
      $addThisFb = $addThisContainer.find(".at-svc-facebook span"),
      $addThisTw = $addThisContainer.find(".at-svc-twitter span"),
      $addThisLn = $addThisContainer.find(".at-svc-linkedin span"),
      $addThisEm = $addThisContainer.find(".at-svc-email span");

    if ($addThisContainer.length) {
      $linkFb.click(function () {
        $addThisFb.click();
      });
      $linkLn.click(function () {
        $addThisLn.click();
      });
      $linkTw.click(function () {
        $addThisTw.click();
      });
      $linkEm.click(function () {
        $addThisEm.click();
      });
    }
  }, 1000);
};

var instaFeedSlider = function instaFeedSlider() {
  if ($el.instagram.length) {
    var htmlString = "";
    $.ajax({
      type: "GET",
      url: "https://www.juicer.io/api/feeds/dubaicares?per=800",
      data: { get_param: "value" },
      dataType: "json",
      success: function success(data) {
        // console.log(data);
        var allPosts = data.posts.items;

        allPosts.map(function (post) {
          // console.log(post);
          var contentString =
            '<li class="insta-feed__item">\n                <span class="icon__instagram"></span>\n                <a href="' +
            post.full_url +
            '" target="_blank" class="insta-feed" style="background-image:url(\' ' +
            post.image +
            "')\"></a>\n                </li>";

          $("#instafeed").append(contentString);
        });
        var options = {
          horizontal: 1,
          itemNav: "basic",
          smart: 1,
          activateMiddle: 1,
          activateOn: "click",
          mouseDragging: 1,
          touchDragging: 1,
          releaseSwing: 1,
          startAt: 0,
          scrollBy: 1,
          speed: 600,
          elasticBounds: 0,
          //easing: 'easeOutExpo',
          dragHandle: 1,
          dynamicHandle: 1,
          prev: $el.instagram.find(".prev"),
          next: $el.instagram.find(".next"),
        };
        var feedWrap = $el.wrapper.find("#feeds");
        new Sly(feedWrap, options).init();
      },
    });
  }
};

var toggleWindow = function toggleWindow() {
  $.each($el.toggleBox, function () {
    var $this = $(this),
      $thisHeader = $(this).find(".toggle-box__header");

    $thisHeader.click(function () {
      $this.toggleClass("toggle-box__inn");
      $this.siblings().removeClass("toggle-box__inn");
    });
  });
};

var form = function form() {
  var inputTyping = $(
    "\
                            .form__input-group .form__input--text,\
                            .form__input-group form__input--textarea,\
                            .formidable .element .ccm-input-text,\
                            .formidable .element .ccm-input-email,\
                            .formidable .element .ccm-input-tel,\
                            .formidable .element.integer input,\
                            .form .column .controls > .ccm-input-text,\
                            .form .ccm-attribute-address-composer-wrapper .control-group .ccm-input-text\
                        ",
  );

  inputTyping.each(function () {
    var $this = $(this),
      $defaultEl = $this
        .closest(".form__input-group")
        .find(".form__input--label, .form__input-wrap--typing"),
      $formidableEl = $this.closest(".element").find(".label, .input"),
      $ccmEl = $this
        .closest(".control-group")
        .find(".control-label, .controls");

    // Focus input if it has a placeholder attribute and add focus classes
    if ($this.attr("placeholder")) {
      $this.focus();
      $defaultEl.addClass("focus");
      $formidableEl.addClass("focus");
      $ccmEl.addClass("focus");
    }

    if ($(this).val().length > 1) {
      $defaultEl.addClass("focus");
      $formidableEl.addClass("focus"); //formidable
      $ccmEl.addClass("focus"); //CoreCom
    }

    $this.focusin(function () {
      $defaultEl.addClass("focus");
      $formidableEl.addClass("focus"); //formidable
      $ccmEl.addClass("focus"); //CoreCom
      setTimeout(function () {
        if ($(".datepicker-container").length) {
          $(".datepicker-container").on("click", function () {
            $this
              .closest(".date")
              .find("input.datepicker, input.form__input")
              .focus();
          });
        }
      }, 50);
    });
    $(this).focusout(function () {
      var _this = this;

      // If input has a placeholder, always keep focus classes
      if ($(_this).attr("placeholder")) {
        $defaultEl.addClass("focus");
        $formidableEl.addClass("focus");
        $ccmEl.addClass("focus");
        if ($(_this).val().length > 0) {
          $defaultEl.addClass("filled");
          $formidableEl.parent().addClass("filled");
          $ccmEl.addClass("filled");
        } else {
          $defaultEl.removeClass("filled");
          $formidableEl.parent().removeClass("filled");
          $ccmEl.removeClass("filled");
        }
        return;
      }

      if ($(this).val().length < 1) {
        $defaultEl.removeClass("focus");
        $formidableEl.removeClass("focus"); //formidable
        $ccmEl.removeClass("focus"); //CoreCom

        $defaultEl.removeClass("filled");
        $formidableEl.parent().removeClass("filled"); //formidable
        $ccmEl.removeClass("filled"); //formidable
      } else {
        $defaultEl.addClass("filled");
        $formidableEl.parent().addClass("filled"); //formidable
        $ccmEl.addClass("filled"); //formidable
      }
      if ($(".datepicker")) {
        setTimeout(function () {
          console.log($(_this).val());
          if ($(_this).val().length < 1) {
            $(_this).removeClass("focus");
            $(_this).removeClass("filled");
          } else {
            $(_this).addClass("filled");
            $(_this).parent().addClass("focus");
            $(_this)
              .closest(".date")
              .addClass("filled")
              .find(".label")
              .addClass("focus");
          }
        }, 200);
      }
    });
  });

  //var $dateOfLeaving = null;
  // $('input[id^=present]').on('change', function(){
  //     var $this = $(this);
  //     var $parent = $this.parents('.element');
  //     var checked = !!$this.attr('checked');
  //     if(checked) {
  //         $('.element').each(function() {
  //             var $this = $(this);
  //             var obj = $this[0].classList;
  //             var exists = Object.keys(obj).some(function(key) {
  //             return obj[key].indexOf('date-of-leaving') >= 0;
  //         });
  //             if(exists) {
  //                 $dateOfLeaving = $this;
  //                 $this.remove();
  //             }
  //         });
  //     } else {
  //     $parent.after($dateOfLeaving);
  //     $dateOfLeaving = null;
  //     }
  // });

  $("input[id^=present], input[class^=present]").on("change", function () {
    var $this = $(this);
    var checked = !!$this.attr("checked");
    if (checked) {
      $("[class*=date-of-leaving-]").hide();
      $(".date-of-leaving").closest(".element").hide();

      $("[class*=reason-for-leaving-]").hide();
      $(".reason-for-leaving").closest(".element").hide();
    } else {
      $("[class*=date-of-leaving-]").show();
      $(".date-of-leaving").closest(".element").show();

      $("[class*=reason-for-leaving-]").show();
      $(".reason-for-leaving").closest(".element").show();
    }
  });
  $("input[id^=residence]").on("change", function () {
    var $this = $(this);
    var checked = !!$this.attr("checked");
    if (checked) {
      $("[class*=residence-visa-], [class*=emirates-id-]").show();
    } else {
      $("[class*=residence-visa-], [class*=emirates-id-]").hide();
    }
  });

  //formidable form
  $(".formidable .radio.w100").click(function () {
    if ($(this).find("input").is(":checked")) {
      $(this).siblings().removeClass("checked");
      $(this).addClass("checked");
    }
  });
  //formidable form
  $(".formidable .checkbox.w100").click(function () {
    if ($(this).find("input").is(":checked")) {
      $(this).toggleClass("checked");
    }
  });

  //Radio donation
  $(
    ".form__input-wrap--radio label, .form__input-wrap--radio-tags label",
  ).click(function () {
    if ($(this).find("input").is(":checked")) {
      $(this).parent().siblings().removeClass("checked");
      $(this).parent().addClass("checked");
    }
  });

  $(".sms--donation--landing .form__input-wrap--radio .form__input").on(
    "click",
    function () {
      var deg = $(this).val();
      deg = deg < 100 ? "0" + deg : deg;
      window.location.href = "sms:9" + deg + "?&body=donate";
    },
  );

  //Radio other
  $(".is-other label .form__input").on("change", function () {
    $(this).closest(".is-other").find(".form__input--text").focus();
    $(this).closest(".is-other").find(".form__input--text").val("");
  });

  //Checkbox donation
  $(".form__input-wrap--checkbox label").click(function () {
    if ($(this).find("input").is(":checked")) {
      $(this).parent().toggleClass("checked");
    }
  });

  //Donation form;
  var donateBehalf = $("#onlineDonation .form__input-wrap--behalfof");
  if ($el.donationForm.length) {
    var _form = $el.donationForm,
      recurring = _form.find("#recurring"),
      oneTime = _form.find("#oneTime"),
      dob = _form.find("#dateOfBirth"),
      stepOne = _form.find("#stepOne"),
      stepTwo = _form.find("#stepTwo"),
      personalInfo = _form.find("#personalInfo"),
      donationOptions = _form.find(".donation__options"),
      donatingCaption = $("#donating"),
      valueAgree = $("#valueAgree"),
      recAgree = $("#recurrVal"),
      recValAgree = $("#recur"),
      amount,
      recurr,
      recurrVal;

    stepOne.find(".form__input-wrap--radio").on("click", function () {
      var captionValue = $(this).find("label").data("donating");
      amount = $(this).find("input").val();
      if ($(this).hasClass("form__input-wrap--donate")) {
        donatingCaption.html("<p>" + captionValue + "</p>");
      } else if ($(this).hasClass("is-other")) {
        donatingCaption.html("<p>" + captionValue + "</p>");
      }
      stepTwo.addClass("inn");

      var valueRec = personalInfo.find("input");
      if (valueRec.hasClass("value-recurring")) {
        if (amount != "amount specified") {
          if ($el.body.hasClass("ar")) {
            valueAgree.html(" أوافق على التبرع  بـ" + amount);
          } else {
            valueAgree.html("I agree to donate AED" + amount);
          }
        } else {
          if ($el.body.hasClass("ar")) {
            valueAgree.html(" أوافق على التبرع  بـ" + amount);
          } else {
            valueAgree.html("I agree to donate  " + amount);
          }
        }
      }
      document.getElementById("printchatbox").innerHTML = "";
      $(".chatinput").val("");
    });

    $(".chatinput").on("keyup", function () {
      $(".form__input-wrap--donate").removeClass("checked");
    });

    stepOne.find(".form__input-wrap--radio").click(function () {
      personalInfo.addClass("inn");
    });

    donateBehalf.click(function () {
      if ($(this).find("input").is(":checked")) {
        $(".inhonorof").css("display", "block");
        $(".thr-email").css("display", "block");
        $(".message").css("display", "block");
      } else {
        $(".inhonorof").css("display", "none");
        $(".thr-email").css("display", "none");
        $(".message").css("display", "none");
      }
    });

    oneTime.click(function () {
      var valueRec = personalInfo.find("input");

      if ($(this).children().is(":checked")) {
        donationOptions.removeClass("active");

        if (valueRec.hasClass("value-recurring")) {
          recAgree.html("&nbsprecurring one time.");
        }
      }
    });

    recurring.click(function () {
      if ($(this).children().is(":checked")) {
        donationOptions.addClass("active");
      }
    });

    recurring.on("change", function () {
      recurr = $(this).find("input").val();
      donationOptions
        .find(".form__input-wrap--radio-tags")
        .removeClass("checked");
      donationOptions
        .find(".form__input-wrap--radio-tags .form__input")
        .prop("checked", false);

      donationOptions.find(".form__input-wrap--radio-tags").click(function () {
        recurrVal = $(this).find("input").val();
        var valueRec = personalInfo.find("input");

        if (valueRec.hasClass("value-recurring")) {
          if (recurrVal != "one-time-donation") {
            recAgree.html("&nbsprecurring " + recurrVal + ".");
          } else {
            recAgree.html("nbspone time donation");
          }
        }
      });
    });

    dob.datepicker({
      autoHide: true,
      format: "mm-dd-yyyy",
    });
    var amount = "";

    $(".form__input-wrap--radio .form__input").on("click", function () {
      amount = $(this).val();
      console.log(amount);
      $(".choosen-amount").show();
      $(".choosen-amount .d-amount").text(amount);
    });
    $(".is-other .form__input").on("click", function () {
      amount = $(this).val();
      $(".choosen-amount").hide();
    });

    _form.find('button[type="submit"]').prop("disabled", true);

    var donation = new Donation();
    donation.init($el.donationForm);
  }

  //Partner with us form

  var $individual = $el.partnership.find(".for-individual"),
    $submitions = $(
      ".partner-with-us-form>div:nth-child(7), .partner-with-us-form>div:nth-child(8)",
    ),
    $organization = $el.partnership.find(".for-organization");

  $el.body.on("change", "select.choose-application-type", function () {
    var appType = $(this).val(),
      individual = appType == "Individual" || appType == "فرد",
      organization = appType == "Organization" || appType == "منظمة";
    console.log(appType);
    if (individual) {
      $individual.show();
      $organization.hide();
      $organization.parents(".element").hide();
      $submitions.hide();
    } else if (organization) {
      $individual.hide();
      $organization.show();
      $organization.parents(".element").show();
      $submitions.show();
    } else {
      $individual.hide();
      $organization.hide();
      $organization.parents(".element").hide();
      $submitions.hide();
    }
  });
  $("select.choose-application-type").trigger("change");

  var inputTel = $(
    ".form__input-group--tel .form__input--text, .phone .ccm-input-tel",
  );
  inputTel.intlTelInput({
    excludeCountries: ["il"],
    allowExtensions: true,
    formatOnDisplay: true,
    autoFormat: true,
    autoHideDialCode: true,
    autoPlaceholder: false,
    defaultCountry: "ae",
    nationalMode: false,
    numberType: "MOBILE",
    preventInvalidNumbers: true,
    initialCountry: "ae",
    // geoIpLookup: function(callback) {
    //   $.get('http://ipinfo.io', function() {}, 'jsonp').always(function(resp) {
    //     var countryCode = resp && resp.country ? resp.country : '';
    //     callback(countryCode);
    //   });
    // }
  });

  $("body.ar input.ccm-input-submit").val("تقديم");
  $("body.ar button.ccm-input-submit").text("تقديم");
};

var signUpWithEmail = function signUpWithEmail() {
  var container = $el.signUpWithEmail,
    postEmail = container.find("#postEmail"),
    submit = container.find(".submit"),
    formTitle = container.prev(".form__title").html(),
    popTitle = container.next("#popupForm").find(".popup-form__title"),
    // Formidable Form popup
    formWrapper = $el.body.find(".formidable"),
    email = formWrapper.find(".emailaddress"),
    // validate
    emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  if (formWrapper.length && email.length) {
    postEmail.on("keyup", function (e) {
      if (postEmail.val().length > 5 && emailReg.test(postEmail.val())) {
        submit.addClass("inn");
        if (e.keyCode === 13) {
          console.log("enter");
          submit.click();
        }
      } else {
        submit.removeClass("inn");
      }
    });
    submit.on("click", function (e) {
      if (popTitle.html() == "") {
        popTitle.append(formTitle);
      }
      email.addClass("filled");
      email.find(".label").addClass("filled focus");
      email.find(".input").addClass("focus");
      email.find(".ccm-input-email").val(postEmail.val());
    });
  }
};

(function init() {
  if ($(".formidable_row").length > 0) {
    $(".formidable_row .country").find('[value="IL"]').remove();
  }

  //detect mobile platform
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    $("body").addClass("ios-device");
  }
  if (navigator.userAgent.match(/Android/i)) {
    $("body").addClass("android-device");
  }

  //detect desktop platform
  if (navigator.appVersion.indexOf("Win") != -1) {
    $("body").addClass("win-os");
  }
  if (navigator.appVersion.indexOf("Mac") != -1) {
    $("body").addClass("mac-os");
  }

  //detect IE 10 and 11
  if (
    navigator.userAgent.indexOf("MSIE") !== -1 ||
    navigator.appVersion.indexOf("Trident/") > 0
  ) {
    $("html").addClass("ie10");
  }

  //detect IE Edge
  if (/Edge\/\d./i.test(navigator.userAgent)) {
    $("html").addClass("ieEdge");
  }

  //Specifically for IE8 (for replacing svg with png images)
  if ($("html").hasClass("ie8")) {
    var imgPath = "/themes/theedge/images/";
    $("header .logo a img,.loading-screen img").attr(
      "src",
      imgPath + "logo.png",
    );
  }

  //show ie overlay popup for incompatible browser
  if ($("html").hasClass("ie9")) {
    var message = $(
      '<div class="no-support"> You are using outdated browser. Please <a href="https://browsehappy.com/" target="_blank">update</a> your browser or <a href="https://browsehappy.com/" target="_blank">install</a> modern browser like Google Chrome or Firefox.<div>',
    );
    $("body").prepend(message);
  }
})();

//})(jQuery);

//Uncomment below if you need to add google captcha (also in includes/script.php) => Make sure the SITEKEY is changed below
var CaptchaCallback = function CaptchaCallback() {
  $(".g-recaptcha").each(function (index, el) {
    var lang = $("html").attr("lang");
    grecaptcha.render(el, {
      sitekey: "6LdyJf0UAAAAACkN9xdD-MeRIT6IwiK0KBeLN_nw",
      hl: lang,
    });
  });
};

function showFormErrors($form, errors) {
  if (
    !$form ||
    !($form instanceof jQuery) ||
    $form.length < 1 ||
    !errors ||
    errors.constructor !== Array ||
    errors.length < 1
  ) {
    return;
  }

  var $errors = $("<ul>").attr({ class: "ccm-error" });
  errors.forEach(function (error) {
    $errors.append($("<li>").text(error));
  });
  $form.before($errors);
}

function removeFormErrors($form) {
  if (!$form || !($form instanceof jQuery) || $form.length < 1) {
    return;
  }

  $form.prevAll(".ccm-error").remove();
}

var Donation = function Donation() {
  var _this2 = this;

  this.init = function ($form) {
    _this2.form = $form;
    _this2.firstName = _this2.form.find(".donation-firstName");
    _this2.lastName = _this2.form.find(".donation-lastName");
    _this2.phoneNumber = _this2.form.find(".donation-phoneNumber");
    _this2.email = _this2.form.find(".donation-email");
    _this2.address = _this2.form.find(".donation-address");
    _this2.city = _this2.form.find(".donation-city");
    _this2.zip = _this2.form.find(".donation-zip");
    _this2.state = _this2.form.find(".donation-state");
    _this2.country = _this2.form.find("#country-select");
    _this2.errorfirstName = _this2.form.find(".error-firstName");
    _this2.errorlastName = _this2.form.find(".error-lastName");
    _this2.errorphoneNumber = _this2.form.find(".error-phoneNumber");
    _this2.erroremail = _this2.form.find(".error-email");
    _this2.erroraddress = _this2.form.find(".error-address");
    _this2.errorcity = _this2.form.find(".error-city");
    _this2.errorzip = _this2.form.find(".error-zip");
    _this2.errorstate = _this2.form.find(".error-state");
    _this2.errorcountry = _this2.form.find(".error-country");
    _this2.donateNow = _this2.form.find(".donate-now");
    _this2.bindEvents();
    _this2.loading = false;
  };

  this.validation = function () {
    if (_this2.form.find(".terms-conditions").is(":checked")) {
      _this2.form.find(':button[type="submit"]').prop("disabled", false);
    } else {
      _this2.form.find(':button[type="submit"]').prop("disabled", true);
    }
  };

  this.fieldsValidation = function () {
    if (_this2.firstName.val() == "") {
      _this2.errorfirstName.html("<p>Please enter your name</p>");
      return false;
    } else {
      _this2.errorfirstName.empty();
    }
    if (_this2.lastName.val() == "") {
      _this2.errorlastName.html("<p>Please enter your last name</p>");
      return false;
    } else {
      _this2.errorlastName.empty();
    }
    if (_this2.phoneNumber.val() == "") {
      _this2.errorphoneNumber.html("<p>Please enter your phone number</p>");
      return false;
    } else {
      _this2.errorphoneNumber.empty();
    }
    if (_this2.email.val() == "") {
      _this2.erroremail.html("<p>Please enter your email</p>");
      return false;
    } else {
      _this2.erroremail.empty();
    }
    if (_this2.address.val() == "") {
      _this2.erroraddress.html("<p>Please enter your address</p>");
      return false;
    } else {
      _this2.erroraddress.empty();
    }
    if (_this2.country.val() == "") {
      _this2.errorcountry.html("<p>Please select your country</p>");
      return false;
    } else {
      _this2.errorcountry.empty();
    }
    if (_this2.city.val() == "") {
      _this2.errorcity.html("<p>Please enter your city</p>");
      return false;
    } else {
      _this2.errorcity.empty();
    }
    if (_this2.zip.val() == "") {
      _this2.errorzip.html("<p>Please enter your postal code</p>");
      return false;
    } else {
      _this2.errorzip.empty();
    }
    if (_this2.state.val() == "") {
      _this2.errorstate.html("<p>Please enter your state</p>");
      return false;
    } else {
      _this2.errorstate.empty();
    }
    return true;
  };

  this.bindEvents = function () {
    _this2.form.find(".terms-conditions").on("change", _this2.validation);
    _this2.validation();
    _this2.form.on("submit", _this2.addToCart);
  };

  this.addToCart = function (e) {
    e.preventDefault();
    if (_this2.loading) {
      return;
    }
    if (_this2.fieldsValidation()) {
      var action = _this2.form.attr("action");
      var serial = $(_this2.form).serialize();
      _this2.loading = true;
      _this2.donateNow.addClass("active");
      $.ajax({
        url: action,
        data: serial,
        type: "post",
        success: _this2.updateBilling,
      });
    }
  };

  this.updateBilling = function (result) {
    var resData = JSON.parse(result);
    var data = resData.postResults;
    $.ajax({
      url: data.billingURL,
      data: data,
      type: "post",
      success: _this2.paymentMethod,
    });
  };

  this.paymentMethod = function (result) {
    var paymentData = JSON.parse(result);
    paymentData.Ajax = true;
    var paymentURL = paymentData.paymentURL;
    var timeOut = new Date();
    timeOut.setTime(timeOut.getTime() + 500 * 1000);
    setCookie("OrderId", paymentData.OrderId, { expires: timeOut });
    $.ajax({
      url: paymentURL,
      data: paymentData,
      type: "post",
      success: function success(result) {
        window.location.href = result;
        _this2.loading = false;
        _this2.donateNow.removeClass("active");
        console.log("success payment");
      },
    });
  };
};

(function ($) {
  "use strict";

  var $document = $(document);
  var $body = $("body");
  var $roots = $("html").add($body);
  var cache = {};

  $.modal = function (settings) {
    function Modal() {
      var modal = this;
      var modalCreated = false;
      modal.isActive = false;

      var config = $.extend(
        {
          content: "", // content to show initial
          contentUrl: null, // content from an external url (ajax-loaded)
          useCache: true, // don't repeat ajax-load every time
          youtubeId: null, // show youtube-iframe
          class: "", // custom class for modal
          closeBtn: true, // show x-close-btn
          layerClose: true, // modal closes when layer is clicked
          closingSelectors: null, // custom selectors for elements to close modal
          showOnInit: true, // show modal when created
          fadeInDuration: 400, // how fast modal fades in
          fadeOutDuration: 400, // how fast modal fades out
          beforeModalOpen: null, // callback before modal appears - returns modal
          afterModalOpen: null, // callback after modal appears - returns modal
          beforeModalClose: null, // callback before modal disappears - returns modal
          afterModalClose: null, // callback after modal disappears - returns modal
        },
        settings,
      );

      var init = function init() {
        if (config.showOnInit) modal.open();
      };

      var createModal = function createModal() {
        var closingX =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="12" height="12"><polygon fill="currentColor" points="96,14 82,0 48,34 14,0 0,14 34,48 0,82 14,96 48,62 82,96 96,82 62,48 "/></svg>';

        var modalClass = "modal " + config.class;
        if (config.youtubeId) {
          modalClass = modalClass + " modal-youtube";
        }

        modal.$wrapper = $("<div>", {
          class: "modal-wrapper",
        });

        modal.$layer = $("<div>", {
          class: "modal-layer",
        });

        modal.$modal = $("<div>", {
          class: modalClass,
        });

        if (config.closeBtn) {
          modal.$closeBtn = $("<button>", {
            class: "modal-close-btn",
          }).html(closingX);

          modal.$modal.append(modal.$closeBtn);
        }

        modal.$content = $("<div>", {
          class: "modal-content",
        }).html(config.content);

        modal.$modal.append(modal.$content);
        modal.$wrapper.append(modal.$layer);
        modal.$wrapper.append(modal.$modal);

        modal.$wrapper.hide();

        if (config.contentUrl) loadExternal();
        if (config.youtubeId) loadYoutubeVideo();
        modalCreated = true;
      };

      modal.updateContent = function (content) {
        modal.$content.html(content);
      };

      modal.open = function () {
        if (!modalCreated) createModal();

        if (typeof config.beforeModalOpen === "function")
          config.beforeModalOpen(modal);
        appendToBody();
        enableRootsActive();
        modal.$wrapper.fadeIn(config.fadeInDuration, function () {
          modal.isActive = true;
          if (typeof config.afterModalOpen === "function")
            config.afterModalOpen(modal);
        });
      };

      modal.close = function () {
        if (typeof config.beforeModalClose === "function")
          config.beforeModalClose(modal);
        modal.$wrapper.fadeOut(config.fadeOutDuration, function () {
          removeFromBody();
          disableRootsActive();
          modal.isActive = false;
          if (typeof config.afterModalClose === "function")
            config.afterModalClose(modal);
        });
      };

      var bindClose = function bindClose() {
        if (config.closeBtn) modal.$closeBtn.click(modal.close);
        if (config.layerClose) modal.$layer.click(modal.close);
        if (config.closingSelectors)
          modal.$modal.on(
            "click",
            config.closingSelectors.toString(),
            modal.close,
          );
      };

      var offset = 0;

      var enableRootsActive = function enableRootsActive() {
        offset = $document.scrollTop();
        $roots.css("top", -offset + "px").addClass("modal-active");
      };

      var disableRootsActive = function disableRootsActive() {
        $roots.css("top", "").removeClass("modal-active").scrollTop(offset);
      };

      var appendToBody = function appendToBody() {
        $body.append(modal.$wrapper);
        bindClose();
      };

      var removeFromBody = function removeFromBody() {
        modal.$wrapper.remove();
      };

      var loadYoutubeVideo = function loadYoutubeVideo() {
        var $iframe = $("<iframe>", {
          css: {
            width: "100%",
            height: "100%",
            display: "block",
          },
          src: "https://www.youtube.com/embed/" + config.youtubeId,
          frameborder: 0,
          allowfullscreen: "allowfullscreen",
        });

        modal.updateContent($iframe);
      };

      var loadExternal = function loadExternal() {
        if (config.useCache && cache[config.contentUrl]) {
          var cachedContent = cache[config.contentUrl];
          modal.updateContent(cachedContent);
        } else {
          $.get(config.contentUrl, function (response) {
            var ajaxContent = response;
            modal.updateContent(ajaxContent);
            cache[config.contentUrl] = ajaxContent;
          }).fail(function () {
            console.log("Ajax failed - wrong URL?");
          });
        }
      };

      init();

      return modal;
    }

    return new Modal();
  };
})(jQuery);

var popupVideo = function popupVideo($element) {
  var isPlayed = sessionStorage.getItem("video_played");
  if (isPlayed) {
    return;
  }
  var $container = $($element);
  var demoModal = $.modal({
    content: $container,
    class: "demo-modal",
    closingSelectors: [".modal-close"],
  });

  demoModal.open();
  sessionStorage.setItem("video_played", "1");
};

// popupVideo('.covid19-popup');

var initDonateLanding = function initDonateLanding($el) {
  var bindEvents = function bindEvents($container) {
    $container.on("click", ".financial-donation", function () {
      $("html,body").animate(
        {
          scrollTop: $("#stepOne").offset().top - 150,
        },
        "slow",
      );
    });
  };

  var bindTabEvents = function bindTabEvents($el) {
    var $element = $el.find(".element:eq(0)");
    $element.on("change", "input", function (e) {
      var $this = $(e.currentTarget);
      var isChecked = $this.is(":checked");
      if (isChecked) {
        $el.find(".element").not(":eq(0)").removeClass("hidden");
        $el.removeClass("inactive").addClass("active");
      } else {
        $el.find(".element").not(":eq(0)").addClass("hidden");
        $el.removeClass("active").addClass("inactive");
      }
    });
  };

  var makeTabs = function makeTabs() {
    var $tabs = $(".make-tabs");
    $tabs.each(function (index, el) {
      $(el).addClass("inactive");
      $(el).find(".element:eq(0)").addClass("m-0");
      $(el).find(".element").not(":eq(0)").addClass("hidden");
      bindTabEvents($(el));
    });
  };

  var init = function init($container) {
    makeTabs();
    bindEvents($container);
  };

  init($el);
};

$(function () {
  initDonateLanding($(".donation.landing"));
});

//for mobile sub-menu
$(document).on("click", ".arrow", function () {
  var targetId = $(this).data("target-id");
  var isArrowActive = $(this).hasClass("active");

  $(".arrow").removeClass("active");
  $(".sub-nav__wrap").removeClass("active");
  if (!isArrowActive) {
    $(this).addClass("active");
  }

  $(".sub-nav__wrap[data-nav-id='" + targetId + "']").toggleClass("active");
  $(this).closest(".header__nav li").toggleClass("active");
});
