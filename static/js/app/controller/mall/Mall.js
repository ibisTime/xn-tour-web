define([
    'app/controller/base',
    'pagination',
    'app/util/handlebarsHelpers',
    'app/interface/generalCtr',
    'app/interface/userCtr',
    'app/interface/mallCtr',
], function(base, pagination, Handlebars, generalCtr, userCtr, mallCtr) {
	var config = {
	        start: 1
		};
	var _loadingSpin = $("#loadingSpin");

	var	mallTmpl = __inline('../../ui/mall_item.handlebars');

    init();

    // 初始化页面
    function init() {
        $("#nav li").eq(8).addClass("active");
        _loadingSpin.removeClass("hidden");
        if(base.isLogin()){
            getUserAccount();
        }else {
            $(".mall-top").addClass("hidden");
        }
    	getPageMallList(config);
    	getInte();
        addListener();
        _loadingSpin.addClass("hidden");
    }

	//获取积分余额
	function getUserAccount(){
		userCtr.getUserAccount("XNB",true).then((data)=>{
			$("#amount").html(base.formatMoney(data[0].amount));
        	_loadingSpin.addClass("hidden");
		})
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
                    getPageMallList(config);
                }
            }
        });
    }

    //分页查询商品
	function getPageMallList(params){
		mallCtr.getPageMallList(params,true).then((data)=>{

			if(data.list.length){
            	$(".noData").addClass("hidden");
            	config.start == 1 && initPagination(data);

				$("#mallList ul").empty();
				$("#mallList ul").html(mallTmpl({items: data.list}));

            }else{
				$("#mallList ul").empty();
            	$(".noData").removeClass("hidden");
            	initPagination(data);
            }
    		_loadingSpin.addClass("hidden");
		},()=>{})
	}

	function getInte(){
		generalCtr.getSysConfig("inte").then((data)=>{
			$("#mallRuleCon").html(data.note)
		},()=>{})
	}

    function addListener() {
    	$("#mallRuleShow").click(function(){
    		$("#Dialog").removeClass("hidden")
    	})
    	$(".am-modal-close").click(function(){
    		$("#Dialog").addClass("hidden")
    	})
    }
});
