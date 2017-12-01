$(document).ready(function() {
  $(".carousel").swiperight(function() {
    if (!($(this).hasClass("all-slides") && window.innerWidth >= 992)) {
      $(this).carousel('prev');
    }
  });
  $(".carousel").swipeleft(function() {
    if (!($(this).hasClass("all-slides") && window.innerWidth >= 992)) {
      $(this).carousel('next');
    }
  });

  if ($(".product-trigger").length) {
    $(".product-trigger").affix({
      offset: {
        top: $('.product-trigger').offset().top
      }
    });
  };

  if ($(".sticky-side-nav-buttons").length) {
    $(".sticky-side-nav-buttons").addClass("affix");
    $(window).on('resize scroll', function() {
      $('.sticky-side-nav-content .btn').each(function() {
        if (inViewport(this)) {
          $(".sticky-side-nav-buttons").removeClass("affix");
        } else {
          $(".sticky-side-nav-buttons").addClass("affix");
        }
      });
    });
  }

  function inViewport(element) {
    var elementTop = $(element).offset().top;
    var elementBottom = elementTop + $(element).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementTop < viewportBottom;
  };

  $(".collapse-list [data-toggle='collapse'], .tab-collapse-content [data-toggle='collapse']").click(function() {
    $(".collapse.in").collapse("hide");
  });

  $('.card-flip').bind("click", function() {
    $(this).toggleClass('flipped');
  })

  $(".tab-pane-title-expander").click(function() {
    $('.trigger-carousel .carousel, .trigger-flipflop .flipflop-panel-slides').removeClass("active");
    var trigger_carousel = $(this).data("carousel-id");
    var trigger_flipflop = $(this).data("flipflop-id");
    $(trigger_carousel).addClass("active");
    $(trigger_flipflop).addClass("active");
  });

  $('.tab-collapse-content').on('shown.bs.collapse', function(event) {
    var offset = $(this).find('.collapse.in').prev(".tab-pane-title-expander");
    if (offset) {
      $('html,body').animate({
        scrollTop: $(offset).offset().top
      }, 900);
    }
  });

  $(".tab-trigger-nav a, .icon-tab-trigger-nav a").click(function(event) {
    event.preventDefault();
    var target = $(this);
    var offset = 10;
    scroll_page(target, offset)
  });

  $(".navigation-icons-nav a, .tab-pane-copy a.btn").click(function(event) {
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      event.preventDefault();
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      var offset = 10;
      scroll_page(target, offset)
    }
  });
  $(".product-trigger-nav a").click(function(event) {
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {

      event.preventDefault();
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      var offset = 10;
      if (window.innerWidth >= 992) {
        offset = $(".product-trigger").outerHeight();
        $(".product-trigger").parent().css("min-height", offset);
      }
      scroll_page(target, offset)
    }
  });

  function scroll_page(target, offset) {
    if (window.innerWidth >= 992 && $(".product-trigger.affix").length) {
      offset = $(".product-trigger").outerHeight();
      $(".product-trigger").parent().css("min-height", offset);
    }
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - offset - 10
      }, 900, function() {
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) {
          return false;
        } else {
          $target.attr('tabindex', '-1');
          $target.focus();
        };
      });
    }
  }

  if ($(".yt-player").length) {

    var listPlayers = $(".yt-player");
    var playerInfoList = [];

    if (listPlayers.length > 0) {
      $(".yt-player").each(function(i) {
        var videoId = YouTubeGetID($(this).attr('url'));
        var playerId = $(this).attr('id') + videoId + "-" + i;
        $(this).attr('id', playerId);
        var autoPlayOnce = 0;
        if (typeof(Storage) !== "undefined") {
          if ($(this).hasClass("play-once") && localStorage.getItem(playerId) != 'yes') {
            autoPlayOnce = 1;
            localStorage.setItem(playerId, 'yes')
            if ($(this).parents('.modal')) {
              $(this).parents('.modal').addClass("modal-alt");
              $(this).parents('.modal').modal("show");
            }
          }
        }
        playerInfoList.push({
          id: playerId,
          videoId: videoId,
          autoPlay: autoPlayOnce
        })
        i++;
      });
    }

    var players = new Array();
    var globalPlayerIndex = 0;

    function createPlayer(playerInfo) {
      return new YT.Player(playerInfo.id, {
        videoId: playerInfo.videoId,
        playerVars: {
          'rel': 0,
          'modestbranding': 1,
          'autoplay': playerInfo.autoPlay,
          'controls': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

    }

    var videoLength = "";
    var videoId = "";
    var videoName = "";
    var videoPosition = "";

    function onPlayerReady(event) {
      getVideoInfo(event);
      trackVideoPageImpression("videoImpression", videoId, videoName, videoLength, 'youtube');
    }

    function onPlayerStateChange(event) {
      getVideoInfo(event);
      switch (event.data) {
        case YT.PlayerState.UNSTARTED:
          break;
        case YT.PlayerState.ENDED:
          $('.play-once').parents('.modal').modal('hide');
          break;
        case YT.PlayerState.PLAYING:
          $('.modal').on('hidden.bs.modal', function() {
            event.target.pauseVideo();
          });
          trackVideoEvent("videoPlay", videoId, videoName, videoLength, videoPosition);
          break;
        case YT.PlayerState.PAUSED:
          trackVideoEvent("videoPause", videoId, videoName, videoLength, videoPosition);
          break;
        case YT.PlayerState.BUFFERING:
          break;
        case YT.PlayerState.CUED:
          break;
      }
    }
    $('.modal-alt').on('hidden.bs.modal', function() {
      if ($(this).find('play-once')) {
        $(this).removeClass('modal-alt');
      }
    });

    function getVideoInfo(eventInfo) {
      videoLength = eventInfo.target.getDuration();
      videoPosition = eventInfo.target.getCurrentTime();
      videoId = eventInfo.target.getVideoData()['video_id'];
      videoName = eventInfo.target.getVideoData().title;
    }

    function YouTubeGetID(url) {
      var ID = '';
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      } else {
        ID = url;
      }
      return ID;
    }

    function createYTPlayer() {
      if (typeof playerInfoList === 'undefined') return;
      for (var i = 0; i < playerInfoList.length; i++) {
        var curplayer = createPlayer(playerInfoList[i]);
        players[i] = curplayer;
      }
    }

    if (!$('script[src="https://www.youtube.com/iframe_api"]').length) {

      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = function() {
        createYTPlayer();
      }

    } else {
      createYTPlayer();
    }

  }

  $(".sticky-side-nav-section a.btn, .dispute-popup").click(function(event) {
    event.preventDefault();
    window.open(this.href, "blank_window", "menubar = no, toolbar = no, location = no, directories = no, status = yes, scrollbars = yes, resizable = yes, top = 1, left = 1, width = 1000, height = 800");
  });

  $('.sticky-side-nav-section .btn-secondary:eq(0)').click(function() {
    trackDisputeEvent("disputeStartCTAClick");
  });
  $('.sticky-side-nav-section .btn-secondary:eq(1)').click(function() {
    trackDisputeEvent('disputeStatusCTAClick');
  });
  $('.sticky-side-nav-section .btn-primary-outline:eq(0)').click(function() {
    trackDisputeEvent("disputeStartCTAClick");
  });
  $('.sticky-side-nav-section .btn-primary-outline:eq(1)').click(function() {
    trackDisputeEvent('disputeStatusCTAClick');
  });

});