define([
    'app/controller/base',
    'app/util/dict',
    'app/interface/mallCtr'
], function(base, Dict, mallCtr) {
    var mallOrderStatus = Dict.get("mallOrderStatus");

    function buildMall(data){
        var html = '';
        if(data.list.length){
            $.each(data.list, function(i, d){
                html += buildHtml(d);
            });
        } else {
            html = '<li style="text-align: center;padding-top: 25px;">暂无数据</li>';
        }
        return html;
    }

    function buildHtml(item){
        return `<li data-code="${item.code}" data-type="5">
            <div class="top wp100 over-hide ptb10">
                <div class="fl">订单编号：${item.code}</div>
                <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
            </div>
            <div class="con wp100">
                <div class="img fl"><a href="#"><img src="${base.getPic(item.productOrderList[0].advPic)}"/></a></div>
                <div class="txt fl">
                    <p>${item.productOrderList[0].productName}</p>
                    <p>${base.formatMoney(item.amount1)}积分</p>
                    <span>x${item.productOrderList[0].quantity}</span>
                </div>
                <div class="status status0">${mallOrderStatus[item.status]}</div>
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
    function cancelOrder(code, callback, ele) {
        return base.confirm("确定取消订单吗？", 1)
            .then(() => {
                ele.prop("disabled", true).val("取消中...");
                mallCtr.cancelMallOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        callback.call(null);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
    function refund(code, callback, remark, ele) {
        ele.prop("disabled", true).find("span").text("退款中...");
        mallCtr.refundMallOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                callback.call(null);
                $("#modal").data("code", "").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }

    return {
        buildMall,
        cancelOrder,
        refund
    }
});
