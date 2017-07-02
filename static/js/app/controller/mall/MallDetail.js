define([
    'app/controller/base',
    'pagination'
], function(base, pagination) {

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(8).addClass("active");
        addListener();
    }

    function addListener() {
    	
    	$(".icon-star").click(function(){
    		if($(this).hasClass("active")){
    			$(this).removeClass("active");
    		}else{
    			$(this).addClass("active");
    		}
    	})
    }
});
