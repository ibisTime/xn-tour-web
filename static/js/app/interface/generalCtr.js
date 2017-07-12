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
        // 列表查询签到记录
        getSignInList: (refresh) => (
            Ajax.get("805102", {
                userId: base.getUserId()
            }, refresh)
        ),
        // 签到
        signIn: (addr) => (
            Ajax.post("618921", {
                userId: base.getUserId(),
                location: addr || "中国"
            })
        ),
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
        ),
        // 收藏
        //1 线路,2 攻略,3 酒店,4 美食
        getCollect: (code,toType, refresh, type) => (
            Ajax.get("618320", {
        		toEntity: code,
                toType: toType,
                type: type||2,
                interacter: base.getUserId()
            }, refresh)
        ),
        // 微信支付
        payWeChat: (bizType,params) => (
            Ajax.post(bizType, {
                payType: "3",
                ...params
            })
        ),
        // 普通支付
        normalPay: (bizType, params) => (
            Ajax.post(bizType, {
                payType: "1",
                ...params
            }, true)
        ),
        // 查询订单详情
        getOrderDetail: (bizType,code) => {
            return Ajax.get(bizType, {code:code}, true)
        },
        // 分页查询评论
        getPageComment: (params) => {
        	params.start = params.start||'1';
        	params.limit = params.limit||'10';
            params.orderColumn = "comm_datetime";
            params.orderDir = "desc";
            params.status = 1;
            return Ajax.get("618315", params, true);
        },
        // 评论
        getCommentPull: (params) => {
        	params.commer = base.getUserId();
            return Ajax.get("618310", params, true);
        },
        // 分页查询资金流水
        getPageCapitalFlow: (params, refresh) => {
        	params.userId = base.getUserId()

           return Ajax.get("802520", params, refresh)
        }
    }
});
