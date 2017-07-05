define([
    'app/controller/base',
    'app/module/banqh',
    'app/interface/generalCtr',
    'app/interface/tourismCtr',
], function(base, Banqh, generalCtr,tourismCtr) {
	var code = base.getUrlParam("code");
	var price;
	
    var _loadingSpin = $("#loadingSpin");
    var configGL = {
    		start: 1,
    		lineCode: code,
    	};

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(1).addClass("active");
        _loadingSpin.removeClass("hidden");
        $.when(
        	getPageGL(configGL),
        	getDetailGL()
        )
        addListener();
        _loadingSpin.addClass("hidden");
    }
	
	//图片
	function swiperPic(){
		Banqh.banqh({
			box:"#banqh1",//总框架
			pic:"#ban_pic1",//大图框架
			pnum:"#ban_num1",//小图框架
			prev:"#prev",//大图左箭头
			next:"#next",//大图右箭头
			autoplay:false,//是否自动播放
			interTime:5000,//图片自动切换间隔
			delayTime:400,//切换一张图片时间
			order:0,//当前显示的图片（从0开始）
			picdire:true,//大图滚动方向（true为水平方向滚动）
			mindire:true,//小图滚动方向（true为水平方向滚动）
			min_picnum:4,//小图显示数量
			pop_up:false//大图是否有弹出框
		})
	}
	
	//点赞
	function getCollectTravel(){
		return generalCtr.getCollect(code,1,true).then((data)=>{
			var _collect = $(".dconTop-right .icon-star");
			
				_collect.toggleClass("active")
        		_loadingSpin.addClass("hidden");
		},()=>{
        	_loadingSpin.addClass("hidden");
		})
	}
	
	//详情
	function getDetailGL(){
		return tourismCtr.getDetailGL(code).then((data)=>{
			$(".title").html(data.title);
			$(".updateDatetime").html(data.updateDatetime);
			$(".description").html(data.description);
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	//分页查攻略
	function getPageGL(params){
		return tourismCtr.getPageGL(params,true).then((data)=>{
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	
    function addListener() {
    	
    	$(".dconTop-right .icon-star").click(function(){
        	_loadingSpin.removeClass("hidden");
    		getCollectTravel()
    	})
    	
    }
});
