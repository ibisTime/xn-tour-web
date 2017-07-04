define([
    'app/controller/base',
    'app/interface/generalCtr',
], function(base, generalCtr) {

    init();
    // 初始化页面
    function init() {
    	generalCtr.getSysConfig("telephone",true)
    		.then((data)=>{
    			$("#telephone").text(data.note);
    			$("#telephone1").text(data.note);
    			
    		},()=>{})
    		
    	if(base.isLogin()){
    		$("#goUser").removeClass("hidden")
    	}else{
    		$("#goLogin").removeClass("hidden")
    	}
    	
    	$("#returnBtn").click(function(){
    		base.showLoading();
    		base.clearSessionUser();
    		base.hideLoading();
    		location.href = "./login.html"
    	})
    }
});
