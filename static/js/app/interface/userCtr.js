define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 登录
        login: (params) => {
            params.kind = "f1";
            return Ajax.post("805043", params);
        },
        // 微信登录
        wxLogin: (params) => (
            Ajax.post("805152", params)
        ),
        // 注册
        register: (params) => {
            // params.loginPwdStrength = base.calculateSecurityLevel(params.loginPwd);
            // params.isRegHx = "1";
            // return Ajax.post("805076", params);
        },
        // 找回密码
        findPwd: (params) => {
            params.loginPwdStrength = base.calculateSecurityLevel(params.newLoginPwd);
            params.kind = "f1";
            return Ajax.post("805048", params);
        },
        // 修改密码
        changePwd: (params) => {
            params.loginPwdStrength = base.calculateSecurityLevel(params.newLoginPwd);
            params.kind = "f1";
            params.userId = base.getUserId();
            return Ajax.post("805049", params);
        },
        // 绑定手机号
        bindMobile: (params) => {
            params.userId = base.getUserId();
            return Ajax.post("805153", params);
        },
        // 修改手机号
        changeMobile: (params) => {
            params.userId = base.getUserId();
            return Ajax.post("805061", params);
        },
        // 修改昵称
        changeNickName: (params) => {
            params.userId = base.getUserId();
            return Ajax.post("805075", params);
        },
        // 设置交易密码
        setTradePwd: (params) => {
            params.tradePwdStrength = base.calculateSecurityLevel(params.newLoginPwd);
            params.userId = base.getUserId();
            return Ajax.post("805045", params);
        },
        // 获取用户详情
        getUserInfo: (refresh) => (
            Ajax.get("805056", {userId: base.getUserId()}, refresh)
        ),
        // 根据userId获取用户详情
        getUserIdDetail: (userId,refresh) => (
            Ajax.get("805256", {userId: userId}, refresh)
        ),
        // 获取用户账户信息
        getUserAccount: (refresh) => (
            Ajax.get("802503", {
                userId: base.getUserId()
            }, refresh)
        ),
        // 实名认证
        identity: (params) => {
            params.idKind = 1;
            params.userId = base.getUserId();
            return Ajax.post("805044", params);
        }
    }
});
