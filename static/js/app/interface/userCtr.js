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
        // 注册
        register: (params) => {
        	params.loginPwdStrength = base.calculateSecurityLevel(params.loginPwd);
        	params.isRegHx = 0;
        	params.kind = 'f1';
        	return Ajax.post("618922", params);
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
        // 获取用户虚拟币账户信息
        getUserAccount: (refresh) => (
            Ajax.get("802503", {
                userId: base.getUserId(),
                currency:"XNB"
            }, refresh)
        ),
        // 修改用户昵称
        setNickName: (nickname) => {
    		Ajax.post("805075", {
                userId: base.getUserId(),
                nickname
            }, true)
        },
        // 修改手机号
        setMobile: (mobile) => {
    		Ajax.post("805150", {
	            userId: base.getUserId(),
	            loginName: mobile
	        }, true)
        },
        // 修改头像
        setPhoto: (photo) => {
    		Ajax.post("805077", {
                userId: base.getUserId(),
                photo
            }, true)
        },
        // 实名认证
        identity: (params) => {
            params.idKind = 1;
            params.userId = base.getUserId();
            return Ajax.post("805193", params);
        },
        // 用户收货地址
        getAddressList: (refresh) => (
            Ajax.get("805165", {userId: base.getUserId()}, refresh)
        ),
        // 新增收货地址,
        getAddressAdd: (params) => {
            params.userId = base.getUserId();
            return Ajax.post("805160", params);
        },
        // 设置默认收货地址
        getAddressDefault: (code) => (
            Ajax.get("805163", {userId: base.getUserId(),code:code}, true)
        ),
        // 删除收货地址
        getAddressDelete: (code) => (
            Ajax.get("805161", {code}, true)
        ),
        // 设置默认收货地址
        getAddressEdit: (params) => {
        	params.userId = base.getUserId()
        	
            return Ajax.get("805162", params, true)
        },
        // 收货地址详情
        getAddressDetail: (code) => (
            Ajax.get("805166", {code}, true)
        ),
    }
});
