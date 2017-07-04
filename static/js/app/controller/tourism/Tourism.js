define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'pagination',
    'app/interface/menuCtr',
    'app/interface/tourismCtr',
    'app/interface/generalCtr',
], function(base, Handlebars, pagination, menuCtr, tourismCtr, generalCtr) {
	
    var tourismTmpl = __inline('../../ui/tourism_item.handlebars');
    var totalPage=1;
	var config = {
        start: 1
	}
	
    var _loadingSpin = $("#loadingSpin");

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(1).addClass("active");
        _loadingSpin.removeClass("hidden");
   		$.when(
        	getModules(),
        	getTypeList(),
        	getTravelTimeList(),
        	getStyleList()
   		).then(()=>{
   			getSearch();
   		})
		addListener();
		_loadingSpin.addClass("hidden");
    }
	
	//获取类别
	function getModules(){
		return menuCtr.getModules("travel").then((data)=>{
			var html = "";
			// 获取八大模块
                $.each(data, function(i, d){
                    var url = d.url;
                    if(/^page:/.test(url)){
                        url = url.replace(/^page:/, "../").replace(/\?/, ".html?");
                        if(!/\?/.test(url)){
                            url = url + ".html";
                        }
                    }
                    html += `<li data-code="${d.code}">
                    		<div class="icon"><img src="${base.getPic(d.pic)}"/></div>
                            <p>${d.name}</p></li>`;
                });
			$("#tourismClass ul").html(html);
			$("#tourismClass ul").find('li').eq(0).addClass("active");
			
		},()=>{})
	}
	
	//获取线路类型
	function getTypeList(){
		return generalCtr.getDictList("router_type",true).then((data)=>{
			var html = '<li class="active">不限</li>';
			
			$.each(data, function(i, d){
                html += `<li data-code="${d.dkey}">${d.dvalue}</li>`;
            });
                
			$("#typeList ul").html(html)
		},()=>{})
	}
	
	//获取线路形式
	function getStyleList(){
		return generalCtr.getDictList("router_type2",true).then((data)=>{
			var html = '<li class="active">不限</li>';
			
			$.each(data, function(i, d){
                html += `<li data-code="${d.dkey}">${d.dvalue}</li>`;
            });
                
			$("#styleList ul").html(html)
		},()=>{})
	}
	
	//获取旅行时间
	function getTravelTimeList(){
		return generalCtr.getDictList("router_time",true).then((data)=>{
			var html = '<li class="active">不限</li>';
			
			$.each(data, function(i, d){
                html += `<li data-code="${d.dkey}">${d.dvalue}</li>`;
            });
                
			$("#travelTimeList ul").html(html)
		},()=>{})
	}
	
	//分页查询推荐线路
	function getTourism(params){
		return tourismCtr.getRecommend(params,true).then((data)=>{
            
            config.start == 1 && initPagination(data);
			$("#tourismNavCon ul").empty();
			$("#tourismNavCon ul").html(tourismTmpl({items: data.list}));
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	// 初始化分页器
    function initPagination(data){
        $("#pagination .pagination").pagination({
            pageCount: data.totalPage,
            showData: config.limit,
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
                if(_this.getCurrent() != config.start){
    				_loadingSpin.removeClass("hidden");
                    config.start = _this.getCurrent();
                    getTourism(config);
                }
            }
        });
    }
	
	//根据搜索条件获取数据
	function getSearch(){
		_loadingSpin.removeClass("hidden");
		config.category = $("#tourismClass ul li.active").attr("data-code");
		config.type = $("#typeList ul li.active").attr("data-code");
		config.travelTime = $("#travelTimeList ul li.active").attr("data-code");
		config.style = $("#styleList ul li.active").attr("data-code");
		getTourism(config);
	}
	
    function addListener() {
    	
    	$(".navSearch-list ul").on("click","li",function(){
			if(!$(this).hasClass("active")){
				
				$(this).addClass("active").siblings("li").removeClass("active");
				getSearch();
			}
    	})
    	
    	$(".nav-class ul").on("click","li",function(){
			if(!$(this).hasClass("active")){
				
				$(this).addClass("active").siblings("li").removeClass("active");
				getSearch();
			}
			
    	})
    	
    }
});
