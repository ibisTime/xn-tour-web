define([
    'app/controller/base',
    'app/util/dict',
    'app/interface/tourismCtr'
], function(base, Dict, tourismCtr) {
    var lineOrderStatus = Dict.get("lineOrderStatus");

    function buildLine(data){
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
        return `<li data-code="${item.code}" data-type="1">
                    <a href="./line-order.html?code=${item.code}">
                        <div class="top wp100 over-hide ptb10">
                            <div class="fl">订单编号：${item.code}</div>
                            <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                        </div>
                        <div class="con wp100">
                            <div class="img fl"><img src="${base.getPic(item.line.pathPic)}"/></div>
                            <div class="txt fl">
                                <p>${item.line.name}</p>
                                <p>¥${base.formatMoney(item.amount)}</p>
                            </div>
                            <div class="status status0">${lineOrderStatus[item.status]}</div>
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
                tourismCtr.cancelTourismOrder([code])
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
        tourismCtr.refundTourismOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                callback.call(null);
                $("#modal").data("code", "").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }

    return {
        buildLine,
        cancelOrder,
        refund
    }
});
