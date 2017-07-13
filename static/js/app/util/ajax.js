define([
    'jquery',
    'app/util/dialog',
    'app/module/loading',
    'app/util/cookie'
], function($, dialog, loading, CookieUtil) {
    var cache = {};
	function showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
    };
    var Ajax = {
        get: function(code, json, reload) {
            reload = reload || false;
            return Ajax.post(code, json, reload);
        },
        post: function(code, json, reload) {
            reload = reload == undefined ? true : reload;
            json = json || {};
            json["systemCode"] = SYSTEM_CODE;
            var token =   CookieUtil.get("token");
            token && (json["token"] = token);
            var param = {
                code: code,
                json: json
            };
            var cache_url = "/api" + JSON.stringify(param);
            if (reload) {
                delete cache[code];
            }
            cache[code] = cache[code] || {};
            if (!cache[code][cache_url]) {
                param.json = JSON.stringify(json);
                cache[code][cache_url] = $.ajax({
                    type: 'post',
                    url: '/api',
                    data: param
                });
            }
            return cache[code][cache_url].pipe(function(res) {
            	if (res.errorCode == "4") {
                   // clearSessionUser();
                	sessionStorage.setItem("l-return", location.pathname + location.search);
                   // 登录
                	return $.Deferred().reject("登录超时，请重新登录",res.errorCode);
            	}
                if(res.errorCode != "0"){
                    return $.Deferred().reject(res.errorInfo);
                }
                return res.data;
            }).fail(function(error,eCode){
                showMsg(error);
                if(eCode&&eCode== "4"){
                	setTimeout(function(){
                		location.href = "../user/login.html"
                	},1000)
                }
            });
        }

    };
    return Ajax;
});
