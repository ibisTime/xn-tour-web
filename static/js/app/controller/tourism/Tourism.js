define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'pagination',
    'app/interface/menuCtr',
    'app/interface/tourismCtr',
    'app/interface/generalCtr',
], function(base, Handlebars, pagination, menuCtr, tourismCtr, generalCtr) {
	
    var category = base.getUrlParam("category") || 17;
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
        	getStyleList(),
        	getCity()
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
                    html += `<li class="${d.code == category ? "active" : ''}">
                    		<a class="wp100 show" href="${url}">
                    		<div class="icon"><img src="${base.getPic(d.pic)}"/></div>
                            <p>${d.name}</p></a></li>`;
                });
			$("#tourismClass ul").html(html);
			
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
			
            if(data.list.length){
            	$(".noData").addClass("hidden");
            	config.start == 1 && initPagination(data);
            	
				$("#tourismNavCon ul").empty();
				$("#tourismNavCon ul").html(tourismTmpl({items: data.list}));
				
            }else{
				$("#tourismNavCon ul").empty();
            	$(".noData").removeClass("hidden");
            	initPagination(data);
            }
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	//地区
	function getCity(){
		base.getAddress().then((data)=>{
			var citylist = data.citylist;
			var html = '<option>不限</option>'
			$.each(citylist, function(i, prov) {
				if(prov.c[0].a){
					$.each(prov.c, function(i, city) {
						html+=`<option value="${city.n}">${city.n}</option>`
	            	});
				}else{
					html+=`<option value="${prov.p}">${prov.p}</option>`
				}
				
            });
            $("#cityList select").html(html);
            
		},()=>{})
	}
	
	// 初始化分页器
    function initPagination(data){
    	$("#pagination .pagination").show();
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
		config.category = category;
		config.type = $("#typeList ul li.active").attr("data-code");
		config.name = $("#cityList select option:selected").attr("value");
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
    	
    	$("#cityList select").bind("change",function(){
    		getSearch();
    	})
    }
});
