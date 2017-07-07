define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /*
         * 分页获取旅游专线
         * config: {start, limit, type, startSite, endSite, dateStart}
         */
        getPageTravelSpecialLine: (config, refresh) => (
            Ajax.get("618170", {
                status: 1,
                ...config
            }, refresh)
        ),
        /*
         * 分页查询专线订单
         * config: {start, limit, statusList, ...}
         */
        getPageSpecialLineOrders: (config, refresh) => (
            Ajax.get("618190", {
                applyUser: base.getUserId(),
                ...config
            }, refresh)
        ),
        /*
         * 预定专线
         * config: {specialLineCode, quantity}
         */
        bookSpecialLine: (config) => (
            Ajax.get("618180", {
            	"applyUser": base.getUserId(),
            	"applyNote": "",
                ...config
            })
        ),
        // 取消专线订单
        cancelSpecialLineOrder: (orderCodeList) => (
            Ajax.post("618181", {orderCodeList})
        ),
        // 专线订单退款
        refundSpecialLineOrder: (code, remark) => (
            Ajax.post("618185", {
                code,
                remark,
                updater: base.getUserId(),
                userId: base.getUserId()
            })
        ),
        // 发布拼车信息
        publishCarpool: (config) => (
            Ajax.post("618240", {
                userId: base.getUserId(),
                ...config
            })
        ),
        // 参与拼车
        joinCarpool: (carpoolCode) => (
            Ajax.post("618241", {
                carpoolCode,
                userId: base.getUserId()
            })
        ),
        /*
         * 分页获取拼车信息
         * config: {start, limit, ...}
         */
        getPageCarpool: (config, refresh) => (
            Ajax.get("618250", {
                status: 1,
                ...config
            }, refresh)
        ),
        // 详情获取拼车信息
        getCarpool: (code, refresh) => (
            Ajax.get("618252", {code}, refresh)
        ),
        /*
         * 分页查询拼车订单
         * config: {start, limit, statusList, ...}
         */
        getPageCarpoolOrders: (config, refresh) => (
            Ajax.get("618253", {
                applyUser: base.getUserId(),
                ...config
            }, refresh)
        ),
        // 取消拼车订单
        cancelCarpoolOrder: (orderCodeList) => (
            Ajax.post("618243", {orderCodeList})
        ),
        // 预约大巴
        dueBus: (config) => (
            Ajax.post("618210", {
                booker: base.getUserId(),
                ...config
            })
        ),
        // 获取大巴订单详情
        getBusOrderDetail: (code) => (
            Ajax.get("618222", {code})
        ),
        /*
         * 分页查询大巴订单
         * config: {start, limit, statusList, ...}
         */
        getPageBusOrders: (config, refresh) => (
            Ajax.get("618220", {
                booker: base.getUserId(),
                ...config
            }, refresh)
        ),
        // 取消大巴订单
        cancelBusOrder: (orderCodeList) => (
            Ajax.post("618211", {orderCodeList})
        ),
        // 大巴订单退款
        refundBusOrder: (code, remark) => (
            Ajax.post("618215", {
                code,
                remark,
                updater: base.getUserId(),
                userId: base.getUserId()
            })
        )
    };
});
