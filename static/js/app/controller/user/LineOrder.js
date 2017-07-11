define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/interface/hotelCtr',
    'app/interface/tourismCtr',
    'app/interface/menuCtr',
    'app/util/dict'
], function(base, trafficCtr, hotelCtr, tourismCtr, menuCtr, Dict) {

    var lineOrderStatus = Dict.get("lineOrderStatus"),
        code = base.getUrlParam("code"),
        specialModule,
        map, currentSite;

    init();

    // 初始化页面
    function init() {
        getTourismOrder();
    }
    // 获取线路订单信息
    function getTourismOrder(refresh){
        tourismCtr.getTourismOrder(code, refresh)
            .then((data) => {
                $("#content").html(buildLineHtml(data));
                if(data.specialLineOrder){
                    getSpecialLineInfo(data.specialLineOrder);
                }
                if(data.hotalOrder){
                    getHotelInfo(data.hotalOrder);
                }
                addListener();
            }, () => {})
    }
    // 生成线路html
    function buildLineHtml(item){
        return `<li>
                    <a class="wp100" href="../travel/tourism-detail.html?code=${item.lineCode}">
                        <div class="top wp100 over-hide ptb10">
                            <div class="fl">订单编号：${item.code}</div>
                            <div class="fr">${base.formatDate(item.applyDatetime, "yyyy-MM-dd hh:mm:ss")}</div>
                        </div>
                        <div class="con wp100">
                            <div class="img fl"><img src="${base.getPic(item.line.pathPic)}"/></div>
                            <div class="txt fl">
                                <p>${item.line.name}</p>
                                <p>${item.line.joinPlace} 出发</p>
                                <p>${base.formatDate(item.outDate, "yyyy-MM-dd hh:mm")}</p>
                                <p>¥${base.formatMoney(item.amount)}</p>
                            </div>
                            <div class="status ${item.status == '0' ? 'status0' : ''}">${lineOrderStatus[item.status]}</div>
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
                    </a>
                </li>`;
    }
    //专线数据字典
    function getSDict() {
        return menuCtr.getModules("goout")
            .then(function(data) {
                specialModule = {};
                $.each(data, function(i, d) {
                    specialModule[d.code] = d.name;
                });
            }, function() {});
    }
    // 获取专线的信息
    function getSpecialLineInfo(order) {
        $.when(
            getSpecialLine(specialLineCode),
            getSDict()
        ).then((data) => {
            $("#content").append(buildSplHtml(data, order));
        });
    }
    // 详情查询专线
    function getSpecialLine(specialLineCode) {
        return trafficCtr.getSpecialLine(specialLineCode);
    }
    // 生成专线html
    function buildSplHtml(item, order) {
        return `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">出行信息</div>
                    </div>
                    <div class="con wp100">
                        <div class="img fl"><img src="${base.getPic(item.pic)}"/></div>
                        <div class="txt fl">
                            <p>${specialModule[item.type]}</p>
                            <p>上车地点：${item.address}</p>
                            <span>发车时间：${base.formatDate(item.outDatetime, 'yyyy-MM-dd hh:mm')}</span>
                            <samp>票数：${order.quantity}张</samp>
                            <samp>¥${base.formatMoney(order.amount)}</samp>
                        </div>
                    </div>
                </li>`;
    }
    // 获取酒店的信息
    function getHotelInfo(order) {
        $.when(
            hotelCtr.getHotelDetail(order.hotelCode),
            hotelCtr.getRoomDetail(order.roomCode)
        ).then(function (hotelData, roomData) {
            currentSite = {
                name: getAddress(hotelData.hotal)
            };
            $("#content").append(buildHotelHtml(hotelData, roomData, order));
        });
    }
    // 生成酒店html
    function buildHotelHtml(hotelData, roomData, order){
        return `<li>
                    <div class="top wp100 over-hide ptb10">
                        <div class="fl">酒店信息</div>
                    </div>
                    <div class="con wp100">
                        <div class="img fl"><img src="${base.getPic(roomData.picture)}"/></div>
                        <div class="txt fl">
                            <p>${order.name}</p>
                            <p>${roomData.name}</p>
                            <p>
                                ${base.formatDate(order.startDate, "MM月dd号")} - ${base.formatDate(order.endDate, 'MM月dd号')}
                                <span class="pl4">${base.calculateDays(order.startDate, order.endDate) + '晚' + order.quantity + '间'}</span>
                            </p>
                            <p>酒店地址：<label class="cur-pointer address-hotel td-under">${getAddress(hotelData.hotal)}</label></p>
                            <p>¥${base.formatMoney(order.amount)}</p>
                        </div>
                    </div>
                </li>`;
    }
    function addListener() {
        var _mapModal = $("#map-modal");
        // 酒店地址
        $("#content").on("click", ".address-hotel", function(){
            showPoint();
            _mapModal.removeClass("hidden");
        });
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
        $(".cancel-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            cancelOrder();
        });
        // 立即支付
        $(".pay-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
            location.href = "../pay/pay.html?code=" + code + "&type=1";
        });
        var _errorSpan = $("#error-span"),
            _confirmBtn = $("#ant-modal-confirm"),
            _refundArea = $("#refundArea"),
            _refundModal = $("#refund-modal");
        // 退款
        $(".refund-order-btn").click(function(e){
            e.stopPropagation();
            e.preventDefault();
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
        _refundModal.find("#ant-modal-close").click(function(){
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
    var _loading = $("#loadingSpin");
    // 点击 上下车地点的div初始化modal的map
    function showPoint(){
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
                tourismCtr.cancelTourismOrder([code])
                    .then(() => {
                        base.showMsg("取消成功");
                        getTourismOrder(true);
                    }, () => {
                        ele.prop("disabled", false).val("取消订单");
                    });
            }, () => {});
    }
    // 退款
    function refundOrder(remark, ele) {
        ele.prop("disabled", true).find("span").text("退款中...");
        tourismCtr.refundTourismOrder(code, remark)
            .then(() => {
                base.showMsg("退款成功");
                getTourismOrder(true);
                $("#refund-modal").addClass("hidden");
            }, () => {
                ele.prop("disabled", false).find("span").text("确认");
            });
    }
    // 获取地址信息
    function getAddress(data) {
        var province = data.province,
            city = data.city,
            area = data.area,
            address = data.detail;
        if(province == city){
            province = "";
        }
        return province + city + area + " " + address;
    }
});
