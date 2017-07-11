define([
    'app/controller/base',
    'app/interface/trafficCtr',
    'app/interface/menuCtr',
    'app/interface/mallCtr',
    'app/interface/tourismCtr',
    'app/interface/hotelCtr',
    'app/controller/user/order/MallCreator',
    'app/controller/user/order/SpecialLineCreator',
    'app/controller/user/order/BusCreator',
    'app/controller/user/order/CarpoolCreator',
    'app/controller/user/order/LineCreator',
    'app/controller/user/order/HotelCreator',
    'pagination'
], function(base, trafficCtr, menuCtr, mallCtr, tourismCtr, hotelCtr, MallCreator,
    SpecialLineCreator, BusCreator, CarpoolCreator, LineCreator, HotelCreator, pagination) {

    var config = {
            start: 1,
            limit: 10
        },
        statusList = {      // 每种订单状态对应的statusList
            0: [null, [0], [1], [2, 31, 94]],
            1: [null, [0], [1], [2, 31, 94]],
            2: [null, [0], [1], [2, 31, 94]],
            3: [null, [0], [1], [2, 31, 94]],
            4: [null, [0], [1], [2, 31, 94]],
            5: [null, [0, 2, 97], [3]]
        }, currentType,     // 当前选中的订单类型
        currentStatusIndex, // 当前选中的订单状态下标
        specialModule;          // 专线类型的数据字典
    var _loadingSpin = $("#loadingSpin"),
        pageActions = [ getPageMallOrders, getPageLineOrders, getPageHotelOrders,
            beforeGetSplOrders, getPageBusOrders, getPageCarpoolOrders ],   // currentType对应的获取数据的方法
        cancelActions = [ cancelMall, cancelLine, cancelHotel,
            cancelSpecialLine, cancelBus, cancelCarpool ],   // currentType对应的取消订单的方法
        refundActions = [ refundMall, refundLine, refundHotel,
            refundSpecialLine, refundBus ];     // currentType对应的退款的方法

    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(1).addClass("active");
        addListener();
        var searchs = JSON.parse(sessionStorage.getItem('listSearchs') || '{}')[location.pathname] || {};
        currentType = searchs.orderType || 0;
        currentStatusIndex = searchs.orderStatus || 0;
        $("#orderType").val(currentType);
        $("#orderStatus").val(currentStatusIndex);
        pageActions[currentType].call(null);
    }
    // 分页查询商品订单
    function getPageMallOrders(refresh) {
        _loadingSpin.removeClass("hidden");
        mallCtr.getPageMallOrders({
            statusList: statusList[currentType][currentStatusIndex],
            ...config
        }, refresh).then((data) => {
            _loadingSpin.addClass("hidden");
            config.start == 1 && initPagination(data);
            $("#orderList").html(MallCreator.buildMall(data));
        }, () => {
            _loadingSpin.addClass("hidden");
        })

    }
    // 分页查询线路订单
    function getPageLineOrders(refresh) {
        _loadingSpin.removeClass("hidden");
        tourismCtr.getPageTourismOrders({
            statusList: statusList[currentType][currentStatusIndex],
            ...config
        }, refresh).then((data) => {
            _loadingSpin.addClass("hidden");
            config.start == 1 && initPagination(data);
            $("#orderList").html(LineCreator.buildLine(data));
        }, () => {
            _loadingSpin.addClass("hidden");
        });
    }
    // 分页查询酒店订单
    function getPageHotelOrders(refresh) {
        _loadingSpin.removeClass("hidden");
        hotelCtr.getPageHotelOrders({
            statusList: statusList[currentType][currentStatusIndex],
            ...config
        }, refresh).then((data) => {
            _loadingSpin.addClass("hidden");
            config.start == 1 && initPagination(data);
            $("#orderList").html(HotelCreator.buildHotel(data));
        }, () => {
            _loadingSpin.addClass("hidden");
        });
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
    // 分页查询专线订单前判断是否已经获取专线的数据字典
    function beforeGetSplOrders(refresh) {
        _loadingSpin.removeClass("hidden");
        if(!specialModule){
            getSDict()
                .then(() => getPageSpecialLineOrders(refresh), () => {
                    _loadingSpin.addClass("hidden");
                });
        }else{
            getPageSpecialLineOrders(refresh);
        }
    }
    // 分页查询专线订单
    function getPageSpecialLineOrders(refresh) {
        trafficCtr.getPageSpecialLineOrders({
            statusList: statusList[currentType][currentStatusIndex],
            ...config
        }, refresh).then((data) => {
            _loadingSpin.addClass("hidden");
            config.start == 1 && initPagination(data);
            $("#orderList").html(SpecialLineCreator.buildSpecialLine(data, specialModule));
        }, () => {
            _loadingSpin.addClass("hidden");
        });
    }
    // 分页查询大巴订单
    function getPageBusOrders(refresh) {
        _loadingSpin.removeClass("hidden");
        trafficCtr.getPageBusOrders({
            statusList: statusList[currentType][currentStatusIndex],
            ...config
        }, refresh).then((data) => {
            _loadingSpin.addClass("hidden");
            config.start == 1 && initPagination(data);
            $("#orderList").html(BusCreator.buildBus(data));
        }, () => {
            _loadingSpin.addClass("hidden");
        });
    }
    // 拼车订单
    function getPageCarpoolOrders(refresh) {
        _loadingSpin.removeClass("hidden");
        trafficCtr.getPageCarpoolOrders({
            statusList: statusList[currentType][currentStatusIndex],
            ...config
        }, refresh).then((data) => {
            _loadingSpin.addClass("hidden");
            config.start == 1 && initPagination(data);
            $("#orderList").html(CarpoolCreator.buildCarpool(data));
        }, () => {
            _loadingSpin.addClass("hidden");
        });
    }
    // 取消商品订单
    function cancelMall(code, ele) {
        MallCreator.cancelOrder(code, () => {
            getPageMallOrders(true);
        }, ele);
    }
    // 取消线路订单
    function cancelLine(code, ele) {
        LineCreator.cancelOrder(code, () => {
            getPageLineOrders(true);
        }, ele);
    }
    // 取消酒店订单
    function cancelHotel(code, ele) {
        HotelCreator.cancelOrder(code, () => {
            getPageHotelOrders(true);
        }, ele);
    }
    // 取消专线订单
    function cancelSpecialLine(code, ele) {
        SpecialLineCreator.cancelOrder(code, () => {
            beforeGetSplOrders(true);
        }, ele);
    }
    // 取消大巴订单
    function cancelBus(code, ele) {
        BusCreator.cancelOrder(code, () => {
            getPageBusOrders(true);
        }, ele);
    }
    // 取消拼车订单
    function cancelCarpool(code, ele) {
        CarpoolCreator.cancelOrder(code, () => {
            getPageCarpoolOrders(true);
        }, ele);
    }
    // 商品订单退款
    function refundMall(code, remark, ele) {
        MallCreator.refund(code, () => {
            getPageMallOrders(true);
        }, remark, ele);
    }
    // 线路订单退款
    function refundLine(code, remark, ele) {
        LineCreator.refund(code, () => {
            getPageLineOrders(true);
        }, remark, ele);
    }
    // 酒店订单退款
    function refundHotel(code, remark, ele) {
        HotelCreator.refund(code, () => {
            getPageHotelOrders(true);
        }, remark, ele);
    }
    // 专线订单退款
    function refundSpecialLine(code, remark, ele) {
        SpecialLineCreator.refund(code, () => {
            beforeGetSplOrders(true);
        }, remark, ele);
    }
    // 大巴订单退款
    function refundBus(code, remark, ele) {
        BusCreator.refund(code, () => {
            getPageBusOrders(true);
        }, remark, ele);
    }
    // 初始化分页器
    function initPagination(data){
        if(data.totalCount == 0){
            $("#pagination").addClass("hidden");
            return;
        }

    	$("#pagination .pagination").show();
        $("#pagination").removeClass("hidden")
            .find(".pagination").pagination({
                pageCount: data.totalPage,
                showData: config.limit,
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
                    if(_this.getCurrent() != config.start){
                        config.start = _this.getCurrent();
                        pageActions[currentType].call(null);
                    }
                }
            });
    }

    function addListener() {
        var _orderStatus = $("#orderStatus");
        // 订单类型选择
        $("#orderType").on("change", function(){
            currentType = this.value;
            if(currentType == "5"){
                _orderStatus.find("option[value=3]").hide()
                    .end().val(0);
            }else{
                _orderStatus.find("option[value=3]").show();
            }
        });
        // 订单状态选择
        $("#orderStatus").on("change", function(){
            currentStatusIndex = this.value;
        });
        // 搜索按钮
        $("#searchBtn").click(function(){
            config.start = 1;
            pageActions[currentType].call(null);
            updateListSearch();
        });
        // 取消订单
        $("#orderList").on("click", ".cancel-order-btn", function(e){
            e.stopPropagation();
            e.preventDefault();
            var _this = $(this),
                code = _this.closest("[data-code]").attr("data-code");
            cancelActions[currentType].call(null, code, _this);
        });
        var _errorSpan = $("#error-span"),
            _confirmBtn = $("#ant-modal-confirm"),
            _refundArea = $("#refundArea"),
            _modal = $("#modal");
        // 退款
        $("#orderList").on("click", ".refund-order-btn", function(e){
            e.stopPropagation();
            e.preventDefault();
            var code = $(this).closest("[data-code]").attr("data-code");
            _modal.removeClass("hidden").data("code", code);
        });
        // 支付
        $("#orderList").on("click", ".pay-order-btn", function(e){
            e.stopPropagation();
            e.preventDefault();
            var _parent = $(this).closest("[data-code]"),
                code = _parent.attr("data-code"),
                type = _parent.attr("data-type");
            location.href = "../pay/pay.html?code=" + code + "&type=" + type;
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
        $(".ant-modal-close-x").click(function(){
            _modal.addClass("hidden");
            _errorSpan.empty();
            _refundArea.val("").removeClass("area-error");
            _confirmBtn.prop("disabled", true).find("span").text("确认");
        });
        // 关闭modal的按钮
        $("#ant-modal-close").click(function(){
            _modal.addClass("hidden");
            _errorSpan.empty();
            _refundArea.val("").removeClass("area-error");
            _confirmBtn.prop("disabled", true).find("span").text("确认");
        });
        // modal的确认按钮
        _confirmBtn.click(function(){
            if(!_refundArea.hasClass("area-error")){
                refundActions[currentType].call(null, _modal.data("code"), _refundArea.val(), _confirmBtn);
            }
        });
    }

    function updateListSearch() {
    	var searchs = JSON.parse(sessionStorage.getItem('listSearchs') || '{}');
    	var pathName = location.pathname;
        var params = {
            "orderType": $("#orderType").val(),
            "orderStatus": $("#orderStatus").val()
        };
    	searchs[pathName] = params;
    	sessionStorage.setItem('listSearchs', JSON.stringify(searchs));
    }
});
