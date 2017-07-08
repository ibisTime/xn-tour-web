define([
    'app/controller/base',
    'app/interface/mallCtr',
    'app/interface/generalCtr',
    'app/util/dict'
], function(base, mallCtr, generalCtr, Dict) {

    var mallOrderStatus = Dict.get("mallOrderStatus"),
        code = base.getUrlParam("code");

    init();

    // 初始化页面
    function init() {
        getMallOrder();
    }
    // 获取商品订单信息
    function getMallOrder(refresh){
        $.when(
            generalCtr.getOrderDetail("618472", code),
            generalCtr.getDictList("wl_company")
        ).then((data, wlData) => {
            var html = "";
            $.each(data.productOrderList, function(index, product) {
                html += buildHtml(index, product, data);
            });
            html += `<li>
                        <div class="top wp100 over-hide ptb10"></div>
                        <div class="con wp100" style="min-height: 30px;">
                            <div class="txt fl">
                                <p>总积分：${base.fZeroMoney(data.amount1)}</p>
                            </div>
                            ${
                                data.status == "0" || data.status == "1"
                                    ? `<div class="btn-wrap">
                                        ${
                                            data.status == "0"
                                                ? `<input type="button" value="取消订单" class="btn1 cancel-order-btn"/>
                                                <input type="button" value="去付款" class="btn2 pay-order-btn"/>`
                                                : `<input type="button" value="退款" class="btn1 refund-order-btn"/>`
                                        }
                                    </div>`
                                    : ""
                            }
                        </div>
                    </li>`
            $("#content").html(html)
                .append(buildAddrHtml(data))
                .append(buildLogisticsHtml(data, wlData))
                .append(buildApplyNoteHtml(data));
            addListener();
        }, () => {})
    }
    // 生成商品html
    function buildHtml(index, item, data){
        return `<li>
                    ${
                        index == 0
                            ? `<div class="top wp100 over-hide ptb10">
                                <div class="fl">订单编号：${code}</div>
                                <div class="fr">${base.formatDate(data.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                            </div>` : ""
                    }

                    <div class="con wp100">
                        <a href="../mall/mall-detail.html?code=${item.productCode}" class="wp100">
                            <div class="img fl"><img src="${base.getPic(item.advPic)}"/></div>
                            <div class="txt fl">
                                <p>${item.productName}</p>
                                <p>${base.fZeroMoney(item.price1)}积分</p>
                                <span>x${item.quantity}</span>
                            </div>
                            ${index == 0 ? `<div class="status status0">${mallOrderStatus[data.status]}</div>` : ""}
                        </a>
                    </div>
                </li>`;
    }
    // 生成收件地址html
    function buildAddrHtml(item) {
        return `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">收件信息</div>
                    </div>
                    <div class="con wp100">
                        <div class="txt fl">
                            <p>收件人：${item.receiver}</p>
                            <p>收件人手机：${item.reMobile}</p>
                            <span>收件地址：${item.reAddress}</span>
                        </div>
                    </div>
                </li>`;
    }
    // 生成物流信息html
    function buildLogisticsHtml(data, wlData) {
        return data.logisticsCode ? `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">物流信息</div>
                    </div>
                    <div class="con wp100">
                        <div class="txt fl">
                            <p>物流单号：${data.logisticsCode}</p>
                            <p>物流公司：${base.findObj(wlData, "dkey", data.logisticsCompany)['dvalue']}</p>
                        </div>
                    </div>
                </li>` : "";
    }
    // 生成备注的html
    function buildApplyNoteHtml(item) {
        return item.applyNote ? `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">备注</div>
                    </div>
                    <div class="con wp100">
                        <div class="txt fl">
                            <p>${item.applyNote}</p>
                        </div>
                    </div>
                </li>` : "无"
    }
    function addListener() {
        // 取消订单
        $(".cancel-order-btn").click(function(){
            cancelOrder();
        });
        // 立即支付
        $(".pay-order-btn").click(function(){
            location.href = "../pay/pay.html?code=" + code + "&type=5";
        });
        var _errorSpan = $("#error-span"),
            _confirmBtn = $("#ant-modal-confirm"),
            _refundArea = $("#refundArea"),
            _refundModal = $("#refund-modal");
        // 退款
        $(".refund-order-btn").click(function(){
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
        _refundModal.find(".ant-modal-close-x").click(function(){
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
                mallCtr.cancelMallOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        getMallOrder(true);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
    // 退款
    function refundOrder(remark, ele) {
        ele.prop("disabled", true).find("span").text("退款中...");
        mallCtr.refundMallOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                getMallOrder(true);
                $("#refund-modal").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }
});
