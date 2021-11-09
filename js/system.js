MAC.Digg = {
  'Init': function () {
    $('body').on('click', '.digg_link', function (e) {
      var $that = $(this);
      if ($that.attr("data-id")) {
        MAC.Ajax(maccms.path + '/index.php/ajax/digg.html?mid=' + $that.attr("data-mid") + '&id=' + $that.attr("data-id") + '&type=' + $that.attr("data-type"), 'get', 'json', '', function (r) {
          $that.addClass('disabled');
          if (r.code == 1) {
            if ($that.attr("data-type") == 'up') {
              $that.find('.digg_num').html(r.data.up);
            } else {
              $that.find('.digg_num').html(r.data.down);
            }
          } else {
            MAC.Pop.Msg(150, 20, r.msg, 1000);
          }
        });
      }
    });
  }
}
MAC.History = {
  'BoxShow': 0,
  'Limit': 10,
  'Days': 7,
  'Json': '',
  'Init': function () {
    if ($('.mac_history').length == 0) {
      return;
    }

    var jsondata = [];
    if (this.Json) {
      jsondata = this.Json;
    } else {
      var jsonstr = MAC.Cookie.Get('mac_history_full');
      if (jsonstr != undefined) {
        jsondata = eval(jsonstr);
      }
    }


    if (jsondata.length > 0) {
      html = '';
      for ($i = 0; $i < jsondata.length; $i++) {
        html += '<li><h5><a href="' + jsondata[$i].link + '">' + jsondata[$i].name + '</a><em>/</em><a target="_blank" href="' + jsondata[$i].playlink + '">' + jsondata[$i].playname + '</a></h5><a href="' + jsondata[$i].playlink + '" class="playlog-del" id="playlog-del"><i class="icon iconfont icon-jijiang"></i></a></li>';
      }
    } else {
      html = '<strong>暂无观看历史记录列表</strong>';
    }
    $(".mac_history_box").html(html);
    if ($(".mac_history_set").attr('data-name')) {
      var $that = $(".mac_history_set");
      MAC.History.Set($that.attr('data-id'), $that.attr('data-name'), $that.attr('data-link'), $that.attr('data-playname'), $that.attr('data-playlink'), $that.attr('data-pic'), $that.attr('data-time'));
    }
  },
  'Set': function (id, name, link, playname, playlink, pic, time) {
    if (!playlink) {
      playlink = document.URL;
    }
    if (!time) {
      time = new Date();
    }
    var jsondata = MAC.Cookie.Get('mac_history_full');

    if (jsondata != undefined) {
      this.Json = eval(jsondata);

      jsonstr = '{log:[{"id":"' + id + '","name":"' + name + '","link":"' + link + '","playname":"' + playname + '","playlink":"' + playlink + '","pic":"' + pic + '","time":"' + time + '"},';
      for ($i = 0; $i < this.Json.length; $i++) {
        if ($i <= this.Limit && this.Json[$i]) {
          if (this.Json[$i].id == id) {
            continue;
          } else {
            jsonstr += '{"id":"' + this.Json[$i].id + '","name":"' + this.Json[$i].name + '","link":"' + this.Json[$i].link + '","playname":"' + this.Json[$i].playname + '","playlink":"' + this.Json[$i].playlink + '","pic":"' + this.Json[$i].pic + '","time":"' + this.Json[$i].time + '"},';
          }
        } else {
          break;
        }
      }
      jsonstr = jsonstr.substring(0, jsonstr.lastIndexOf(','));
      jsonstr += "]}";
    } else {
      jsonstr = '{log:[{"id":"' + id + '","name":"' + name + '","link":"' + link + '","playname":"' + playname + '","playlink":"' + playlink + '","pic":"' + pic + '","time":"' + time + '"}]}';
    }
    this.Json = eval(jsonstr);
    MAC.Cookie.Set('mac_history_full', jsonstr, this.Days);
  },
  'Clear': function () {
    MAC.Cookie.Del('mac_history_full');
    $('.mac_history_box').html('<strong>暂无观看历史记录列表</strong>');
  },
}
MAC.Star.Init = function () {
  if ($('.mac_star').length == 0) {
    return;
  }
  $('.mac_star').raty({
    starType: 'li',
    number: 5,
    numberMax: 5,
    space: false,
    score: function () {
      $(".raty-score-num").text($(this).attr('data-score'));
      return $(this).attr('data-star');
    },
    hints: ['很差', '较差', '还行', '推荐', '力荐'],
    starOff: 'star',
    starOn: 'star active',
    target: $("#ratewords"),
    //targetKeep: true,
    click: function (score, evt) {
      MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $('.mac_star').attr('data-mid') + '&id=' + $('.mac_star').attr('data-id') + '&score=' + (score * 2), 'get', 'json', '', function (r) {
        if (r.code == 1) {
          $(this).attr({
            'data-score': r.data.score,
            'data-star': Math.ceil(r.data.score / 2)
          });
          $(".raty-score-num").text($(this).attr('data-score'));
          $('.mac_star').raty('score', Math.ceil(r.data.score / 2));
          MAC.Pop.Msg(100, 20, '评分成功', 1000);
        } else {
          $('.mac_star').raty('score', $(this).attr('data-star'));
          MAC.Pop.Msg(100, 20, r.msg, 1000);
        }
      }, function () {
        $('.mac_star').raty('score', $(this).attr('data-star'));
        MAC.Pop.Msg(100, 20, '网络异常', 1000);
      });
    }
  });
}
function playlistHeight() {
  $(".min-play-list").css('maxHeight',$("#zanpiancms_player").height() - $(".player-play-nav").height() - 20);
}
$(document).ready(function () {
  var topNav = new Swiper('.header-nav-wrap', {
    freeMode: true,
    slidesPerView: 'auto',
    on: {
      init: function (swiper) {
        this.slideTo($('.header-nav-wrap').find('.active').index() - 1);
      },
    },
  });
  var topSwiper = new Swiper('#box-slide-1', {
    lazy: {
      loadPrevNext: true,
    },
    loop: true,
    autoplay: false,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  var typeSwiper = new Swiper('#box-slide-2', {
    lazy: {
      loadPrevNext: true,
    },
    loop: true,
    autoplay: false,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  var selectSwiper = new Swiper('.type-select-slide', {
    freeMode: true,
    slidesPerView: 'auto',
    on: {
      init: function (swiper) {
        this.slideTo($('.type-select-slide').eq(this.$el.index()).find('.active').index() - 1);
      },
    },
  });
  var topSwiper = new Swiper('#nav-select', {
    freeMode: true,
    slidesPerView: 'auto',
    on: {
      init: function (swiper) {
        this.slideTo(this.$el.find('.active').index() - 1);
      },
    },
  });
  var playlistSwiper = new Swiper('.playlist-slide', {
    freeMode: true,
    slidesPerView: 'auto',
    on: {
      init: function (swiper) {
        this.slideTo(this.$el.find('.active').index() - 1);
      },
    },
  });
  $(".lazyload").lazyload();
  $("#slideDown-box").click(function () {
    var $that = $(this);
    $(".slideDown-box").slideToggle(function () {
      if ($that.hasClass("up")) {
        $that.html('展开<i class="iconfont icon-down"></i>');
      } else {
        $that.html('收起<i class="iconfont icon-up"></i>');
      }
      $that.toggleClass("up");
    });
  });
  $(".detail-info").click(function () {
    $(this).children("p").toggleClass("txt-hidden").siblings().children(".icon-down").toggleClass("icon-up");
  });
  $(".tab-toggle").click(function () {
    if (!$(this).hasClass("active")) {
      $(this).addClass("active").siblings().removeClass("active");
      $(".tab-content").children().eq($(this).index()).fadeIn("fast").siblings().hide();
      $(".tab-content").children().eq($(this).index()).find(".lazyload").lazyload();
      if ($(this).hasClass("player-tab-toggle")) {
        $("#min-more").removeClass().addClass("gico " + $(this).attr("from")).children(".name").text($(this).attr("show"));
      }
    }
  });
  $(".js-ep-show.more").click(function () {
    $(this).toggleClass("hided").siblings(".js-ep-show").toggleClass("hided");
  });
  if ($(".player-play-nav").length > 0) {
    playlistHeight();
    $(window).resize(playlistHeight);
  }
  $(".player-shrink").click(function () {
    $(this).toggleClass("icon-left").parents(".vod-play-box").toggleClass("max");
    playlistHeight();
  });
  $(".min-play-more").click(function () {
    $(this).find(".icon-down").toggleClass("icon-up");
    $(".player-more-list").slideToggle("fast");
  });
  if ($(".min-play-more").length > 0) {
    $("body").click(function (e) {
      if ($(e.target).closest(".min-play-more,.player-more-list").length == 0) {
        $(".min-play-more").find(".icon-down").removeClass("icon-up");
        $(".player-more-list").slideUp("fast");
      }
    });
  }
  $(".back-top").click(function () {
    $("html,body").animate({
      scrollTop: 0
    }, 300);
  });
  $(window).scroll(function () {
    if ($(document).scrollTop() >= 100) {
      $(".back-top").show();
    } else {
      $(".back-top").hide();
    }
  });
});
