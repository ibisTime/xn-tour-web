define([
    'app/controller/base',
    'app/interface/userCtr',
    'app/interface/generalCtr'
], function(base, userCtr, generalCtr) {
    var _loadingSpin = $("#loadingSpin");
    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(0).addClass("active");
        getUserInfo();
        getSignInList();
        addListener();
    }

	function getUserInfo(){
		userCtr.getUserInfo(true)
            .then((data) => {
    			$(".myPic").html("<img src='"+base.getAvatar(data.userExt.photo)+"'/>");
    			$(".name").html(data.nickname);
    			$(".tel i").html(data.mobile);
                var isIdentity = !!data.realName;
                if(isIdentity){
                    $("#identity").addClass("identity-inactive").find("p").text("已实名");
                }
                _loadingSpin.addClass("hidden");
    		},() => {
                _loadingSpin.addClass("hidden");
            });
	}

    function getSignInList() {
        generalCtr.getSignInList()
            .then((data) => {
                var nowDate = new Date().format("yyyy-MM-dd");
                for (var i = data.length; i;) {
                    var tempDate = base.formatDate(data[--i].signDatetime, "yyyy-MM-dd");
                    if (nowDate == tempDate) {
                        $("#signIn").prop("disabled", true).find("span").text("已签到");
                        break;
                    }
                }
            })
    }

    function addListener() {
        // 签到
        $("#signIn").on("click", function() {
            var _this = $(this);
            _this.prop("disabled", true).find("span").text("签到中...");
            generalCtr.signIn()
                .then((data) => {
                    _this.find("span").text("已签到");
                }, () => {
                    _this.prop("disabled", false).find("span").text("签到");
                });
        });
        // 实名认证
        $("#identity").click(function(){
            if(!$(this).hasClass("identity-inactive")){
                sessionStorage.setItem("l-return", location.pathname + location.search);
                location.href = "identity.html";
            }
        })
    }
});
