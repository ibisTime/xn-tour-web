define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 分页查询线路
        getRecommend: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'12';
        	
            return Ajax.get("618100", params , true);
        },
        // 线路详情
        getTourismDetail: (code,userId) => (
            Ajax.get("618102", {code,userId:userId})
        ),
    }
});
