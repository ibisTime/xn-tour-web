define([
    'app/controller/base',
    'app/util/dict',
    'app/interface/trafficCtr'
], function(base, Dict, trafficCtr) {
    var specialLineOrderStatus = Dict.get("specialLineOrderStatus");
    function buildSpecialLine(data, specialModule){
        var html = '';
        if(data.list.length){
            $.each(data.list, function(i, d){
                html += buildHtml(d, specialModule);
            });
        } else {
            html = '<li style="text-align: center;padding-top: 25px;">暂无数据</li>';
        }
        return html;
    }

    function buildHtml(item, specialModule){
        return `<li data-code="${item.code}" data-type="2">
                    <a href="./specialLine-order.html?code=${item.code}" class="wp100">
                        <div class="top wp100 over-hide ptb10">
                            <div class="fl">订单编号：${item.code}</div>
                            <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                        </div>
                        <div class="con wp100">
                            <div class="img fl"><img src="${base.getPic(item.specialLine.pic)}"/></div>
                            <div class="txt fl">
                                <p>${specialModule[item.specialLine.type]}</p>
                                <p>上车地点：${item.specialLine.address}</p>
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
                    </a>
                </li>`;
    }
    function cancelOrder(code, callback, ele) {
        return base.confirm("确定取消订单吗？")
            .then(() => {
                ele.prop("disabled", true).val("取消中...");
                trafficCtr.cancelSpecialLineOrder([code])
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
        trafficCtr.refundSpecialLineOrder(code, remark)
            .then(() => {
                base.showMsg("操作成功");
                callback.call(null);
                $("#modal").data("code", "").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }

    return {
        buildSpecialLine,
        cancelOrder,
        refund
    }
});
