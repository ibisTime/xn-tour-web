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
		
		$("#revisePwd").validate({
            'rules': {
                "oldPwd": {
                    required: true,
                    minlength: 6
                },
                "newPwd": {
                    required: true,
                    minlength: 6
                },
                "reNewPwd": {
                    required: true,
                    equalTo:"#newPwd"
                },
            },
            onkeyup: false
        });
		
		$("#subBtn").click(function(){
			var oldPwd = $("#oldPwd").val();
			var newPwd = $("#newPwd").val();
			
			if($("#revisePwd").valid()){
				base.showLoading();
			
				userCtr.changePwd({
					"oldLoginPwd": oldPwd,
					"newLoginPwd": newPwd
				}).then((data)=>{
					base.hideLoading();
					base.clearSessionUser();
					location.href = './login.html';
				},()=>{
					base.hideLoading();
				})
			}
		})
		
    }
});
