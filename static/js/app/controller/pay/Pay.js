define([
    'app/controller/base',
    'app/interface/generalCtr',
], function(base, generalCtr) {
	var code = base.getUrlParam("code"),
	   // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
    	type = base.getUrlParam("type"),
        currentStatus;

    var _loadingSpin = $("#loadingSpin");

	var payBizType, bizType,
		config = {orderCodeList: [code]};

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
        if(type == 5){
            $(".title").find("h3").text("积分支付");
        }
        getOrderDetail();
        addListener();
    }
    // 微信二维码支付
    function payWeChat(){
		generalCtr.payWeChat(payBizType, config).then((data)=>{
			var qrcode = new QRCode('qrcode',data.codeUrl);
		 	qrcode.makeCode(data.codeUrl);
        	_loadingSpin.addClass("hidden");
		},()=>{
        	_loadingSpin.addClass("hidden");
		})
    }
    // 余额支付（积分 或 余额）
    function normalPay(){
        generalCtr.normalPay(payBizType, config)
            .then(showSuccess, function() {
                $("#mallPay, #yePay").prop("disabled", false).find("span").text("立即支付");
            });
    }

    function getOrderDetail() {
        generalCtr.getOrderDetail(bizType,code).then((data)=>{
            // 0:酒店 1:线路 2:专线 3:大巴 4:拼车 5:商品
            var price = type == 0
                        ? data.hotalOrder.amount
                        : type == 2
                            ? data.amount
                            : type == 3
                                ? data.distancePrice
                                : type == 5
                                    ? data.amount1 : 0;
            if(type == 1){
                var p1 = +data.amount;
                var p2 = data.hotalOrder && +data.hotalOrder.amount || 0;
                var p3 = data.specialLineOrder && +data.specialLineOrder.amount || 0;
                price = p1 + p2 + p3;
            }
            // 商品是积分支付
            if(type == 5){
                $("#jfPayWrap").removeClass("hidden");
                $("#ant-tabs").addClass("hidden");
                $("#jfPrice").find('i').html(base.formatMoney(price));
            }else if(type == 4){
                var str = "";
                if(data.status == "0" || data.status == "97"){
                    str = "支付定金";
                    price = data.firstAmount;
                }
                else if(data.status == "2"){
                    str = "支付尾款";
                    price = data.secondAmount;
                    payBizType = "618246";
                }
                $("#price, #yePrice").html(`${str}：<i>￥${base.formatMoney(price)}</i>`);
            }else {
                $("#price, #yePrice").find('i').html(`￥${base.formatMoney(price)}`);
            }
            if(type != 5){
                if(type == 4) {
                    if(currentStatus == undefined){
                        // 带支付
                        if(data.status == "0" || data.status == "1" || data.status == "2" || data.status == "97"){
                            showPayQCode();
                        }
                        currentStatus = data.status;
                    }else if(data.status !== currentStatus){
                        showSuccess();
                    }
                }else if(type == 0){
                	if(currentStatus == undefined){
                        // 带支付
                        if(data.hotalOrder.status == "0"){
                            showPayQCode();
                        }
                        currentStatus = data.hotalOrder.status;
                    }else if(data.hotalOrder.status !== currentStatus){
                        showSuccess();
                    }
                }else {
                    if(currentStatus == undefined){
                        if(data.status == '0'){
                            showPayQCode();
            			}
                        currentStatus = data.status;
                    }else if(data.status !== currentStatus){
                        showSuccess();
                    }
                }
                getOrderDetail.timer = setTimeout(getOrderDetail, 3000);
            }else{
        		_loadingSpin.addClass("hidden");
            }
		},()=>{
        	_loadingSpin.addClass("hidden");
		});
    }
    // 线上支付二维码
    function showPayQCode(){
        currentStatus == undefined && payWeChat();
    }
    // 支付成功
    function showSuccess(){
        $("#ant-tabs, #jfPayWrap").addClass("hidden");
        $("#paySuccess").removeClass("hidden")
        _loadingSpin.addClass("hidden");
        setTimeout(function(){
            location.href="../user/order.html";
        }, 3000);
    }

    function addListener() {
        $("#mallPay").click(function(){
            $(this).prop("disabled", true).find("span").text("支付中...");
            normalPay();
        });

        var _antTabs = $("#ant-tabs");
        _antTabs.on("click", ".ant-tabs-tab", function(){
            var _this = $(this),
                index = _this.index();
            _this.addClass("ant-tabs-tab-active").siblings(".ant-tabs-tab-active").removeClass("ant-tabs-tab-active");
            var tabpane = _antTabs.find(".ant-tabs-tabpane").eq(index);
            tabpane.removeClass("ant-tabs-tabpane-inactive").addClass("ant-tabs-tabpane-active")
                .siblings(".ant-tabs-tabpane-active")
                    .removeClass("ant-tabs-tabpane-active").addClass("ant-tabs-tabpane-inactive")
        });

        $("#yePay").click(function(){
            $(this).prop("disabled", true).find("span").text("支付中...");
            normalPay();
        });
    }
});
