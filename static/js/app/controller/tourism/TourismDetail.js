define([
    'app/controller/base',
    'pagination',
    'swiper',
    'app/module/validate',
    'app/module/banqh',
    'app/interface/tourismCtr',
    'app/interface/generalCtr',
    'app/interface/userCtr',
    'app/module/identity',
], function(base, pagination, Swiper, validate, Banqh, tourismCtr, generalCtr, userCtr, Identity) {
	var code = base.getUrlParam("code");
	var isBindMobile ,isIdentity;
	
    var _loadingSpin = $("#loadingSpin");

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(1).addClass("active");
        _loadingSpin.removeClass("hidden");
        getTourismDetail();
        addListener();
    }
	
	function getTourismDetail(){
		return tourismCtr.getTourismDetail(code,base.getUserId()).then((data)=>{
			var pic = data.pathPic.split(/\|\|/), html = "";
            $.each(pic, function(i, p){
                html += `<li><a href="javascript:;"><img src="${base.getPic(p)}"/></a></li>`
            });
            
            if(pic.length>1){
            	swiperPic()
            }
            
            $("#ban_pic1 ul").html(html);
            $("#ban_num1 ul").html(html);
            $("#NowName").html(data.name);
            $(".dconTop-right .title-wrap .title").html(data.name);
            $(".dconTop-right .datetime").html("出行日期："+base.formatDate(data.outDateStart,"yyyy-MM-dd")+"~"+base.formatDate(data.outDateEnd,"yyyy-MM-dd"))
            $(".dconTop-right .joinPlace").html(data.joinPlace+"出发")
            $(".dconTop-right .price p i").html("￥"+base.formatMoney(data.price));
            
            if(data.groupName){
                $(".groupName").html("组团社名："+data.groupName);
                $(".groupMobile").html("组团电话："+data.groupMobile);
            }
			
			
			data.isCollect == "1" ? $(".dconTop-right .icon-star").addClass("active") : "";
			
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
	function getCollectTravel(){
		return generalCtr.getCollect(code,1,true).then((data)=>{
			var _collect = $(".dconTop-right .icon-star");
			
				_collect.toggleClass("active")
        		_loadingSpin.addClass("hidden");
		},()=>{
        	_loadingSpin.addClass("hidden");
		})
	}
	
	//获取用户信息
	function getUserInfo(){
		userCtr.getUserInfo().then((data)=>{
			
           	isIdentity = !!data.realName;
			
			if(!isIdentity){
				
        		_loadingSpin.addClass("hidden");
                base.confirm("您还未实名认证，点击确认前往实名认证")
                    .then(function () {
                        Identity.showCont();
                    }, base.emptyFun);
                return;
            }
			
            submitOrder();
        	_loadingSpin.addClass("hidden");
		},()=>{
			
        	_loadingSpin.addClass("hidden");
		})
	}
	
	function submitOrder(){
		console.log(111)
	}
	
    function addListener() {
    	setTimeout(() => {
            laydate({
                elem: '#choseDate',
                min: laydate.now()
            });
            $("#choseDate").val(laydate.now());
        }, 1);
        
        Identity.addCont({
            success: function(){
                isIdentity = true;
            },
            error: function(msg){
                base.showMsg(msg);
            }
        })
        
    	$(".ul-tourismList").on("click","li .icon-collection",function(){
    		$(this).toggleClass("active");
    	})
    	
    	$(".dconTop-right .icon-star").click(function(){
        	_loadingSpin.removeClass("hidden");
    		getCollectTravel()
    	})
    	
    	//立即预订点击
    	$("#bookingBtn").click(function(){
        	$("#Dialog").removeClass("hidden");
    	})
    	
    	$("#submitForm").validate({
            'rules': {
                'applyNote': {
                	isNotFace: true,
                	maxlength: 255
                }
            },
            onkeyup: false
        });
    	
    	//弹窗-取消
        $("#Dialog #cancel").click(function(){
        	$("#Dialog").addClass("hidden");
        	$("#applyNote").val("")
        })
        
    	//弹窗-提交订单
        $("#Dialog #confirm").click(function(){
        	if($("#submitForm").valid()){
        		_loadingSpin.removeClass("hidden");
                getUserInfo();
        	}
        })
    }
});
