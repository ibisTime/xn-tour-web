define([
    'app/controller/base',
    'app/interface/generalCtr',
], function(base, generalCtr) {
	var code = base.getUrlParam("code"),
		price = base.getUrlParam("p"),
	// 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
    	type = base.getUrlParam("type");
	
    var _loadingSpin = $("#loadingSpin");
	
	var payBizType , bizType ,
		config = {orderCodeList: [code]}
    	
	// 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
	if (type == 0) {
        bizType = "618052";
        payBizType = "618042";
    } else if (type == 1) {
        bizType = "618152";
        payBizType = "618142";
    } else if (type == 2) {
        bizType = "618192";
        payBizType = "618182";
    } else if (type == 3) {
        bizType = "618222";
        payBizType = "618212";
    } else if (type == 4) {
        bizType = "618255";
        payBizType = "618242"; //尾款：618246
    } else if (type == 5) {
        bizType = "618472";
        payBizType = "618453";
    }
	
    init();
    
    // 初始化页面
    function init() {
    	
        _loadingSpin.removeClass("hidden");
        addListener();
    }
    
    function pay(){
		generalCtr.payWeChat(payBizType,config).then((data)=>{
			var qrcode = new QRCode('qrcode',data.codeUrl);
		 	qrcode.makeCode(data.codeUrl);
		 	
        	_loadingSpin.addClass("hidden");
		},()=>{
			
        	_loadingSpin.addClass("hidden");
		})
    }

    function addListener() {
    	
    	generalCtr.getOrderDetail(bizType,code).then((data)=>{
    		$(".price i").html('￥'+base.formatMoney(data.line.price))
			if(data.status=='1'){
				
				$(".paySuccess").removeClass("hidden")
        		_loadingSpin.addClass("hidden");
        		
        		setTimeout(function(){
        			location.href="../user/order.html";
        		},3000)
			}else{
				$(".pay-wrap").removeClass("hidden")
				pay();
			}
		},()=>{
			
        	_loadingSpin.addClass("hidden");
		})
    	
    	$("#isPayBtn").click(function(){
    		_loadingSpin.removeClass("hidden");
    		generalCtr.getOrderDetail(bizType,code).then((data)=>{
				if(data.status=='1'){
					$(".pay-wrap").addClass("hidden")
					$(".paySuccess").removeClass("hidden")
	        		_loadingSpin.addClass("hidden");
	        		
	        		setTimeout(function(){
	        			location.href="../user/order.html";
	        		},3000)
	        		
				}else{
					
	        		_loadingSpin.addClass("hidden");
					base.showMsg("尚未付款成功")
				}
			},()=>{
				
	        	_loadingSpin.addClass("hidden");
			})
    	})
    }
});
