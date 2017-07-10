define([
    'app/controller/base',
    'pagination',
    'app/util/handlebarsHelpers',
    'app/module/validate',
    'app/module/banqh',
    'app/interface/generalCtr',
    'app/interface/userCtr',
    'app/interface/hotelCtr',
], function(base, pagination, Handlebars, validate, Banqh, generalCtr, userCtr, hotelCtr) {
	var code = base.getUrlParam("code"),
		isIdentity,
		configCom = {
    		start: 1,
    		topCode: code,
    	},
		configRoom = {
    		start: 1,
    		hotalCode: code,
    	};
    
	var	comTmpl = __inline('../../ui/comment_item.handlebars'),
		roomTmpl = __inline('../../ui/hotel_home_list.handlebars');
	
	var _loadingSpin = $("#loadingSpin");
	
    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(2).addClass("active");
        _loadingSpin.removeClass("hidden");
        $.when(
        	getHotelDetail(),
        	getPageCom(configCom),
        	getPageHotelRoom(configRoom)
        )
        addListener();
        
        _loadingSpin.addClass("hidden");
    }
    
    //酒店详情
    function getHotelDetail(){
    	return hotelCtr.getHotelDetail(code).then((res)=>{
    		var data = res.hotal;
			var pic = data.pic2.split(/\|\|/), html = "";
            $.each(pic, function(i, p){
                html += `<li><a href="javascript:;"><img src="${base.getPic(p)}"/></a></li>`
            });
            
            $("#ban_pic1 ul").html(html);
            $("#ban_num1 ul").html(html);
            
            if(pic.length>1){
            	swiperPic()
            }
            
			res.judge == "1" ? $(".dconTop-right .icon-star").addClass("active") : "";
			
            $("#NowName").html(data.name);
            $(".dconTop-right .title-wrap .title").html(data.name);
            $(".dconTop-right .tel").html(data.telephone)
            $(".dconTop-right .joinPlace").html(data.province+data.city+data.area+" "+data.detail)
            $(".dconTop-right .lowPrice p i").html("￥"+base.formatMoney(data.lowPrice));
            
            // 名宿
            if(data.category == "4"){
                $(".nav-li-1").html("民宿特色");
                $(".nav-li-2").html("民宿美食");
            }else{
                $(".nav-li-1").html("酒店特色");
                $(".nav-li-2").html("酒店美食");
            }
            
			$("#specialDesc").html(data.specialDesc);
			$("#foodDesc").html(data.foodDesc);
			
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
		return generalCtr.getCollect(code,3,true).then((data)=>{
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
                        location.href = "../user/identity.html"
                    }, base.emptyFun);
                return;
            }
            submitOrder();
        	_loadingSpin.addClass("hidden");
		},()=>{
			
        	_loadingSpin.addClass("hidden");
		})
	}
	
	//立即预订
	function submitOrder(){
        _loadingSpin.removeClass("hidden");
        var data = $("#submitForm").serializeObject();
        data.hotalRoomCode = $("#confirm").attr("data-roomCode");
        data.quantity =  $("#quantity").val();
        
        hotelCtr.setOrder(data).then((d)=>{
        	location.href = "../pay/pay.html?code="+d.code+"&type=0";
        },()=>{
    		_loadingSpin.addClass("hidden");
        })
	}
	
	// 初始化评论分页器
    function initPaginationCom(data){
    	
    	$("#paginationCom .pagination").show();
        $("#paginationCom .pagination").pagination({
            pageCount: data.totalPage,
            showData: configCom.limit,
            jump: true,
            coping: true,
            prevContent: '<img src="/static/images/arrow---left.png" />',
            nextContent: '<img src="/static/images/arrow---right.png" />',
            keepShowPN: true,
            totalData: data.totalCount,
            jumpIptCls: 'pagination-ipt',
            jumpBtnCls: 'pagination-btn',
            jumpBtn: '确定',
            isHide: true,
            callback: function(_this){
                if(_this.getCurrent() != configCom.start){
    				_loadingSpin.removeClass("hidden");
                    configCom.start = _this.getCurrent();
                    getPageCom(configCom);
                }
            }
        });
    }
    
	//分页查评论
	function getPageCom(params){
		return generalCtr.getPageComment(params).then((data)=>{
            
            configCom.start == 1 && initPaginationCom(data);
			$("#commentList").empty();
			$("#commentList").html(comTmpl({items: data.list}));
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	// 初始化房间分页器
    function initPaginationRoom(data){
    	
    	$("#paginationRoom .pagination").show();
        $("#paginationRoom .pagination").pagination({
            pageCount: data.totalPage,
            showData: configRoom.limit,
            jump: true,
            coping: true,
            prevContent: '<img src="/static/images/arrow---left.png" />',
            nextContent: '<img src="/static/images/arrow---right.png" />',
            keepShowPN: true,
            totalData: data.totalCount,
            jumpIptCls: 'pagination-ipt',
            jumpBtnCls: 'pagination-btn',
            jumpBtn: '确定',
            isHide: true,
            callback: function(_this){
                if(_this.getCurrent() != configRoom.start){
    				_loadingSpin.removeClass("hidden");
                    configRoom.start = _this.getCurrent();
                    getPageHotelRoom(configRoom);
                }
            }
        });
    }
	
	//分页查询房间
	function getPageHotelRoom(params){
		return hotelCtr.getPageHotelRoom(params).then((data)=>{
            
        	configRoom.start == 1 && initPaginationRoom(data);
        
			$("#roomList ul").empty();
			$("#roomList ul").html(roomTmpl({items: data.list}));
            if(data.totalPage>1){
            	$("#paginationRoom").removeClass("hidden")
            }else{
            	
            	$("#paginationRoom").addClass("hidden")
            }
            
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
    function addListener() {
    	//收藏
    	$(".dconTop-right .icon-star").click(function(){
        	_loadingSpin.removeClass("hidden");
    		getCollect()
    	})
    	
    	//评论
        $("#commentBtn").click(function(){
        	if(!base.isLogin()){
    			base.goLogin();
    			return ;
    		}
        	
        	var _commentCon = $("#commentCon");
        	var content = _commentCon.val()
        	
        	if(content){
        		
        		_commentCon.siblings(".error").html("&nbsp;")
        		var params = {
	        		type: "2",
        			content: content,
				    parentCode: code,
					topCode: code
	        	}
        		
        		_loadingSpin.removeClass("hidden");
	        	generalCtr.getCommentPull(params).then(()=>{
	        		getPageCom(configCom);
        			_loadingSpin.addClass("hidden");
	        	},()=>{
	        		
        			_loadingSpin.addClass("hidden");
	        	})
        	}else{
        		_commentCon.siblings(".error").html("不能为空")
        	}
        	
        })
        
        //日期
        setTimeout(() => {
            var start = {
				elem: '#startDate',
				min: laydate.now(), //设定最小日期为当前日期
				start:  laydate.now(),
				choose: function(datas){
			    	end.min = datas; //开始日选好后，重置结束日的最小日期
			    	end.start = datas //将结束日的初始值设定为开始日
				}
			};
			var end = {
				elem: '#endDate',
				min: laydate.now(+1),
				start:  laydate.now(+1),
				choose: function(datas){
			    	start.max = datas; //结束日选好后，重置开始日的最大日期
				}
			};
			laydate(start);
			laydate(end);
            
            $("#startDate").val(laydate.now());
            $("#endDate").val(laydate.now(+1));
            
        }, 1);
        
        //房间预订
        //立即预订点击
    	$("#roomList ul").on("click","li .subBtn",function(){
    		if(!base.isLogin()){
    			base.goLogin();
    			return ;
    		}
    		
    		var _this = $(this);
    		
    		$("#hotalRoomCode").val(_this.attr("data-roomName"));
    		$("#quantity").val(_this.attr("data-quantity"));
    		$("#confirm").attr("data-roomCode",_this.attr("data-roomCode"));
        	$("#Dialog").removeClass("hidden");
    	})
    	
    	$("#roomList ul").on("click","li .icon-sub",function(){
    		var _num = parseInt($(this).siblings(".num").html());
    		_num<=1?1:_num--;
    		$(this).siblings(".num").html(_num);
    		$(this).parent(".number").siblings(".btn-wrap").children(".subBtn").attr("data-quantity",_num)
    	})
    	
    	$("#roomList ul").on("click","li .icon-add",function(){
    		var _num = parseInt($(this).siblings(".num").html());
    		var remain =$(this).siblings(".num").attr("data-remain")
    		_num>=remain?remain:_num++;
    		$(this).siblings(".num").html(_num);
    		$(this).parent(".number").siblings(".btn-wrap").children(".subBtn").attr("data-quantity",_num)
    	})
    	
    	$("#submitForm").validate({
            'rules': {
            	'hotalRoomCode':{
            		required: true
            	},
            	'quantity':{
            		required: true
            	},
            	'checkInName':{
            		required: true
            	},
            	'checkInMobile':{
            		required: true,
            		mobile: true
            	},
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
        	$("#applyNote").val("");
    		$("#confirm").attr("data-roomCode","");
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
