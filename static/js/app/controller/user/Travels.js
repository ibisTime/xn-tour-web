define([
    'app/controller/base',
    'pagination'
], function(base, pagination) {

    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(3).addClass("active");
        

        addListener();
    }

    function addListener() {

    	$("#pagination .pagination").pagination({
		    pageCount:10,
		    jump:true,
		    coping:true,
		    prevContent:'<img src="/static/images/arrow---left.png" />',
		    nextContent:'<img src="/static/images/arrow---right.png" />',
		    keepShowPN: true,
		    count: 1,
		    jumpIptCls:'pagination-ipt',
		    jumpBtnCls:'pagination-btn',
		    jumpBtn: '确定'
		});
    }
});
