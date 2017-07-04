define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 分页查询线路
        getHotelPage: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'12';
        	
            return Ajax.get("618010", params , true);
        },
    }
});
