define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 分页查询酒店
        getHotelPage: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'12';
        	params.status = 1;

            return Ajax.get("618010", params , true);
        },
        /*
         * 分页查询酒店订单
         * params: {start, limit, statusList, ...}
         */
        getPageHotelOrders: (params) => (
            Ajax.get("618050", {
                applyUser: base.getUserId(),
                ...params
            })
        ),
        // 取消酒店订单
        cancelHotelOrder: (orderCodeList) => (
            Ajax.post("618041", {orderCodeList})
        ),
        // 酒店订单退款
        refundHotelOrder: (code, remark) => (
            Ajax.post("618045", {
                code,
                remark,
                updater: base.getUserId(),
                userId: base.getUserId()
            })
        ),
        // 酒店详情
        getHotelDetail: (code) => (
            Ajax.get("618012", {code,userId:base.getUserId()})
        ),
        // 分页查询酒店房间
        getPageHotelRoom: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'4';

            return Ajax.get("618030", params , true);
        },
        //立即预订
        setOrder: (params) => {
        	params.applyUser = base.getUserId()

            return Ajax.get("618040", params , true);
        },
    }
});
