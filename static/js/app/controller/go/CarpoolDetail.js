define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/interface/userCtr',
    'app/util/dict'
], function(base, trafficCtr, userCtr, Dict) {

    var map, carpoolStatus = Dict.get("carpoolStatus"),
        code = base.getUrlParam("code"),
        startSite, endSite, currentSite,nextPrice;

    init();

    // 初始化页面
    function init() {
        $("#nav li").eq(3).addClass("active");
        getCarpool();
    }

    function addListener() {
        // 下车地点
        $("#endSite").click(function(){
            currentSite = endSite;
            showPoint();
            $("#modal").removeClass("hidden");
        });
        // 上车地点
        $("#startSite").click(function(){
            currentSite = startSite;
            $("#modal").removeClass("hidden");
            showPoint();
        });
        /*modal start*/
        // 关闭modal的图标
        $(".ant-modal-close-x").click(function(){
            $(this).closest(".ant-modal-wraper").addClass("hidden");
        });
        // modal的确认按钮
        $("#ant-modal-confirm").click(function(){
            $("#modal").addClass("hidden");
        });
        // 初始化地图
        initMap();
        /*modal end*/
        // 参与拼车click
        $("#submitBtn").click(function(){
            if(!base.isLogin()){
                base.goLogin();
            }else{
                disabledButton();
                userCtr.getUserInfo()
                    .then(function (data) {
                        var isIdentity = !!data.realName;
                        if(!isIdentity){
                            unDisabledButton();
                            base.confirm("您还未实名认证，点击确认前往实名认证")
                                .then(function () {
                                    location.href = "../user/identity.html"
                                }, base.emptyFun);
                            return;
                        }
                        joinCarpool();
                    }, unDisabledButton);
            }
        });
    }
    var _loading = $("#loadingSpin"),
        _modalTitle = $("#modal").find(".ant-modal-title");
    // 点击 上下车地点的div初始化modal的map
    function showPoint(){
        if(currentSite.type == "start"){
            _modalTitle.text("上车地点");
        }else{
            _modalTitle.text("下车地点");
        }
        if(currentSite.point){
            setTimeout(function(){
                map.clearOverlays(); //清除地图上所有覆盖物
                var point = new BMap.Point(currentSite.point.lng, currentSite.point.lat);
                map.centerAndZoom(point, 18);
                map.addOverlay(new BMap.Marker(point));
            }, 100);
        }else{
            _loading.removeClass("hidden");
            setPlace(currentSite.name);
        }
    }
    // 初始化modal里的map
    function initMap(){
        map = new BMap.Map("J_SearchMapCont");
        map.enableScrollWheelZoom(true);
    }
    // 根据关键字查询point，并设置到地图中
    function setPlace(name) {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            currentSite.point = {
                lng: pp.lng,
                lat: pp.lat
            };
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp)); //添加标注
            _loading.addClass("hidden");
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(name);
    }
    // 参与拼车
    function joinCarpool() {
        trafficCtr.joinCarpool(code)
            .then((data) => {
                base.confirm("申请提交成功，点击确认前往支付")
                    .then(function () {
//                         location.href = "../pay/pay.html?code=" + orderCode + "&p="+data.distancePrice;
                    }, function () {
                        location.href = "./carpool.html";
                    })
            }, (error) => {
                unDisabledButton();
            });
    }
    // 获取拼车信息
    function getCarpool(){
        trafficCtr.getCarpool(code)
            .then((data) => {
                addListener();
                nextPrice = data.nextPrice
                $("#startSite").text(data.startSite);
                $("#endSite").text(data.endSite);
                $("#takePartNum").val(data.takePartNum);
                $("#totalNum").val(data.totalNum);
                $("#outDatetime").val(base.formatDate(data.outDatetime, "yyyy-MM-dd hh:mm:ss"));
                $("#nextPrice").text("￥" + base.formatMoney(data.nextPrice));
                startSite = {
                    name: data.startSite,
                    type: "start"
                };
                endSite = {
                    name: data.endSite,
                    type: "end"
                };
            }, () => {})
    }
    // disabled发布拼车按钮
    function disabledButton() {
        $("#submitBtn").val("提交中...").prop("disabled", true);
    }
    // undisabled发布拼车按钮
    function unDisabledButton() {
        $("#submitBtn").val("参与拼车").prop("disabled", false);
    }
});
