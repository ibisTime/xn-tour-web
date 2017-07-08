define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/module/smsCaptcha/smsCaptcha',
    'app/interface/userCtr'
], function(base, Validate, smsCaptcha, userCtr) {

    init();
    
    // 初始化页面
    function init() {
        addListener();
    }

    function addListener() {
    	
    	$("#findPwdForm").validate({
            'rules': {
                "smsCode": {
                    sms: true,
                    required: true
                },
                "loginName": {
                    required: true,
                    mobile: true
                },
                "newLoginPwd": {
                    required: true,
                    minlength: 6
                },
            },
            onkeyup: false
        });
    	smsCaptcha.init({
            checkInfo: function () {
                return $("#loginName").valid();
            },
            bizType: "805048",
            id: "getSmsCode",
            mobile: "loginName"
        });
        
        $("#subBtn").click(function(){
        	if($("#findPwdForm").valid()){
        		base.showLoading();
        		
        		userCtr.findPwd({
        			"mobile": $("#loginName").val(),
        			"newLoginPwd": $("#newLoginPwd").val(),
        			"smsCaptcha": $("#smsCode").val()
        		}).then((data)=>{
        			
		        	base.showLoading("找回成功");
		        	
		        	setTimeout(function(){
		        		base.hideLoading();
						location.href = './login.html';
		        	},1000)
        			
        		},()=>{
        			base.hideLoading();
        		})
        	}
        })
    }
});
