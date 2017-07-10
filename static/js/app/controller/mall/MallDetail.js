define([
    'app/controller/base',
    'app/module/banqh',
    'app/interface/generalCtr',
    'app/interface/mallCtr'
], function(base, Banqh, generalCtr, mallCtr) {
	var code = base.getUrlParam("code");

	var _loadingSpin = $("#loadingSpin");

    init();

    // 初始化页面
    function init() {
        $("#nav li").eq(8).addClass("active");

        _loadingSpin.removeClass("hidden");
        $.when(
        	getMallDetail(),
        )
        addListener();

        _loadingSpin.addClass("hidden");
    }

	//商品详情
    function getMallDetail(){
    	return mallCtr.getMallDetail(code).then((res)=>{
    		var data = res.product;
			var pic = data.pic1.split(/\|\|/), html = "";
            $.each(pic, function(i, p){
                html += `<li><a href="javascript:;"><img src="${base.getPic(p)}"/></a></li>`
            });

            $("#ban_pic1 ul").html(html);
            $("#ban_num1 ul").html(html);

            if(pic.length>1){
            	swiperPic()
            }

            $("#NowName").html(data.name);
            $(".dconTop-right .title-wrap .title").html(data.name);
            $(".dconTop-right .joinPlace").html(data.province+data.city+data.area+" "+data.detail)
            $(".dconTop-right #lowPrice").html(base.formatMoney(data.price1));

			$("#description").html(data.description);
			$(".num").attr("data-quantity",data.quantity>0?data.quantity:0)
			$(".subBtn").attr("data-quantity",data.quantity>0?1:0)

        	_loadingSpin.addClass("hidden");
		},()=>{})
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
	function getCollect(){
		return generalCtr.getCollect(code,4,true).then((data)=>{
			var _collect = $(".dconTop-right .icon-star");

				_collect.toggleClass("active")
        		_loadingSpin.addClass("hidden");
		},()=>{
        	_loadingSpin.addClass("hidden");
		})
	}

    function addListener() {

    	$(".icon-star").click(function(){
    		if($(this).hasClass("active")){
    			$(this).removeClass("active");
    		}else{
    			$(this).addClass("active");
    		}
    	});

    	$(".booking-wrap").on("click",".icon-sub",function(){
    		var _num = parseInt($(this).siblings(".num").html());
    		_num<=1?1:_num--;
    		$(this).siblings(".num").html(_num);
    		$(this).parent(".number").siblings(".btn-wrap").children(".subBtn").attr("data-quantity",_num)
    	});

    	$(".booking-wrap").on("click",".icon-add",function(){
    		var _num = parseInt($(this).siblings(".num").html());
    		var remain =$(this).siblings(".num").attr("data-quantity")
    		if(remain&&remain!=0){
    			_num>=remain?remain:_num++;
	    		$(this).siblings(".num").html(_num);
	    		$(this).parent(".number").siblings(".btn-wrap").children(".subBtn").attr("data-quantity",_num)
    		}
    	});

    	$(".subBtn").click(function(){
            if(base.isLogin()){
                var _num = $(this).attr("data-quantity");
        		if(_num && _num >= 1){
        			location.href = "submitOrder.html?code=" + code + "&quantity=" + _num;
        		}else{
        			base.showMsg("当前商品不能购买")
        		}
            }else {
                base.showMsg("您还未登录，无法购买");
            }
    	});
    }
});
