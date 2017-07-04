define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    const menuCtr = {
        // 获取banner
        getBanner: (location, refresh) => (
            Ajax.get('806052', {
                type: 2,
                location
            }, refresh)
        ),
        // 获取首页banner
        getIndexBanner: (refresh) => (
            menuCtr.getBanner("index_banner", refresh)
        ),
        // 获取模块
        getModules: (location, refresh) => (
            Ajax.get('806052', {
                type: 3,
                location
            }, refresh)
        )
    }
    return menuCtr;
});
