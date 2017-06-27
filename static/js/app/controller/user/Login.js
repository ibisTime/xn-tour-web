define([
    'app/controller/base'
], function(base) {

    init();
    
    // 初始化页面
    function init() {
        addListener();
    }

    function addListener() {
		$("#loginForm .check").click(function(){
			if($(this).hasClass("active")){
				$(this).removeClass("active")
			}else{
				
				$(this).addClass("active")
			}
		})
    }
});
