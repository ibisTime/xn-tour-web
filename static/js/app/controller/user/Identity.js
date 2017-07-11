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

		$("#identityForm").validate({
            'rules': {
                "realName": {
                    required: true,
                    chinese: true
                },
                "idNo": {
                    required: true,
                    isIdCardNo: true
                },
            },
            onkeyup: false
        });
		var _loadingSpin = $("#loadingSpin");
		$("#subBtn").click(function(){
			var realName = $("#realName").val();
			var idNo = $("#idNo").val();

			if($("#identityForm").valid()){
                _loadingSpin.removeClass("hidden");
		        userCtr.identity({
		            realName: realName,
		            idNo: idNo
		        }).then(function(){
		            _loadingSpin.addClass("hidden");
					base.showMsg("认证成功");
					setTimeout(function(){
                        var returnUrl = sessionStorage.getItem("l-return");
                        sessionStorage.removeItem("l-return");
                        if(returnUrl) {
                            location.href = returnUrl
                        }else {
                            window.history.back();
                        }
					}, 500);
		        }, function(){
		            _loadingSpin.addClass("hidden");
		        });
			}
		})

    }
});
