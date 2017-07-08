define([
    'app/controller/base',
    'app/interface/collectionCtr',
    'pagination'
], function(base, collectionCtr, pagination) {
    var config = {
        start: 1,
        limit: 10
    },
    _loadingSpin = $("#loadingSpin"),
    action = [getPageLineCollection, getPageHotelCollection, getPageGLCollection, getPageFoodCollection],
    currentType = 0;

    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(2).addClass("active");
        getPageLineCollection();
        addListener();
    }
    // 分页查询收藏的线路
    function getPageLineCollection(refresh) {
        _loadingSpin.removeClass("hidden");
        collectionCtr.getPageLineCollection(config, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                var html = "";
                config.start == 1 && initPagination(data);
                if(data.list.length){
                    $.each(data.list, function(i, item) {
                        html += `<li>
                            <a href="../travel/tourism-detail.html?code=${item.line.code}">
                                <div class="img"><img src="${base.getPic(item.line.pathPic)}"/></div>
                                <div class="title plr10 t-3dot">${item.line.name}</div>
                                <div class="con plr10"><img class="fl" src="/static/images/时间.png"><p class="fl">${base.formatDate(item.line.outDateStart, "yyyy-MM-dd")}~${base.formatDate(item.line.outDateEnd, "yyyy-MM-dd")}</p></div>
                                <div class="price plr10"><p><i>￥${base.formatMoney(item.line.price)}</i>起</p></div>
                            </a>
                            <div class="btn-collection" data-code="${item.line.code}" data-type="1">
                                <img class="fl" src="/static/images/收藏.png" />
                                <p class="fl">取消收藏</p>
                            </div>
                        </li>`;
                    });
                }else{
                    html = "<li class='tc wp100'>暂无收藏的线路</li>"
                }
                $("#content").html(html);
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 分页查询收藏的攻略
    function getPageGLCollection(refresh) {
        _loadingSpin.removeClass("hidden");
        collectionCtr.getPageGLCollection(config, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                var html = "";
                config.start == 1 && initPagination(data);
                if(data.list.length){
                    $.each(data.list, function(i, item) {
                        html += `<li>
                            <a href="../tourism-note-gl.html?code=${item.guide.code}">
                                <div class="img"><img src="${base.getPic(item.guide.pic)}"/></div>
                                <div class="title plr10 t-3dot">${item.guide.title}</div>
                                <div class="con plr10"><img class="fl" src="/static/images/时间.png"><p class="fl">${base.formatDate(item.guide.updateDatetime, "yyyy-MM-dd")}</p></div>
                                <div class="fr">
                                    <img class="fl star" src="/static/images/点赞-小.png"><p class="fl">${item.guide.collectionTimes}</p>
                                </div>
                            </a>
                            <div class="btn-collection" data-code="${item.guide.code}" data-type="2">
                                <img class="fl" src="/static/images/收藏.png" />
                                <p class="fl">取消收藏</p>
                            </div>
                        </li>`;
                    });
                }else{
                    html = "<li class='tc wp100'>暂无收藏的攻略</li>"
                }
                $("#content").html(html);
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 分页查询收藏的酒店
    function getPageHotelCollection(refresh) {
        _loadingSpin.removeClass("hidden");
        collectionCtr.getPageHotelCollection(config, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                var html = "";
                config.start == 1 && initPagination(data);
                if(data.list.length){
                    $.each(data.list, function(i, item) {
                        html += `<li>
                            <a href="../hotel/hotel-detail.html?code=${item.hotal.code}">
                                <div class="img"><img src="${base.getPic(item.hotal.pic1)}"/></div>
                                <div class="title plr10 t-3dot">${item.hotal.name}</div>
                                <div class="con plr10"><img class="fl" src="/static/images/地址.png"><p class="fl">${getAddress(item.hotal)}</p></div>
                                <div class="con plr10"><img class="fl" src="/static/images/电话.png"><p class="fl">${item.hotal.telephone}</p></div>
                                <div class="price plr10"><p><i>￥${base.formatMoney(item.hotal.lowPrice)}</i>起</p></div>
                            </a>
                            <div class="btn-collection" data-code="${item.hotal.code}" data-type="3">
                                <img class="fl" src="/static/images/收藏.png"/>
                                <p class="fl">取消收藏</p>
                            </div>
                        </li>`;
                    });
                }else{
                    html = "<li class='tc wp100'>暂无收藏的酒店</li>"
                }
                $("#content").html(html);
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 分页查询收藏的美食
    function getPageFoodCollection(refresh) {
        _loadingSpin.removeClass("hidden");
        collectionCtr.getPageFoodCollection(config, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                var html = "";
                config.start == 1 && initPagination(data);
                if(data.list.length){
                    $.each(data.list, function(i, item) {
                        html += `<li>
                            <a href="#">
                                <div class="img"><img src="${base.getPic(item.food.pic)}"/></div>
                                <div class="title plr10 t-3dot">${item.food.name}</div>
                                <div class="con plr10"><img class="fl" src="/static/images/地址.png"><p class="fl">${getAddress(item.food)}</p></div>
                                <div class="price plr10"><p><i>￥${base.formatMoney(item.food.price)}</i></p></div>
                            </a>
                            <div class="btn-collection" data-code="${item.food.code}" data-type="4">
                                <img class="fl" src="/static/images/收藏.png" />
                                <p class="fl">取消收藏</p>
                            </div>
                        </li>`;
                    });
                }else{
                    html = "<li class='tc wp100'>暂无收藏的美食</li>"
                }
                $("#content").html(html);
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 初始化分页器
    function initPagination(data){
        if(data.totalCount == 0){
            $("#pagination").addClass("hidden");
            return;
        }
        $("#pagination").removeClass("hidden")
            .find(".pagination").show().pagination({
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
                        _loadingSpin.removeClass("hidden");
                        config.start = _this.getCurrent();
                        action[currentType].call(null);
                    }
                }
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
    function addListener() {
        $(".collectionSearch").on("click", "li", function(){
            var _this = $(this);
            if(!_this.hasClass("active")){
                currentType = _this.index();
                _this.addClass("active").siblings(".active").removeClass("active");
                _loadingSpin.removeClass("hidden");
                config.start = 1;
                action[currentType].call(null);
            }
        });
        $("#content").on("click", ".btn-collection", function(){
            _loadingSpin.removeClass("hidden");
            var _this = $(this),
                code = _this.attr("data-code"),
                toType = _this.attr("data-type");
            collectionCtr.deleteFromCollection(code, toType)
                .then(() => {
                    base.showMsg("取消成功");
                    action[currentType].call(null, true);
                }, () => {
                    _loadingSpin.addClass("hidden");
                })
        });
    }
});
