define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'swiper',
    'app/interface/menuCtr',
    'app/interface/tourismCtr',
    'app/interface/hotelCtr'
], function(base, Handlebars, Swiper, menuCtr, tourismCtr, hotelCtr) {
    var tourismTmpl = __inline('../ui/tourism_item.handlebars');
    var hotelTmpl = __inline('../ui/hotel_item.handlebars');

    init();
    // 初始化页面
    function init() {
        $("#nav li").eq(0).addClass("active")
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
			initSwiperTraffic(),
			getTourismNav(),
			getHotelNav()
        );
    }
    // 初始化swiper
    function initSwiperBanner(){
        var _swiper = $("#swiper");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        new Swiper('#swiper', {
            'autoplay': 4000,
            'pagination': '#swiper',
            'pagination' : '#swiper .swiper-pagination',
            'paginationClickable' :true,
            'autoplayDisableOnInteraction': false,
            'preventClicksPropagation': true,
            'loop' : true,
        });
    }
    
    // 初始化swiper
    function initSwiperTraffic(){
        var _swiper = $("#traffic");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        new Swiper('#traffic', {
            'slidesPerView' : 6,
			'slidesPerGroup' : 1,
			'prevButton' :'#traffic .swiper-button-prev',
			'nextButton' :'#traffic .swiper-button-next',
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
                        bannerHtml += `<div class='swiper-slide'><a href="${d.url || ""}" style="background-image:url(${pic});"></div>`;
                    });
                });
                $("#swiper .swiper-wrapper").html(bannerHtml);
                initSwiperBanner();
            }, (msg) => {
                base.showMsg(msg || "加载失败");
            });
    }
	
	//推荐线路类型
	function getTourismNav(){
		menuCtr.getModules("travel").then((data)=>{
			var html = "";
			data.forEach(function(d, i){
				html+='<li data-code="'+d.code+'">'+d.name+'</li>';
			})
			
			$("#tourismNav ul").html(html);
			$("#tourismNav ul").find('li').eq(0).addClass("active");
			getTourism($("#tourismNav ul").find('li').eq(0).attr("data-code"))
		},()=>{})
	}
	
	//分页查询推荐线路
	function getTourism(code){
		tourismCtr.getRecommend({
			"limit": 4,
			"category" : code,
			"location": '2'
		},true).then((data)=>{
			$("#tourismNavCon ul").empty();
			$("#tourismNavCon ul").html(tourismTmpl({items: data.list}));
			base.hideLoading();
		},()=>{})
	}
	
	
	//酒店住宿类型
	function getHotelNav(){
		menuCtr.getModules("depart_hotel").then((data)=>{
			var html = "";
			data.forEach(function(d, i){
				html+='<li data-code="'+d.code+'">'+d.name+'</li>';
			})
			
			$("#hotelNav ul").html(html);
			$("#hotelNav ul").find('li').eq(0).addClass("active");
			getHotelPage($("#hotelNav ul").find('li').eq(0).attr("data-code"))
		},()=>{})
	}
	
	
	//分页查询酒店
	function getHotelPage(code){
		hotelCtr.getHotelPage({
			"limit": 4,
			"category" : code,
			"location": '2'
		},true).then((data)=>{
			$("#hotelNavCon ul").empty();
			$("#hotelNavCon ul").html(hotelTmpl({items: data.list}));
			base.hideLoading();
		},()=>{})
	}
	
    function addListener() {
		$("#tourismNav ul").on('click','li',function(){
			base.showLoading();
			$(this).addClass("active").siblings("li").removeClass("active")
			getTourism($(this).attr("data-code"))
		})
		
		$("#hotelNav ul").on('click','li',function(){
			base.showLoading();
			$(this).addClass("active").siblings("li").removeClass("active")
			getHotelPage($(this).attr("data-code"))
		})
		
    }
});
