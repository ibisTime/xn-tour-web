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
            return new Promise(function(resolve, reject) {
                cache[code][cache_url]
                    .then(function(res) {
                        if(res.errorCode == "0"){
                            resolve(res.data);
//                      } else if(res.errorCode == "4" || res.errorInfo.indexOf("token") != -1){
//                          loading.hideLoading();
//                          _showMsg("登录超时");
//                          sessionStorage.setItem("login-return", encodeURIComponent(location.pathname + location.search));
//                          setTimeout(function(){
//                              location.href = "../user/redirect.html";
//                          }, 1000);
//                          reject(res.errorInfo);
                        } else{
                            showMsg(res.errorInfo);
                            reject(res.errorInfo);
                        }
                    }, function(error) {
                        showMsg(error);
                        reject(error);
                    });
            });
        }

    };
    return Ajax;
});
