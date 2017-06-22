define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 加载七牛token
        getQiniuToken: () => (
            Ajax.get("807900")
        ),
        // 发送短信验证码
        sendCaptcha: (mobile, bizType) => (
            Ajax.post("805904", {
                mobile,
                bizType,
                kind: "f1"
            })
        ),
        // 分页查询公告
        getPageNotice: (params, refresh) => {
            params.toSystemCode = SYSTEM_CODE;
            params.toKind = 1;
            params.orderColumn = "topush_datetime";
            params.orderDir = "desc";
            params.pushType = 41;
            params.status = 1;
            return Ajax.get("804040", params, refresh);
        },
        // 获取数据字典
        getDictList: (type, refresh) => (
            Ajax.get("807706", {
                parentKey: type
            }, refresh)
        ),
        // 获取系统参数
        getSysConfig: (key, refresh) => (
            Ajax.get("807717", {
                "ckey": key
            }, refresh)
        ),
        // 获取appId
        getAppID: () => (
            Ajax.get("806031", {
        		systemCode: SYSTEM_CODE,
                account: "ACCESS_KEY",
                type: "3"
            })
        )
    }
});
