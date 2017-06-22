define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    const menuCtr = {
        // 获取banner
        getBanner: (location, refresh) => (
            Ajax.get('806052', {
                type: 2,
                status: 1,
                location
            }, refresh)
        ),
        // 获取首页banner
        getIndexBanner: (refresh) => (
            menuCtr.getBanner(1, refresh)
        )
    }
    return menuCtr;
});
