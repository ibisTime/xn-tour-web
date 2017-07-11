define([
    'app/controller/base',
    'app/module/banqh',
    'app/interface/generalCtr',
    'app/interface/mallCtr',
    'app/interface/userCtr'
], function(base, Banqh, generalCtr, mallCtr, userCtr) {
	var code = base.getUrlParam("code"),
		quantity = base.getUrlParam("quantity");

	var _loadingSpin = $("#loadingSpin");

    init();

    // 初始化页面
    function init() {
        $.when(
        	getMallDetail(),
        	getAddressList()
        ).then(() => {
            _loadingSpin.addClass("hidden");
        }, () => {
            _loadingSpin.addClass("hidden");
        });
        addListener();
    }

    function getAddressList(){
    	return userCtr.getAddressList(true).then((data)=>{
    		var html = "";
    		if(data.length){
                $.each(data, function(i, d){
                    html +=`<li class="${d.isDefault==0?'':'active'}" data-name="${d.addressee}" data-mobile="${d.mobile}" data-address="${d.province}${d.city}${d.district}${d.detailAddress}">
							<div class="icon-address fl"></div>
							<div class="addressCon fl">${d.province} ${d.city} ${d.district} ${d.detailAddress}（${d.addressee} 收）${d.mobile}</div>
							<div class="isDefault ${d.isDefault==0?'hidden':''} fl">默认地址</div>
						</li>`;
                });
            } else {
            	$(".no-address").removeClass("hidden")
            }
    		$("#addressList ul").html(html)
    	});
    }

	//商品详情
    function getMallDetail(){
    	return mallCtr.getMallDetail(code).then((res)=>{
    		var data = res.product;
			var pic = data.pic1.split(/\|\|/)[0], html = "";

            $("#pic").html('<img src="'+base.getPic(pic)+'"/>').attr("href","mall-detail.html?code="+data.code);
            $("#price").html(base.formatMoney(data.price1));
            $("#name").html(data.name);
            $("#quantity").html(quantity);
            $("#amount").html(base.formatMoney(quantity*data.price1));
		}, () => {});
    }

    function getSubmitOrder(params){
    	return mallCtr.getSubmitOrder(params).then((data)=>{
    		location.href = "../pay/pay.html?code="+data+"&type=5";
    	},() => {
    		_loadingSpin.addClass("hidden");
    	});
    }

    function addListener() {
        // 选择地址
    	$(".addressList ul").on("click","li",function(){
    		$(this).addClass("active").siblings("li").removeClass("active")
    	});
        // 提交订单
    	$("#subBtn").click(function(){
            var _choseAddr = $("#addressList ul li.active");
            if(!_choseAddr.length){
                base.showMsg("您还未选择收货地址");
                return;
            }
    		var receiver = _choseAddr.attr("data-name");
    		var reMobile = _choseAddr.attr("data-mobile");
    		var reAddress = _choseAddr.attr("data-address");

    		var config = {
    			productCode: code,
			    quantity: quantity,
			    receiver: receiver,
			    reMobile: reMobile,
			    reAddress: reAddress,
			    applyNote: $("#applyNote").val(),
    		};
        	_loadingSpin.removeClass("hidden");
    		getSubmitOrder(config)
    	})
    }
});
