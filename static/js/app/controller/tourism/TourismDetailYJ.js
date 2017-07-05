define([
    'app/controller/base',
    'pagination',
    'app/util/handlebarsHelpers',
    'swiper',
    'app/module/validate',
    'app/module/banqh',
    'app/interface/tourismCtr',
    'app/interface/generalCtr',
    'app/interface/userCtr',
], function(base, pagination, Handlebars, Swiper, validate, Banqh, tourismCtr, generalCtr, userCtr) {
	var code = base.getUrlParam("code");
	var isIdentity,price;
	
	var glTmpl = __inline('../../ui/tourism_gl.handlebars'),
		yjTmpl = __inline('../../ui/tourism_yj.handlebars'),
		comTmpl = __inline('../../ui/comment_item.handlebars');
	
    var _loadingSpin = $("#loadingSpin");
    var configGL = {
    		start: 1,
    		lineCode: code,
    	},
    	configYJ = {
    		start: 1,
    		lineCode: code,
    	},
    	configCom = {
    		start: 1,
    		topCode: code,
    	};

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(1).addClass("active");
        _loadingSpin.removeClass("hidden");
        $.when(
        	getTourismDetail(),
        	getPageGL(configGL),
        	getPageYJ(configYJ),
        	getPageCom(configCom)
        )
        addListener();
    }
	
	function getTourismDetail(){
		return tourismCtr.getTourismDetail(code,base.getUserId()).then((data)=>{
			price = data.price;
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
            
            if(data.lineTabList){
            	var lineTabList = data.lineTabList;
                // 1 亮点 2行程 3费用 4 须知
                for(var i = 0; i < lineTabList.length; i++){
                    $("#section" + lineTabList[i].type+" .con").html(lineTabList[i].description);
                }
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
	
	//提交订单
	function submitOrder(){
        _loadingSpin.removeClass("hidden");
        var data = $("#submitForm").serializeObject();
        data.lineCode = code;
        
        tourismCtr.setOrder(data).then((d)=>{
        	location.href = "../pay/pay.html?code="+d.code+"&type=1&p="+price;
        },()=>{})
	}
	
	// 初始化攻略分页器
    function initPaginationGL(data){
        $("#paginationGL .pagination").pagination({
            pageCount: data.totalPage,
            showData: configGL.limit,
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
                if(_this.getCurrent() != configGL.start){
    				_loadingSpin.removeClass("hidden");
                    configGL.start = _this.getCurrent();
                    getPageGL(configGL);
                }
            }
        });
    }
    
	//分页查攻略
	function getPageGL(params){
		return tourismCtr.getPageGL(params,true).then((data)=>{
            
            configGL.start == 1 && initPaginationGL(data);
			$("#tourismListGL").empty();
			$("#tourismListGL").html(glTmpl({items: data.list}));
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	// 初始化游记分页器
    function initPaginationYJ(data){
        $("#paginationYJ .pagination").pagination({
            pageCount: data.totalPage,
            showData: configYJ.limit,
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
                if(_this.getCurrent() != configYJ.start){
    				_loadingSpin.removeClass("hidden");
                    configYJ.start = _this.getCurrent();
                    getPageYJ(configYJ);
                }
            }
        });
    }
    
	//分页查游记
	function getPageYJ(params){
		return tourismCtr.getPageYJ(params,true).then((data)=>{
            
            configYJ.start == 1 && initPaginationYJ(data);
			$("#tourismListYJ").empty();
			$("#tourismListYJ").html(yjTmpl({items: data.list}));
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	
	// 初始化评论分页器
    function initPaginationCom(data){
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
	
	
    function addListener() {
    	setTimeout(() => {
            laydate({
                elem: '#outDate',
                min: laydate.now()
            });
            $("#outDate").val(laydate.now());
        }, 1);
    	
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
            	'outDate':{
            		required: true
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
        	$("#applyNote").val("")
        })
        
    	//弹窗-提交订单
        $("#Dialog #confirm").click(function(){
        	if($("#submitForm").valid()){
        		_loadingSpin.removeClass("hidden");
                getUserInfo();
        	}
        })
        
        //评论
        $("#commentBtn").click(function(){
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
        
        
    }
});
