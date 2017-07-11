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

    	$("#registerForm").validate({
            'rules': {
                "smsCode": {
                    sms: true,
                    required: true
                },
                "loginName": {
                    required: true,
                    mobile: true
                },
                "password": {
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
            bizType: "805041",
            id: "getSmsCode",
            mobile: "loginName"
        });
        var _loadingSpin = $("#loadingSpin");
        $("#regsBtn").click(function(){
        	if($("#registerForm").valid()){
                _loadingSpin.removeClass("hidden");
        		userCtr.register({
        			"mobile": $("#loginName").val(),
        			"loginPwd": $("#password").val(),
        			"smsCaptcha": $("#smsCode").val()
        		}).then((data) => {
                    _loadingSpin.addClass("hidden");
        			base.setSessionUser(data);
		        	base.showLoading("注册成功");
		        	setTimeout(function(){
                        base.goReturn();
		        	},1000);
        		},() => {
        			_loadingSpin.addClass("hidden");
        		})
        	}
        })
    }
});
