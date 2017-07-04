define([
    'app/controller/base',
    'pagination',
    'swiper',
    'app/module/banqh',
], function(base, pagination, Swiper, Banqh) {
	var code = base.getUrlParam("code");

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(1).addClass("active");
        initPic();
        addListener();
    }
	
	function initPic(){
		var galleryTop = new Swiper('.gallery-top', {
	        nextButton: '.swiper-button-next',
	        prevButton: '.swiper-button-prev',
	        spaceBetween: 10,
	    });
	    var galleryThumbs = new Swiper('.gallery-thumbs', {
	        spaceBetween: 10,
	        centeredSlides: true,
	        slidesPerView: '4',
	        touchRatio: 0.2,
	        slideToClickedSlide: true
	    });
	    galleryTop.params.control = galleryThumbs;
	    galleryThumbs.params.control = galleryTop;
	}
	
    function addListener() {
    	
    	$(".ul-tourismList li .icon-collection").click(function(){
    		if($(this).hasClass("active")){
    			$(this).removeClass("active");
    		}else{
    			$(this).addClass("active");
    		}
    	})
    	
    	$(".icon-star").click(function(){
    		if($(this).hasClass("active")){
    			$(this).removeClass("active");
    		}else{
    			$(this).addClass("active");
    		}
    	})
    	
    	Banqh.banqh({
			box:"#banqh1",//总框架
			pic:"#ban_pic1",//大图框架
			pnum:"#ban_num1",//小图框架
			prev_btn:"#prev_btn1",//小图左箭头
			next_btn:"#next_btn1",//小图右箭头
			prev:"#prev1",//大图左箭头
			next:"#next1",//大图右箭头
			autoplay:false,//是否自动播放
			interTime:5000,//图片自动切换间隔
			delayTime:400,//切换一张图片时间
			order:0,//当前显示的图片（从0开始）
			picdire:true,//大图滚动方向（true为水平方向滚动）
			mindire:true,//小图滚动方向（true为水平方向滚动）
			min_picnum:3,//小图显示数量
			pop_up:false//大图是否有弹出框
		})
    
    }
});
