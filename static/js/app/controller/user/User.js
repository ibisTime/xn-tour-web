define([
    'app/controller/base',
    'app/interface/userCtr'
], function(base, userCtr) {
    var _loadingSpin = $("#loadingSpin");
    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(0).addClass("active");
        getUserInfo()
        addListener();
    }

	function getUserInfo(){
		userCtr.getUserInfo(true)
            .then((data) => {
    			$(".myPic").html("<img src='"+base.getAvatar(data.userExt.photo)+"'/>")
    			$(".name").html(data.nickname)
    			$(".tel i").html(data.mobile)
                _loadingSpin.addClass("hidden");
    		},() => {
                _loadingSpin.addClass("hidden");
            });
	}

    function addListener() {
    }
});
