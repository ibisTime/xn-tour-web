define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/interface/menuCtr',
    'app/interface/generalCtr',
    'app/util/dict'
], function(base, trafficCtr, menuCtr, generalCtr, Dict) {

    var specialLineOrderStatus = Dict.get("specialLineOrderStatus"),
        code = base.getUrlParam("code"),
        specialModule,
        startSelectArr, endSelectArr;

    init();

    // 初始化页面
    function init() {
        $.when(
            getSpecialLineOrder(),
        	getZeroType(),
            getDestinationType(),
            getSDict()
        ).then((data) => {
            $("#content").html(buildHtml(data));
            addListener();
        });
    }
    //专线数据字典
    function getSDict() {
        return menuCtr.getModules("goout")
            .then(function(data) {
                specialModule = {};
                $.each(data, function(i, d) {
                    specialModule[d.code] = d.name;
                });
            }, function() {});
    }
    
    // 查询出发地
    function getZeroType() {
        return generalCtr.getDictList("zero_type")
            .then((data) => {
                startSelectArr = data;
            });
    }
    // 查询目的地
    function getDestinationType() {
        return generalCtr.getDictList("destination_type")
            .then((data) => {
                endSelectArr = data;
            });
    }
    // 获取专线订单信息
    function getSpecialLineOrder(refresh){
        return trafficCtr.getSpecialLineOrder(code, refresh);
    }
    function buildHtml(item){
        return `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">订单编号：${item.code}</div>
                        <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                    </div>
                    <div class="con wp100">
                        <div class="img fl"><img src="${base.getPic(item.specialLine.pic)}"/></div>
                        <div class="txt fl">
                            <p>${specialModule[item.specialLine.type]}</p>
                            <p>上车地点：${item.specialLine.address}</p>
                            <samp>出发/达到站：${base.findObj(startSelectArr, "dkey", item.specialLine.startSite)["dvalue"]}/${base.findObj(endSelectArr, "dkey", item.specialLine.endSite)["dvalue"]}</samp>
                            <span>发车时间：${base.formatDate(item.specialLine.outDatetime, 'yyyy-MM-dd hh:mm')}</span>
                            <samp>票数：${item.quantity}张</samp>
                            <samp>¥${base.formatMoney(item.amount)}</samp>
                        </div>
                        <div class="status ${item.status == '0' ? 'status0' : ''}">${specialLineOrderStatus[item.status]}</div>
                        ${
                            item.status == "0" || item.status == "1"
                                ? `<div class="btn-wrap">
                                    ${
                                        item.status == "0"
                                            ? `<input type="button" value="取消订单" class="btn1 cancel-order-btn"/>
                                            <input type="button" value="去付款" class="btn2 pay-order-btn"/>`
                                            : `<input type="button" value="退款" class="btn1 refund-order-btn"/>`
                                    }
                                </div>`
                                : ""
                        }
                    </div>
                </li>`;
    }

    function addListener() {
        // 取消订单
        $(".cancel-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            cancelOrder();
        });
        // 立即支付
        $(".pay-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            location.href = "../pay/pay.html?code=" + code + "&type=2";
        });
        var _errorSpan = $("#error-span"),
            _confirmBtn = $("#ant-modal-confirm"),
            _refundArea = $("#refundArea"),
            _refundModal = $("#refund-modal");
        // 退款
        $(".refund-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            _refundModal.removeClass("hidden");
        });
        // 退款说明
        _refundArea.on("keyup", function(){
            var _this = $(this),
                value = _this.val();
            if(value == undefined || value.trim() === "") {
                _this.addClass("area-error");
                _errorSpan.text("退款理由不能为空");
                _confirmBtn.prop("disabled", true);
            }else if(!base.isNotFace(value)) {
                _this.addClass("area-error");
                _errorSpan.text("退款理由不能包含特殊字符");
                _confirmBtn.prop("disabled", true);
            }else{
                _this.removeClass("area-error");
                _confirmBtn.prop("disabled", false);
                _errorSpan.empty();
            }
        });
        // 关闭modal的图标
        _refundModal.find(".ant-modal-close-x").click(function(){
            _refundModal.addClass("hidden");
            _errorSpan.empty();
            _refundArea.val("").removeClass("area-error");
            _confirmBtn.prop("disabled", true).find("span").text("确认");
        });
        // 关闭modal的按钮
        _refundModal.find("#ant-modal-close").click(function(){
            _refundModal.addClass("hidden");
            _errorSpan.empty();
            _refundArea.val("").removeClass("area-error");
            _confirmBtn.prop("disabled", true).find("span").text("确认");
        });
        // modal的确认按钮
        _confirmBtn.click(function(){
            if(!_refundArea.hasClass("area-error")){
                refundOrder(_refundArea.val(), _confirmBtn);
            }
        });
    }
    // 取消订单
    function cancelOrder() {
        var ele = $(".cancel-order-btn");
        base.confirm("确定取消订单吗？")
            .then(() => {
                ele.prop("disabled", true).val("取消中...");
                trafficCtr.cancelSpecialLineOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        getSpecialLineOrder(true).then((data) => {
                            $("#content").html(buildHtml(data));
                        });
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
    // 退款
    function refundOrder(remark, ele) {
        ele.prop("disabled", true).find("span").text("退款中...");
        trafficCtr.refundSpecialLineOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                getSpecialLineOrder(true).then((data) => {
                    $("#content").html(buildHtml(data));
                });
                $("#refund-modal").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }
});
