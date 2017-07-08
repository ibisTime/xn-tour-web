define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/util/dict'
], function(base, trafficCtr, Dict) {

    var carpoolOrderStatus = Dict.get("carpoolOrderStatus"),
        code = base.getUrlParam("code"),
        map, startSite, endSite, currentSite;

    init();

    // 初始化页面
    function init() {
        getCarpoolOrder();
    }
    // 获取拼车订单信息
    function getCarpoolOrder(refresh){
        trafficCtr.getCarpoolOrder(code, refresh)
            .then((data) => {
                $("#content").html(buildHtml(data));
                startSite = {
                    name: data.carpool.startSite,
                    type: "start"
                };
                endSite = {
                    name: data.carpool.endSite,
                    type: "end"
                };
                addListener();
            }, () => {})
    }
    function buildHtml(item){
        return `<li>
                    <a href="../go/carpool-detail.html?code=${item.carpoolCode}" class="wp100">
                        <div class="top wp100 over-hide ptb10">
                            <div class="fl">订单编号：${item.code}</div>
                            <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                        </div>
                        <div class="con wp100">
                            <div class="txt fl ml0i">
                                <p>上车地点：<label class="cur-pointer start-site td-under">${item.carpool.startSite}</label></p>
                                <p>下车地点：<label class="cur-pointer end-site td-under">${item.carpool.endSite}</label></p>
                                <span>发车时间：${base.formatDate(item.carpool.outDatetime, 'yyyy-MM-dd hh:mm')}</span>
                                <samp>拼车人数：${item.carpool.totalNum}人</samp>
                                <samp>定金：¥${base.formatMoney(item.firstAmount)}</samp>
                                <samp>尾款：¥${base.formatMoney(item.secondAmount)}</samp>
                            </div>
                            <div class="status status0">${carpoolOrderStatus[item.status]}</div>
                            ${
                                item.status == "0" || item.status == "2" || item.status == "97"
                                    ? `<div class="btn-wrap">
                                        <input type="button" value="取消订单" class="btn1 cancel-order-btn"/>
                                        <input type="button" value="${
                                            item.status == "0" || item.status == "97"
                                                ? '支付定金' : '支付尾款'
                                        }" class="btn2 pay-order-btn"/>
                                    </div>`
                                    : ""
                            }
                        </div>
                    </a>
                </li>`;
    }

    function addListener() {
        // 下车地点
        $("#content").on("click", ".end-site", function(e){
            e.stopPropagation();
            e.preventDefault();
            currentSite = endSite;
            showPoint();
            $("#modal").removeClass("hidden");
        })
        // 上车地点
        .on("click", ".start-site", function(e){
            e.stopPropagation();
            e.preventDefault();
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
        // 取消订单
        $(".cancel-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            cancelOrder();
        });
        // 立即支付
        $(".pay-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            location.href = "../pay/pay.html?code=" + code + "&type=4";
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
    function cancelOrder() {
        var ele = $(".cancel-order-btn");
        base.confirm("确定取消订单吗？")
            .then(() => {
                ele.prop("disabled", true).val("取消中...");
                trafficCtr.cancelCarpoolOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        getCarpoolOrder(true);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
});
