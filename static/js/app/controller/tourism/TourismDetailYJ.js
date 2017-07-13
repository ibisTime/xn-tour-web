define([
    'app/controller/base',
    'app/interface/generalCtr',
    'app/interface/tourismCtr'
], function(base, generalCtr, tourismCtr) {
	var code = base.getUrlParam("code");
	var price;
    var _loadingSpin = $("#loadingSpin");

    init();

    // 初始化页面
    function init() {
        getDetailYJ();
        addListener();
    }

	//点赞
	function getCollectTravel(){
		return generalCtr.getCollect(code, 5, true, 3).then((data)=>{
			var _collect = $(".icon-dianzan");
				if(_collect.hasClass("active")){
					_collect.removeClass("active");
				}else{
					_collect.addClass("active");
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
			$("#NowName").html(data.name);
			$(".title").html(data.name);
			$(".updateDatetime").html(base.formatDate(data.publishDatetime,"yyyy-MM-dd hh:mm:ss"));
			$(".description").html(data.description);
			if(data.isLike&&data.isLike!="0"){
				$(".icon-dianzan").addClass("active");
			}else{
				$(".icon-dianzan").removeClass("active");
			}
    		_loadingSpin.addClass("hidden");
		}, () => {
            _loadingSpin.addClass("hidden");
        });
	}

    function addListener() {

    	$(".icon-dianzan").click(function(){
    		if(!base.isLogin()){
    			base.goLogin();
    			return ;
    		}
        	_loadingSpin.removeClass("hidden");
    		getCollectTravel()
    	})

    }
});
