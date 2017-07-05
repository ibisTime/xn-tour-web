define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 分页查询线路
        getRecommend: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'12';
        	params.status = 1;
        	
            return Ajax.get("618100", params , true);
        },
        // 线路详情
        getTourismDetail: (code,userId) => (
            Ajax.get("618102", {code,userId:userId})
        ),
        // 线路下单
        setOrder: (params) => {
        	params.applyUser = base.getUserId()
        	
            return Ajax.get("618140", params , true);
        },
        // 分页查询攻略
        getPageGL: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'8';
        	params.status = 1;
        	
            return Ajax.get("618115", params , true);
        },
        // 攻略详情
        getDetailGL: (code) => (
            Ajax.get("618116", {code})
        ),
        // 分页查询游记
        getPageYJ: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'8';
        	params.status = 1;
        	
            return Ajax.get("618130", params , true);
        },
    }
});
