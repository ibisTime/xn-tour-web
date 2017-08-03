define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'pagination',
    'app/interface/menuCtr',
    'app/interface/generalCtr',
    'app/interface/hotelCtr'
], function(base, Handlebars, pagination, menuCtr, generalCtr, hotelCtr) {
    var category = base.getUrlParam("category"),
    	categoryData = category.split(","),
    	totalPage = 1,
		config = {
	        start: 1
		},
    	hotelTmpl = __inline('../../ui/hotel_item.handlebars');

    var _loadingSpin = $("#loadingSpin");

    init();

    // 初始化页面
    function init() {
        $("#nav li").eq(2).addClass("active");

        _loadingSpin.removeClass("hidden");
   		$.when(
        	getModules(),
        	getDropDescription()
   		).then(() => {
   			getSearch();
   		});
		addListener();
		_loadingSpin.addClass("hidden");
    }

    //获取类别
	function getModules(){
		return menuCtr.getModules("depart_hotel").then((data)=>{
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
                html += `<li data-category="`+base.getUrlParam('category','?'+url.split("?")[1])+`"`;
                $.each(categoryData, function(j, c){
                	if(d.code == c){
                		html += `class="active"`;
                		return false;
                	}
                })
                
                html += `>
                		<div class="icon"><img src="${base.getPic(d.pic)}"/></div>
                        <p>${d.name}</p></li>`;
            });

			$("#hotelClass ul").html(html);
		}, () => {})
	}

	//获取设施服务
	function getDropDescription(){
		return generalCtr.getDictList("hotel_ss",true).then((data)=>{
			var html = '<li class="active none">不限</li>';
			$.each(data, function(i, d){
                html += `<li class="hdc-item" data-description="${d.dkey}">${d.dvalue}</li>`;
            });
			$("#hotelDropDescription ul").html(html)
		}, () => {})
	}

	// 初始化分页器
    function initPagination(data){

    	$("#pagination .pagination").show().pagination({
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
                    getHotelPage(config);
                }
            }
        });
    }

	//分页查询酒店
	function getHotelPage(params){
		hotelCtr.getHotelPage(params).then((data)=>{
			if(data.list.length){
            	$(".noData").addClass("hidden");
            	config.start == 1 && initPagination(data);

				$("#hotelList ul").empty();
				$("#hotelList ul").html(hotelTmpl({items: data.list}));

            }else{
				$("#hotelList ul").empty();
            	$(".noData").removeClass("hidden");
            	initPagination(data);
            }
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}

	//根据搜索条件获取数据
	function getSearch(){
		_loadingSpin.removeClass("hidden");
		config.category = category;
		config.price = $("#hotelPrice ul li.active").attr("data-price");

		var desc = "";
		$("#hotelDropDescription").find(".hdc-item.active").each(function(){
            desc += $(this).attr("data-description") + ",";
        });
		config.description = desc && desc.substr(0, desc.length - 1) || "";
        config.start = 1;
		getHotelPage(config);
	}

    function addListener() {
    	
    	$(".nav-class ul").on("click","li",function(){
			$(this).toggleClass("active");
			var categoryArray=[];
			$(".nav-class ul li").each(function(i, d){
				if($(this).hasClass("active")){
					categoryArray.push($(this).attr("data-category"))
				}
			})
			location.href="/go/hotel-list.html?category="+categoryArray
    	});
    	
    	$("#hotelPrice ul li").click(function(){
			if(!$(this).hasClass("active")){

				$(this).addClass("active").siblings("li").removeClass("active");
				getSearch();
			}
    	})

    	$("#hotelDropDescription").on("click",".hdc-item",function(){
    		$(this).toggleClass("active");
            var hasActive;
    		$("#hotelDropDescription").find(".hdc-item").each(function(){
	            var _self = $(this);

	            if(_self.hasClass("active")){
                    hasActive = true;
	            	return false;
	            }
	        });
            if(hasActive){
                $("#hotelDropDescription").find(".none").removeClass("active");
            }else{
                $("#hotelDropDescription").find(".none").addClass("active");
            }
    		getSearch();
    	})

    	$("#hotelDropDescription").on("click",".none",function(){
    		if(!$(this).hasClass("active")){
	    		$(this).addClass("active");
	    		$(this).siblings(".hdc-item").removeClass("active");
	    		getSearch();
    		}
    	})

    }
});
