define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 分页查询线路
        getRecommend: (params, refresh) => {
        	params.start = params.start || '1';
        	params.limit = params.limit || '12';
        	params.status = 1;
            params.orderDir = "asc";
            params.orderColumn = "order_no";

            return Ajax.get("618100", params, refresh);
        },
        // 线路详情
        getTourismDetail: (code) => (
            Ajax.get("618102", {code,userId:base.getUserId()})
        ),
        // 线路下单
        setOrder: (params) => {
        	params.applyUser = base.getUserId()

            return Ajax.get("618140", params , true);
        },
        /*
         * 分页查询线路订单
         * config: {start, limit, statusList, ...}
         */
        getPageTourismOrders: (config, refresh) => (
            Ajax.get("618150", {
                userId: base.getUserId(),
                ...config
            }, refresh)
        ),
        /*
         * 列表查询线路订单
         * config: {status}
         */
        getTourismOrderList: (status, refresh) => (
            Ajax.get("618151", {
                status,
                userId: base.getUserId()
           })
        ),
        // 详情查询线路订单
        getTourismOrder: (code, refresh) => (
            Ajax.get("618152", {code: code}, refresh)
        ),
        // 取消线路订单
        cancelTourismOrder: (orderCodeList) => (
            Ajax.post("618141", {orderCodeList})
        ),
        // 线路订单退款
        refundTourismOrder: (code, remark) => (
            Ajax.post("618145", {
                code,
                remark,
                updater: base.getUserId(),
                userId: base.getUserId()
            })
        ),
        // 分页查询攻略
        getPageGL: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'8';
        	params.status = 1;

            return Ajax.get("618115", params , true);
        },
        // 攻略详情
        getDetailGL: (code) => (
            Ajax.get("618116", {
                code,
                userId: base.getUserId()
            })
        ),
        // 分页查询游记
        getPageYJ: (params, refresh) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'8';
        	params.status = params.status == undefined ? 1 : params.status;
            params.orderDir = "desc";
            params.orderColumn = "location";
            return Ajax.get("618130", params , refresh);
        },
        // 游记详情
        getDetailYJ: (code) => (
            Ajax.get("618132", {
                code,
                userId: base.getUserId()
            })
        ),
        /*
         * 发表游记
         * config: {lineCode,name,pic,description}
         */
        publishYJ: (config) => (
            Ajax.post("618120", {
                publisher: base.getUserId(),
                ...config
            })
        ),
        // 删除游记
        deleteYJ: (code) => (
            Ajax.post("618121", {
                code,
                userId: base.getUserId()
            })
        )
    }
});
