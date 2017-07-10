define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/interface/userCtr'
], function(base, Validate, userCtr) {

    init();
    
    // 初始化页面
    function init() {
        addListener();
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
			var loginName = $("#loginName").val();
			var pwd = $("#password").val();
			
			if($("#loginForm").valid()){
				base.showLoading();
			
				userCtr.login({
					"loginName": loginName,
					"loginPwd": pwd,
					"kind": "f1"
				}).then((data)=>{
					var returnUrl = sessionStorage.getItem("l-return")
					
					if($("#isRem").hasClass("active")){
						base.setSessionUser(data,true)
					}else{
						base.setSessionUser(data)
					}
					
					base.hideLoading();
					location.href = returnUrl || "../index.html";
				},()=>{
					base.hideLoading();
				})
			}
			
		})
		
    }
});
