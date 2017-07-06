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
        	getDetailYJ()
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
	function getDetailYJ(){
		return tourismCtr.getDetailYJ(code).then((data)=>{

			var pic = data.pic.split(/\|\|/), html = "";
            $.each(pic, function(i, p){
                html += `<div class="wp100"><img src="${base.getPic(p)}"/></div></li>`
            });

			$(".pic").html(html)
			$(".title").html(data.name);
			$(".updateDatetime").html(base.formatDate(data.publishDatetime,"yyyy-MM-dd hh:mm:ss"));
			$(".description").html(data.description);
			if(data.isCollect){
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
        	_loadingSpin.removeClass("hidden");
    		getCollectTravel()
    	})

    }
});
