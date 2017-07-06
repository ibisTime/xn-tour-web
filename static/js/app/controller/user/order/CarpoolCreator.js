define([
    'app/controller/base',
    'app/util/dict',
    'app/interface/trafficCtr'
], function(base, Dict, trafficCtr) {
    var carpoolOrderStatus = Dict.get("carpoolOrderStatus");

    function buildCarpool(data){
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
        return `<li data-code="${item.code}">
            <div class="top wp100 over-hide ptb10">
                <div class="fl">订单编号：${item.code}</div>
                <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
            </div>
            <div class="con wp100">
                <div class="txt fl ml0i">
                    <p>上车地点：${item.carpool.startSite}</p>
                    <p>下车地点：${item.carpool.endSite}</p>
                    <span>发车时间：${base.formatDate(item.carpool.outDatetime, 'yyyy-MM-dd hh:mm')}</span>
                    <samp>拼车人数：${item.carpool.totalNum}人</samp>
                    <samp>定金：¥${base.formatMoney(item.firstAmount)}</samp>
                    <samp>尾款：¥${base.formatMoney(item.secondAmount)}</samp>
                </div>
                <div class="status status0">${carpoolOrderStatus[item.status]}</div>
                ${
                    item.status == "0" || item.status == "1" || item.status == "2" || item.status == "97"
                        ? `<div class="btn-wrap">
                            <input type="button" value="取消订单" class="btn1 cancel-order-btn"/>
                            <input type="button" value="去付款" class="btn2 pay-order-btn"/>
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
                trafficCtr.cancelCarpoolOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        callback.call(null);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }

    return {
        buildCarpool,
        cancelOrder
    }
});
