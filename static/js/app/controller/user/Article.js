define([
    'app/controller/base',
    'app/interface/generalCtr',
], function(base, generalCtr) {
	var key = base.getUrlParam("key");
	
    var _loadingSpin = $("#loadingSpin");
    init();
    
    // 初始化页面
    function init() {
        _loadingSpin.removeClass("hidden");
        getSysConfig()
    }
	
	function getSysConfig(){
		generalCtr.getSysConfig(key).then((data)=>{
			
			$("#NowName").html(data.cvalue)
			$("#title").html(data.cvalue)
			$("#note").html(data.note)
			
        	_loadingSpin.addClass("hidden");
		},()=>{
			
        	_loadingSpin.addClass("hidden");
		})
	}
	
});
