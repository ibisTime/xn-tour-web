define([
    'app/controller/base',
    'app/interface/generalCtr',
    'app/interface/tourismCtr',
], function(base, generalCtr,tourismCtr) {
	var code = base.getUrlParam("code");
	var price;
	
    var _loadingSpin = $("#loadingSpin");

    init();
    
    // 初始化页面
    function init() {
        _loadingSpin.removeClass("hidden");
        $.when(
        	getDetailGL()
        )
        addListener();
        _loadingSpin.addClass("hidden");
    }
	
	//点赞
	function getCollectTravel(){
		return generalCtr.getCollect(code,2,true).then((data)=>{
			var _collect = $(".icon-collection");
				
				if(_collect.hasClass("active")){
					_collect.removeClass("active");
					_collect.html("收藏")
				}else{
					_collect.addClass("active");
					_collect.html("取消收藏")
				}
        		_loadingSpin.addClass("hidden");
		},()=>{
        	_loadingSpin.addClass("hidden");
		})
	}
	
	//详情
	function getDetailGL(){
		return tourismCtr.getDetailGL(code).then((data)=>{
			
			var pic = data.pic.split(/\|\|/), html = "";
            $.each(pic, function(i, p){
                html += `<div class="wp100"><img src="${base.getPic(p)}"/></div></li>`
            });
			
			$(".pic").html(html)
			$("#NowName").html(data.title);
			$(".title").html(data.title);
			$(".updateDatetime").html(base.formatDate(data.updateDatetime,"yyyy-MM-dd hh:mm:ss"));
			$(".description").html(data.description);
			if(data.isCollect&&data.isCollect!="0"){
				$(".icon-collection").addClass("active");
				$(".icon-collection").html("取消收藏")
			}else{
				$(".icon-collection").removeClass("active");
				$(".icon-collection").html("收藏")
			}
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
    function addListener() {
    	
    	$(".icon-collection").click(function(){
    		if(!base.isLogin()){
    			base.goLogin();
    			return ;
    		}
        	_loadingSpin.removeClass("hidden");
    		getCollectTravel()
    	})
    	
    }
});
