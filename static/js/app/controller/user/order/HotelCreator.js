define([
    'app/controller/base',
    'app/util/dict',
    'app/interface/hotelCtr'
], function(base, Dict, hotelCtr) {
    var hotelOrderStatus = Dict.get("hotelOrderStatus");

    function buildHotel(data){
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
                <div class="img fl"><a href="#"><img src="${base.getPic(item.pic1)}"/></a></div>
                <div class="txt fl">
                    <p>${item.name}</p>
                    <p>${item.roomType}</p>
                    <p>
                        ${base.formatMoney(item.startDate, "MM月dd号")} - ${base.formatDate(item.endDate, 'MM月dd号')}
                        <span class="pl4">${base.calculateDays(item.startDate, item.endDate) + '晚' + item.quantity + '间'}</span>
                    </p>
                    <p>¥${base.formatMoney(item.amount)}</p>
                </div>
                <div class="status status0">${hotelOrderStatus[item.status]}</div>
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
                hotelCtr.cancelHotelOrder([code])
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
        hotelCtr.refundHotelOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                callback.call(null);
                $("#modal").data("code", "").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }

    return {
        buildHotel,
        cancelOrder,
        refund
    }
});
