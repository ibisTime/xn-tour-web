define([
    'app/controller/base',
    'pagination',
    'app/util/handlebarsHelpers',
    'app/module/banqh',
    'app/interface/generalCtr',
    'app/interface/foodCtr',
], function(base, pagination, Handlebars, Banqh, generalCtr, foodCtr) {
	var code = base.getUrlParam("code"),
		configCom = {
    		start: 1,
    		topCode: code,
    	};
    
	var	comTmpl = __inline('../../ui/comment_item.handlebars');
	
	var _loadingSpin = $("#loadingSpin");

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(7).addClass("active");
        
        _loadingSpin.removeClass("hidden");
        $.when(
        	getFoodDetail(),
        	getPageCom(configCom),
        )
        addListener();
        
        _loadingSpin.addClass("hidden");
    }
    
    //酒店详情
    function getFoodDetail(){
    	return foodCtr.getFoodDetail(code).then((res)=>{
    		var data = res.food;
			var pic = data.pic.split(/\|\|/), html = "";
            $.each(pic, function(i, p){
                html += `<li><a href="javascript:;"><img src="${base.getPic(p)}"/></a></li>`
            });
            
            $("#ban_pic1 ul").html(html);
            $("#ban_num1 ul").html(html);
            
            if(pic.length>1){
            	swiperPic()
            }
            
			res.isCollect == "1" ? $(".dconTop-right .icon-star").addClass("active") : "";
			
            $("#NowName").html(data.name);
            $(".dconTop-right .title-wrap .title").html(data.name);
            $(".dconTop-right .joinPlace").html(data.province+data.city+data.area+" "+data.detail)
            $(".dconTop-right .lowPrice p i").html("￥"+data.price);
            
            
			$("#recommend").html(data.recommend);
			
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

    function addListener() {
    	//收藏
    	$(".dconTop-right .icon-star").click(function(){
        	_loadingSpin.removeClass("hidden");
    		getCollect()
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
