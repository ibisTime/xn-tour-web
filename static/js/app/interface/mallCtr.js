define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /*
         * 分页查询商品订单
         * config: {start, limit, statusList, ...}
         */
        getPageMallOrders: (config, refresh) => (
            Ajax.get("618470", {
                applyUser: base.getUserId(),
                ...config
            }, refresh)
        ),
        // 取消商品订单
        cancelMallOrder: (orderCodeList) => (
            Ajax.post("618452", {orderCodeList})
        ),
        // 商品订单退款
        refundMallOrder: (code, remark) => (
            Ajax.post("618456", {
                code,
                remark,
                updater: base.getUserId(),
                userId: base.getUserId()
            })
        ),
        //分页查询商品
        getPageMallList: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'12';

            return Ajax.get("618420", params , true);
        },
    };
});
