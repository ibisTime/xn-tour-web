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
        getCarpool: (code) => (
            Ajax.get("618252", {code})
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
        )
    };
});
