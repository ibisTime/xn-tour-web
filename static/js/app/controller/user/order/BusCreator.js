define([
    'app/controller/base',
    'app/util/dict',
    'app/interface/trafficCtr'
], function(base, Dict, trafficCtr) {
    var busOrderStatus = Dict.get("busOrderStatus");

    function buildBus(data){
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
        return `<li data-code="${item.code}" data-type="3">
                    <a class="wp100" href="./bus-order.html?code=${item.code}">
                        <div class="top wp100 over-hide ptb10">
                            <div class="fl">订单编号：${item.code}</div>
                            <div class="fr">${base.formatDate(item.bookDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                        </div>
                        <div class="con wp100">
                            <div class="txt fl ml0i">
                                <p>上车地点：${item.startSite}</p>
                                <p>下车地点：${item.endSite}</p>
                                <span>发车时间：${base.formatDate(item.outDatetime, 'yyyy-MM-dd hh:mm')}</span>
                                <samp>人数：${item.totalNum}人</samp>
                                <samp>¥${base.formatMoney(item.distancePrice)}</samp>
                            </div>
                            <div class="status ${item.status == '0' ? 'status0' : ''}">${busOrderStatus[item.status]}</div>
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
                    </a>
                </li>`;
    }
    function cancelOrder(code, callback, ele) {
        return base.confirm("确定取消订单吗？")
            .then(() => {
                ele.prop("disabled", true).val("取消中...");
                trafficCtr.cancelBusOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        callback.call(null);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
    function refund(code, callback, remark, ele) {
        ele.prop("disabled", true).find("span").text("操作中...");
        trafficCtr.refundBusOrder(code, remark)
            .then(() => {
                base.showMsg("操作成功");
                callback.call(null);
                $("#modal").data("code", "").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }

    return {
        buildBus,
        cancelOrder,
        refund
    }
});
