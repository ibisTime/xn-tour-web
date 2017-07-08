define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/util/dict'
], function(base, trafficCtr, Dict) {

    var busOrderStatus = Dict.get("busOrderStatus"),
        code = base.getUrlParam("code"),
        map, startSite, endSite, midSite, currentSite;

    init();

    // 初始化页面
    function init() {
        getBusOrderDetail();
    }
    // 获取大巴订单信息
    function getBusOrderDetail(refresh){
        trafficCtr.getBusOrderDetail(code, refresh)
            .then((data) => {
                $("#content").html(buildHtml(data));
                startSite = {
                    name: data.startSite,
                    type: "start"
                };
                endSite = {
                    name: data.endSite,
                    type: "end"
                };
                midSite = {
                    name: data.midSite,
                    type: "mid"
                }
                addListener();
            }, () => {})
    }
    function buildHtml(item){
        return `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">订单编号：${item.code}</div>
                        <div class="fr">${base.formatDate(item.bookDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                    </div>
                    <div class="con wp100">
                        <div class="txt fl ml0i">
                            <p>上车地点：<label class="cur-pointer start-site td-under">${item.startSite}</label></p>
                            <p>下车地点：<label class="cur-pointer end-site td-under">${item.endSite}</label></p>
                            <p>途经站点：<label class="cur-pointer mid-site td-under">${item.midSite}</label></p>
                            <span>发车时间：${base.formatDate(item.outDatetime, 'yyyy-MM-dd hh:mm')}</span>
                            <samp>人数：${item.totalNum}人</samp>
                            <samp>金额：¥${base.formatMoney(item.distancePrice)}</samp>
                        </div>
                        <div class="status status0">${busOrderStatus[item.status]}</div>
                        ${
                            item.status == "0" || item.status == "1"
                                ? `<div class="btn-wrap">
                                    ${
                                        item.status == "0"
                                            ? `<input type="button" value="取消订单" class="btn1 cancel-order-btn"/>
                                            <input type="button" value="去付款" class="btn2 pay-order-btn"/>`
                                            : `<input type="button" value="退款" class="btn1 refund-order-btn"/>`
                                    }
                                </div>`
                                : ""
                        }
                    </div>
                </li>`;
    }

    function addListener() {
        var _mapModal = $("#map-modal");
        // 下车地点
        $("#content").on("click", ".end-site", function(){
            currentSite = endSite;
            showPoint();
            _mapModal.removeClass("hidden");
        })
        // 上车地点
        .on("click", ".start-site", function(){
            currentSite = startSite;
            _mapModal.removeClass("hidden");
            showPoint();
        })
        // 途经站点
        .on("click", ".mid-site", function(){
            currentSite = midSite;
            showPoint();
            _mapModal.removeClass("hidden");
        });;
        /*modal start*/
        // 关闭modal的图标
        _mapModal.find(".ant-modal-close-x").click(function(){
            _mapModal.addClass("hidden");
        });
        // modal的确认按钮
        _mapModal.find(".ant-modal-confirm-btn").click(function(){
            _mapModal.addClass("hidden");
        });
        // 初始化地图
        initMap();
        /*modal end*/
        // 取消订单
        $(".cancel-order-btn").click(function(){
            cancelOrder();
        });
        // 立即支付
        $(".pay-order-btn").click(function(){
            location.href = "../pay/pay.html?code=" + code + "&type=3";
        });
        var _errorSpan = $("#error-span"),
            _confirmBtn = $("#ant-modal-confirm"),
            _refundArea = $("#refundArea"),
            _refundModal = $("#refund-modal");
        // 退款
        $(".refund-order-btn").click(function(){
            _refundModal.removeClass("hidden");
        });
        // 退款说明
        _refundArea.on("keyup", function(){
            var _this = $(this),
                value = _this.val();
            if(value == undefined || value.trim() === "") {
                _this.addClass("area-error");
                _errorSpan.text("退款理由不能为空");
                _confirmBtn.prop("disabled", true);
            }else if(!base.isNotFace(value)) {
                _this.addClass("area-error");
                _errorSpan.text("退款理由不能包含特殊字符");
                _confirmBtn.prop("disabled", true);
            }else{
                _this.removeClass("area-error");
                _confirmBtn.prop("disabled", false);
                _errorSpan.empty();
            }
        });
        // 关闭modal的图标
        _refundModal.find(".ant-modal-close-x").click(function(){
            _refundModal.addClass("hidden");
            _errorSpan.empty();
            _refundArea.val("").removeClass("area-error");
            _confirmBtn.prop("disabled", true).find("span").text("确认");
        });
        // 关闭modal的按钮
        _refundModal.find(".ant-modal-close-x").click(function(){
            _refundModal.addClass("hidden");
            _errorSpan.empty();
            _refundArea.val("").removeClass("area-error");
            _confirmBtn.prop("disabled", true).find("span").text("确认");
        });
        // modal的确认按钮
        _confirmBtn.click(function(){
            if(!_refundArea.hasClass("area-error")){
                refundOrder(_refundArea.val(), _confirmBtn);
            }
        });
    }
    var _loading = $("#loadingSpin"),
        _modalTitle = $("#map-modal").find(".ant-modal-title");
    // 点击 上下车地点的div初始化modal的map
    function showPoint(){
        if(currentSite.type == "start"){
            _modalTitle.text("上车地点");
        }else if(currentSite.type == "mid") {
            _modalTitle.text("途经站点");
        } else{
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
    // 取消订单
    function cancelOrder() {
        var ele = $(".cancel-order-btn");
        base.confirm("确定取消订单吗？")
            .then(() => {
                ele.prop("disabled", true).val("取消中...");
                trafficCtr.cancelBusOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        getBusOrderDetail(true);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
    // 退款
    function refundOrder(remark, ele) {
        ele.prop("disabled", true).find("span").text("退款中...");
        trafficCtr.refundBusOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                getBusOrderDetail(true);
                $("#refund-modal").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }
});
