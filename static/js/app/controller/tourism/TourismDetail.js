define([
    'app/controller/base',
    'pagination'
], function(base, pagination) {

    init();
    
    // 初始化页面
    function init() {
        $("#nav li").eq(1).addClass("active");
        addListener();
    }

    function addListener() {
    	
    	$(".ul-tourismList li .icon-collection").click(function(){
    		if($(this).hasClass("active")){
    			$(this).removeClass("active");
    		}else{
    			$(this).addClass("active");
    		}
    	})
    	
    	$(".icon-star").click(function(){
    		if($(this).hasClass("active")){
    			$(this).removeClass("active");
    		}else{
    			$(this).addClass("active");
    		}
    	})
    }
});
