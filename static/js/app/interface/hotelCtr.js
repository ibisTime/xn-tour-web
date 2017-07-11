define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 分页查询酒店
        getHotelPage: (params, refresh) => {
        	params.start = params.start || '1';
        	params.limit = params.limit || '12';
        	params.status = 1;
            params.orderDir = "asc";
            params.orderColumn = "order_no";

            return Ajax.get("618010", params, refresh);
        },
        /*
         * 分页查询酒店订单
         * params: {start, limit, statusList, ...}
         */
        getPageHotelOrders: (params, refresh) => (
            Ajax.get("618050", {
                applyUser: base.getUserId(),
                ...params
            }, refresh)
        ),
        // 详情查询酒店订单
        getHotelOrder: (code, refresh) => (
            Ajax.get("618052", {code}, refresh)
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
        getHotelDetail: (code, refresh) => (
            Ajax.get("618012", {
                code,
                userId: base.getUserId()
            }, refresh)
        ),
        // 房间详情
        getRoomDetail: (code, refresh) => (
            Ajax.get("618032", {code}, refresh)
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
