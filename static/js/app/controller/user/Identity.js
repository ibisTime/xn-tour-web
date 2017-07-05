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
		
		$("#subBtn").click(function(){
			var realName = $("#realName").val();
			var idNo = $("#idNo").val();
			
			if($("#identityForm").valid()){
				base.showLoading("认证中...");
			
		        userCtr.identity({
		            realName: realName,
		            idNo: idNo
		        }).then(function(){
		            base.hideLoading();
					base.showLoading("认证成功");
					
					setTimeout(function(){
		            	base.hideLoading();
						base.goBack();
					},500)
		        }, function(msg){
		            base.showMsg(msg || "实名认证失败");
		        });
			}
		})
		
    }
});
