define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/interface/userCtr',
    'app/interface/menuCtr',
    'app/util/dict',
    'pagination'
], function(base, trafficCtr, userCtr, menuCtr, Dict, pagination) {

    var startSite = {
    		name: "",
    		point: {
    			lng: "",
    			lat: ""
    		},
            type: "start"
    	}, endSite = {
    		name: "",
    		point: {
    			lng: "",
    			lat: ""
    		},
            type: "end"
    	}, currentSite;
    var map, config = {},
        pageConfig = {
            start: 1,
            limit: 10
        },
        carpoolStatus = Dict.get("carpoolStatus");

    init();

    // 初始化页面
    function init() {
        $("#nav li").eq(3).addClass("active");
        getModules();
        getPageCarpool();
        setTimeout(function(){
            addListener();
        }, 1);
    }

    // 获取八大模块
    function getModules(){
        return menuCtr.getModules("goout")
            .then((data) => {
                var html = "";
                $.each(data, function(i, d){
                    var url = d.url;
                    if(/^page:/.test(url)){
                        url = url.replace(/^page:/, "../").replace(/\?/, ".html?");
                        if(!/\?/.test(url)){
                            url = url + ".html";
                        }
                    }
                    html += `<li class="${d.url == "page:go/carpool" ? "active" : ''}">
                        <a class="wp100 show" href="${url}">
                            <img src="${base.getPic(d.pic)}"/>
                            <p>${d.name}</p>
                        </a>
                    </li>`;
                });
                $("#navUl").html(html);
            });
    }

    var _loadingSpin = $("#loadingSpin");
    // 分页获取拼车信息
    function getPageCarpool(refresh){
        return trafficCtr.getPageCarpool(pageConfig, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                pageConfig.start == 1 && initPagination(data);
                var html = '';
                if(data.list.length){
                    $.each(data.list, function(i, d){
                        html += buildHtml(d);
                    });
                } else {
                    html = '<tr><td colspan="6">暂无数据</td></tr>';
                }
                $("#body").html(html);
                pageConfig.start++;
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 生成table到html
    function buildHtml(data){
        return `<tr data-code="${data.code}">
                    <td class="trainNum">${data.startSite}</td>
                    <td class="trainNum">${data.endSite}</td>
                    <td class="trainNum">${data.totalNum}</td>
                    <td class="trainNum">${base.formatMoney(data.nextPrice)}<span class="smf">起</span></td>
                    <td class="trainNum">${carpoolStatus[data.status]}</td>
                    <td class="trainNum">${base.formatDate(data.outDatetime, "yyyy-MM-dd hh:mm:ss")}</td>
                </tr>`;
    }
    // 初始化分页器
    function initPagination(data){
        $("#pagination .pagination").pagination({
            pageCount: data.totalPage,
            showData: pageConfig.limit,
            jump: true,
            coping: true,
            prevContent: '<img src="/static/images/arrow---left.png" />',
            nextContent: '<img src="/static/images/arrow---right.png" />',
            keepShowPN: true,
            totalData: data.totalCount,
            jumpIptCls: 'pagination-ipt',
            jumpBtnCls: 'pagination-btn',
            jumpBtn: '确定',
            callback: function(_this){
                if(_this.getCurrent() != pageConfig.start){
                    _loadingSpin.removeClass("hidden");
                    pageConfig.start = _this.getCurrent();
                    getPageCarpool();
                }
            }
        });
    }

    function addListener() {
        // 出行时间
        laydate({
            elem: '#choseDate',
            format: 'YYYY-MM-DD hh:mm',
            min: laydate.now(),
            istime: true
        });
        // 下车地点
        $("#endSite").click(function(){
            currentSite = endSite;
            showPoint();
            $("#modal").removeClass("hidden");
        });
        // 上车地点
        $("#startSite").click(function(){
            currentSite = startSite;
            showPoint();
            $("#modal").removeClass("hidden");
        });
        /*modal start*/
        // 关闭modal的图标
        $(".ant-modal-close-x").click(function(){
            $(this).closest(".ant-modal-wraper").addClass("hidden");
        });
        // 关闭modal的按钮
        $("#ant-modal-close").click(function(){
            $("#modal").addClass("hidden");
        });
        // modal的确认按钮
        $("#ant-modal-confirm").click(function(){
            if(currentSite.type == "start"){
                $("#startSite").html(currentSite.name);
            }else{
                $("#endSite").html(currentSite.name);
            }
            $("#modal").addClass("hidden");
        });
        // 地图listener
        addMapListener();
        /*modal end*/
        // 发布拼车click
        $("#submitBtn").click(function(){
            if(!base.isLogin()){
                base.goLogin();
            }else if(validate()){
                disabledButton();
                userCtr.getUserInfo()
                    .then(function (data) {
                        var isBindMobile = !!data.mobile,
                            isIdentity = !!data.realName;
                        if(!isBindMobile || !isIdentity){
                            unDisabledButton();
                            if(!isBindMobile && !isIdentity){
                                base.confirm("您还未实名认证，点击确认前往实名认证，并绑定手机号")
                                    .then(function () {
                                        alert("去实名认证并绑定手机号");
                                    }, () => {});
                            }else if(!isIdentity){
                                base.confirm("您还未实名认证，点击确认前往实名认证")
                                    .then(function () {
                                        alert("去实名认证");
                                    }, () => {});
                            }else if(!isBindMobile){
                                base.confirm("您还未绑定手机号，点击确认前往绑定手机号")
                                    .then(function () {
                                        alert("去绑定手机号");
                                    }, () => {});
                            }
                            return;
                        }
                        calculateDistance();
                    }, unDisabledButton);
            }
        });
        // 点击tr拼车详情
        $("#body").on("click", "tr", function(){
            window.open("./carpool-detail.html?code=" + $(this).attr("data-code"));
        });
        $(window).scroll(function(e){
            $(".tangram-suggestion-main").hide();
        });
    }
    var _searchMapInput = $("#J_SearchMapInput"),
        _searchMap = $("#J_SearchMapCont"),
        _loading = $("#loadingSpin"),
        _modalConfirm = $("#ant-modal-confirm"),
        _modalTitle = $("#modal").find(".ant-modal-title");
    // 点击 上下车地点的div初始化modal的map
    function showPoint(){
        if(currentSite.type == "start"){
            _modalTitle.text("上车地点");
        }else{
            _modalTitle.text("下车地点");
        }
        if(currentSite.name){
            _searchMapInput.val(currentSite.name);
            setTimeout(function(){
                _searchMapInput.blur();
                var point = new BMap.Point(currentSite.point.lng, currentSite.point.lat);
                map.centerAndZoom(point, 18);
                map.addOverlay(new BMap.Marker(point));
                _modalConfirm.prop("disabled", false);
            }, 100);
        }else{
            _searchMapInput.val("");
            $("#J_SearchMapCont").addClass("hidden");
            _modalConfirm.prop("disabled", true);
        }
    }
    // 添加modal里map的事件
    function addMapListener(){
        map = new BMap.Map("J_SearchMapCont");
        map.enableScrollWheelZoom(true);
        var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
            "input": "J_SearchMapInput",
            "location": map
        });
        ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
            var _value = e.item.value,
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            setPlace(myValue);
            _searchMap.removeClass("hidden");
            _loading.removeClass("hidden");
            _modalConfirm.prop("disabled", true);
        });
        function setPlace(myValue) {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                currentSite.point = {
                    lng: pp.lng,
                    lat: pp.lat
                };
                currentSite.name = myValue;
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp)); //添加标注
                _loading.addClass("hidden");
                _modalConfirm.prop("disabled", false);
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
    }
    // 验证信息是否填写完毕
    function validate(){
        if(!startSite.name){
            base.showMsg("上车地点不能为空");
            return false;
        }
        config.startSite = startSite.name;
        if(!endSite.name){
            base.showMsg("下车地点不能为空");
            return false;
        }
        config.endSite = endSite.name;
        var totalNum = $("#totalNum").val();
        if(totalNum == undefined){
            base.showMsg("人数不能为空");
            return false;
        }
        if(!$.isNumeric(totalNum) || !/\d+/.test(totalNum)){
            base.showMsg("人数必须为正整数");
            return false;
        }
        config.totalNum = totalNum;
        var outDatetime = $("#choseDate").val();
        if(!outDatetime){
            base.showMsg("出行时间不能为空");
            return false;
        }
        if(!/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(outDatetime)){
            base.showMsg("日期格式错误");
            return false;
        }
        config.outDatetime = outDatetime + ":00";
        return true;
    }
    // 计算拼车距离
    function calculateDistance() {
        var p1 = new BMap.Point(startSite.point.lng, startSite.point.lat);
        var p2 = new BMap.Point(endSite.point.lng, endSite.point.lat);
        var p3 = [];

        var transit = new BMap.DrivingRoute(map, {
            onSearchComplete: function(results){
                if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                    base.showMsg(transit.getStatus() || "距离计算失败");
                    unDisabledButton();
                    return;
                }
                var plan = results.getPlan(0);
                publish(plan.dg);
            }
        });
        transit.search(p1, p2, {
            waypoints: p3
        });
    }
    // 发布拼车
    function publish(distance) {
        config.distance = distance;
        trafficCtr.publishCarpool(config)
            .then((data) => {
                getCarpool(data.code, data.orderCode);
            }, (error) => {
                unDisabledButton();
            });
    }
    // 获取拼车信息
    function getCarpool(code, orderCode){
        trafficCtr.getCarpool(code)
            .then((data) => {
                base.confirm("拼车申请提交成功，总价为：" + base.formatMoney(data.distancePrice) + "元。<br/>点击确认前往支付定金")
                    .then(function () {
                        alert("进入支付页面（未实现）");
                        // location.href = "../pay/pay.html?code=" + orderCode + "&type=4";
                    }, function () {
                        location.reload(true);
                        unDisabledButton();
                    });
            }, (error) => {
                base.showMsg("拼车申请提交成功");
                setTimeout(() => location.reload(true), 1000);
                unDisabledButton();
            })
    }
    // disabled发布拼车按钮
    function disabledButton() {
        $("#submitBtn").val("发布中...").prop("disabled", true);
    }
    // undisabled发布拼车按钮
    function unDisabledButton() {
        $("#submitBtn").val("发布拼车").prop("disabled", false);
    }
});
