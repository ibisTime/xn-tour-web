define([
    'app/controller/base',
    'app/interface/userCtr',
    'app/interface/generalCtr',
    'app/module/validate/validate',
    'app/module/qiniu'
], function(base, userCtr, generalCtr,  Validate, QiniuUpdata) {
	var dimgSrc ,dname, dmobile, token;
    var _loadingSpin = $("#loadingSpin");

    init();
    
    // 初始化页面
    function init() {
        $("#userNav li").eq(0).addClass("active");
        
		_loadingSpin.removeClass("hidden");;
        $.when(
        	getUserInfo(),
        	getQiniuToken()
        )
        addListener();
    }
	
	//获取用户详情
	function getUserInfo(){
		userCtr.getUserInfo(base.getUserId(),true).then((data)=>{
        	$(".myPic img").attr("src",base.getAvatar(data.userExt.photo))
        	$(".myPic img").attr("data-src",data.userExt.photo?data.userExt.photo:"")
			$(".name").val(data.nickname)
			$(".mobile").val(data.mobile)
			
			dimgSrc = data.userExt.photo;
			dname = data.nickname;
			dmobile = data.mobile;
        	
			_loadingSpin.addClass("hidden");
		},()=>{})
	}
	
	//加载七牛token
	function getQiniuToken(){
		generalCtr.getQiniuToken().then((data)=>{
			token = data.uploadToken;
			
			_loadingSpin.removeClass("hidden");;
			QiniuUpdata.uploadInit({
	        	btnId:'photoFile',
	        	containerId:'photoFile-wrap',
	        	starBtnId: 'subBtn',
	        	token: token
	        })
        	
			_loadingSpin.addClass("hidden");
		},()=>{
        	
			_loadingSpin.addClass("hidden");
		})
	}
	
	function setUserInfo(){
		$.when(
			userCtr.setNickName($(".name").val()),
			userCtr.setPhoto($(".myPic img").attr("data-src"))
		).then(()=>{
        	base.showMsg("修改成功");
			_loadingSpin.addClass("hidden");
        	
        	setTimeout(function(){
        		location.href = "./user.html"
        	},1000)
		})
	}
	
	function getObjectURL(file) {//获取图片绝对路径
		var url = null ;
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
		} else if (window.URL!=undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file) ;
		} else if (window.webkitURL!=undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file) ;
		}
		return url ;
	}
	
    function addListener() {
    	$("#editInfo").validate({
            'rules': {
                "name": {
                    required: true,
                },
                "mobile": {
                    required: true,
                    mobile: true
                }
            },
            onkeyup: false
        });
        
        $(".photoFile").change(function(){
        	if($(this).val()){
        		var url = getObjectURL(this.files[0]);
			    var val=$(this).val().lastIndexOf("\\");
			    var imgSrc = $(this).val().substring(val+1);  
	        	
	        	$(".myPic img").attr("src",url)
	        	$(".myPic img").attr("data-src",imgSrc)
        	}
        	
        })
        
        $("#subBtn").click(function(){
        	if($("#editInfo").valid()){
        		
				_loadingSpin.removeClass("hidden");;
        		setUserInfo();
        	}
        })
        
    }
});
