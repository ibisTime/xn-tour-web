define([], function(ajax) {
    var dict = {
        receiptType: {
            "1": "个人",
            "2": "企业"
        },
        fastMail: {
            "EMS": "邮政EMS",
            "STO": "申通快递",
            "ZTO": "中通快递",
            "YTO": "圆通快递",
            "HTKY": "汇通快递",
            "ZJS": "宅急送",
            "SF": "顺丰快递",
            "TTKD": "天天快递"
        },
        currencyUnit: {
            '': '',
            'USB': '$',
            'CNY': '￥',
            'XB': 'S$',
            'SGD': 'S$'
        },
        // 游记状态
        travelNoteStatus: {
            "0": "待审核",
            "1": "审核通过",
            "2": "审核不通过"
        },
        // 商品订单
        mallOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "发货",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 线路订单
        lineOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "已参与",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 酒店订单
        hotelOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "入住",
            "91": "取消订单",
            "92": "取消订单",
            "93": "平台取消订单",
            "94": "退款成功"
        },
        // 专线订单
        specialLineOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "已上车",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 大巴订单
        busOrderStatus: {
            "0": "待支付",
            "1": "已支付",
            "2": "待退款",
            "4": "已完成",
            "31": "退款失败",
            "32": "已接单",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "退款成功"
        },
        // 拼车订单
        carpoolOrderStatus: {
            "0": "待支付定金",
            "1": "已支付定金",
            "2": "待支付尾款",
            "3": "已支付尾款",
            "4": "取消订单",
            "91": "取消订单",
            "92": "取消订单",
            "93": "取消订单",
            "94": "取消订单",
            "95": "黑名单",
            "96": "已完成",
            "97": "待支付定金"
        },
        // 拼车的状态
        carpoolStatus: {
            "0": "未发布",
            "1": "已发布",
            "2": "已满员",
            "3": "已接单待发车",
            "91": "平台取消",
            "92": "已发车"
        }
    };

    var changeToObj = function(data) {
        var data = data || [],
            obj = {};
        data.forEach(function(item) {
            obj[item.dkey] = item.dvalue;
        });
        return obj;
    };

    return {
        get: function(code) {
            return dict[code];
        }
    }
});
