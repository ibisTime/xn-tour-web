define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /*
         * 分页获取旅游专线
         * config: {start,limit,type,startSite,endSite,dateStart}
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
        // 详情获取拼车信息
        getCarpool: (code) => (
            Ajax.get("618252", {code})
        )

    };
});
