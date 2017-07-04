define([
    'app/controller/base',
    'app/interface/userCtr'
], function(base, userCtr) {

    init();
    
    // 初始化页面
    function init() {
        $("#userNav li").eq(0).addClass("active");
        base.showLoading();
        getUserInfo()
        addListener();
    }
	
	function getUserInfo(){
		userCtr.getUserInfo(base.getUserId(),true).then((data)=>{
			$(".myPic").html("<img src='"+base.getAvatar(data.userExt.photo)+"'/>")
			$(".name").html(data.nickname)
			$(".tel i").html(data.mobile)
        	base.hideLoading();
		},()=>{})
	}
	
    function addListener() {
    }
});
