define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	// 分页查询美食
        getPageFoodList: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'12';
        	params.status = 1;

            return Ajax.get("618070", params , true);
        },
        // 美食详情
        getFoodDetail: (code) => (
            Ajax.get("618072", {code,userId:base.getUserId()})
        ),
    };
});
