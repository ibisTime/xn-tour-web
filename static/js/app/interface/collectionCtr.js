define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    var collectionCtr = {
        // 分页查询收藏
        getPageCollection(config, refresh) {
            return Ajax.get("618325", {
                type: 2,
                interacter: base.getUserId(),
                ...config
            }, refresh);
        },
        // 分页查询收藏的线路
        getPageLineCollection(config, refresh) {
            return collectionCtr.getPageCollection({
                toType: 1,
                ...config
            }, refresh);
        },
        // 分页查询收藏的酒店
        getPageHotelCollection(config, refresh) {
            return collectionCtr.getPageCollection({
                toType: 3,
                ...config
            }, refresh);
        },
        // 分页查询收藏的攻略
        getPageGLCollection(config, refresh) {
            return collectionCtr.getPageCollection({
                toType: 2,
                ...config
            }, refresh);
        },
        // 分页查询收藏的美食
        getPageFoodCollection(config, refresh) {
            return collectionCtr.getPageCollection({
                toType: 4,
                ...config
            }, refresh);
        },
        // 删除收藏的数据
        deleteFromCollection(toEntity, toType) {
            return Ajax.post("618320", {
                toEntity,
                toType,
                type: 2,
                interacter: base.getUserId()
            });
        }
    };
    return collectionCtr;
});
