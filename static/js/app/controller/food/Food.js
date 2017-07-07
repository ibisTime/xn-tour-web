define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'pagination',
    'app/interface/menuCtr',
    'app/interface/generalCtr',
    'app/interface/foodCtr',
], function(base, Handlebars, pagination, menuCtr, generalCtr, foodCtr) {
	var category = base.getUrlParam("category") || 9,
		totalPage=1,
		config = {
	        start: 1,
		},
    	foodTmpl = __inline('../../ui/food_item.handlebars');
	
	
    var _loadingSpin = $("#loadingSpin");
	
    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(7).addClass("active");
        _loadingSpin.removeClass("hidden");
        
        $.when(
        	getModules(),
        	getDiningNumList(),
        	getDiningTimeList()
   		).then(()=>{
   			getSearch();
   		})
        addListener();
		_loadingSpin.addClass("hidden");
    }
    
    //获取类别
	function getModules(){
		return menuCtr.getModules("depart_deli").then((data)=>{
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
                
			$("#foodClass ul").html(html);
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
                    getPageFoodList(config);
                }
            }
        });
    }
	
	//分页查询酒店
	function getPageFoodList(params){
		foodCtr.getPageFoodList(params,true).then((data)=>{
			
			if(data.list.length){
            	$(".noData").addClass("hidden");
            	config.start == 1 && initPagination(data);
            	
				$("#foodList ul").empty();
				$("#foodList ul").html(foodTmpl({items: data.list}));
            }else{
				$("#foodList ul").empty();
            	$(".noData").removeClass("hidden");
            	initPagination(data);
            }
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	//根据搜索条件获取数据
	function getSearch(){
		_loadingSpin.removeClass("hidden");
		config.type = category;
		config.price = $("#dining-price ul li.active").attr("data-code");
		config.supplyTime = $("#dining-time ul li.active").attr("data-code");
		config.maxSeat = $("#dining-num ul li.active").attr("data-code");
		
		getPageFoodList(config);
	}
	
	//获取用餐人数
	function getDiningNumList(){
		return generalCtr.getDictList("dining_num",true).then((data)=>{
			var html = '';
			
			$.each(data, function(i, d){
                html += `<li class="${i==0?"active":''}" data-code="${d.dkey!=0?d.dkey:''}">${d.dvalue}</li>`;
            });
                
			$("#dining-num ul").html(html)
		},()=>{})
	}
	
	//获取用餐时段
	function getDiningTimeList(){
		return generalCtr.getDictList("dining_time",true).then((data)=>{
			var html = '';
			
			$.each(data, function(i, d){
                html += `<li  class="${i==0?"active":''}"  data-code="${d.dkey!=0?d.dkey:''}">${d.dvalue}</li>`;
            });
                
			$("#dining-time ul").html(html)
		},()=>{})
	}

    function addListener() {
    	$(".navSearch-list ul").on("click","li",function(){
			if(!$(this).hasClass("active")){
				
				$(this).addClass("active").siblings("li").removeClass("active");
				getSearch();
			}
    	})
    	
    }
});
