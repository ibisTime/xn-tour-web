define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/interface/userCtr'
], function(base, Validate, userCtr) {

    var _loadingSpin = $("#loadingSpin");
    init();

    // 初始化页面
    function init() {
        addListener();
    }
    
    function getGoLogin(){
    	var loginName = $("#loginName").val();
		var pwd = $("#password").val();

		if($("#loginForm").valid()){
			_loadingSpin.removeClass("hidden");
			userCtr.login({
				"loginName": loginName,
				"loginPwd": pwd,
				"kind": "f1"
			}).then((data) => {
				if($("#isRem").hasClass("active")){
					base.setSessionUser(data, true);
				}else{
					base.setSessionUser(data);
				}
				_loadingSpin.addClass("hidden");
                base.goReturn();
			},() => {
                _loadingSpin.addClass("hidden");
			});
		}
    }

    function addListener() {
		$(".loginForm .check").click(function(){
			if($(this).hasClass("active")){
				$(this).removeClass("active")
			}else{
				$(this).addClass("active")
			}
		})

		$("#loginForm").validate({
            'rules': {
                "password": {
                    required: true,
                    minlength: 6
                },
                "loginName": {
                    required: true,
                    mobile: true
                }
            },
            onkeyup: false
        });
		$("#loginBtn").click(function(){
			getGoLogin();
		})
		
		//enten键
		$("#loginName").focus(function(){
    		var _loginName = $(this)
    		 $(document).keyup(function(event){
				if(event.keyCode==13){
					getGoLogin();
				}
			}); 
    	})
    	$("#loginName").blur(function(){
			if (window.event.keyCode==13) window.event.keyCode=0 ;
    	})
    	$("#password").focus(function(){
    		var _password = $(this)
    		 $(document).keyup(function(event){
				if(event.keyCode==13){
					getGoLogin();
				}
			}); 
    	})
    	$("#password").blur(function(){
			if (window.event.keyCode==13) window.event.keyCode=0 ;
    	})

    }
});
