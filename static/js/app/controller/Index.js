define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'app/interface/menuCtr',
    'swiper'
], function(base, Handlebars, menuCtr, Swiper) {

    init();
    // 初始化页面
    function init() {
        base.showLoading();
        getInitData()
            .then(() => {
                base.hideLoading();
            }, () => {});
        addListener();
    }
    // 初始化数据
    function getInitData() {
    	return $.when(
			getBanner(true),
        );
    }
    // 初始化swiper
    function initSwiper(){
        var _swiper = $("#swiper");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
    }
    
    // 获取banner
    function getBanner(refresh){
        return menuCtr.getIndexBanner(refresh)
            .then((data) => {
                var bannerHtml = "";
                data.forEach((d) => {
                    var pics = base.getPicArr(d.pic);
                    pics.forEach((pic) => {
                        bannerHtml += `<div class='swiper-slide'><img data-url='${d.url || ""}' class='wp100' src='${pic}'></div>`;
                    });
                });
//              $("#swiper .swiper-wrapper").html(bannerHtml);
                initSwiper();
            }, (msg) => {
                base.showMsg(msg || "加载失败");
            });
    }

    function addListener() {

    }
});
