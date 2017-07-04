define([
    'app/controller/base',
    'app/interface/menuCtr',
    'app/interface/generalCtr',
    'app/interface/trafficCtr',
    'pagination'
], function(base, menuCtr, generalCtr, trafficCtr, pagination) {
    var type = base.getUrlParam("category") || 38,
        config = {
            start: 1,
            limit: 10,
            startSite: '',
            endSite: '',
            dateStart: laydate.now(),
            type
        },
        startSelectArr, endSelectArr;

    init();

    // 初始化页面
    function init() {
        $("#nav li").eq(3).addClass("active");
        getModules();
        getStations();
        addListener();
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
                    html += `<li class="${d.code == type ? "active" : ''}">
                        <a class="wp100 show" href="${url}">
                            <img src="${base.getPic(d.pic)}"/>
                            <p>${d.name}</p>
                        </a>
                    </li>`;
                    if(d.code == type){
                        document.title = "交通出行-" + d.name;
                    }
                });
                $("#navUl").html(html);
            });
    }

    // 获取出发和结束站点
    function getStations(){
        $.when(
            getZeroType(),
            getDestinationType()
        ).then(getPageTravelSpecialLine, () => {});
    }
    // 查询出发地
    function getZeroType() {
        return generalCtr.getDictList("zero_type")
            .then((data) => {
                startSelectArr = data;
                $("#startSite").append(createOptions(startSelectArr));
            });
    }
    // 查询目的地
    function getDestinationType() {
        return generalCtr.getDictList("destination_type")
            .then((data) => {
                endSelectArr = data;
                $("#endSite").append(createOptions(endSelectArr));
            });
    }
    // 生成下拉框
    function createOptions(arr){
        var html = "";
        $.each(arr, function(i, a){
            html += `<option value="${a.dkey}">${a.dvalue}</option>`;
        });
        return html;
    }
    var _loadingSpin = $("#loadingSpin");
    // 分页获取旅游专线
    function getPageTravelSpecialLine(refresh){
        return trafficCtr.getPageTravelSpecialLine(config, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                config.start == 1 && initPagination(data);
                var html = '';
                if(data.list.length){
                    $.each(data.list, function(i, d){
                        html += buildHtml(d);
                    });
                } else {
                    html = '<tr><td colspan="6">暂无数据</td></tr>';
                }
                $("#body").html(html);
                config.start++;
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 生成table到html
    function buildHtml(data){
        return `<tr data-code="${data.code}">
                    <td class="time">${base.formatDate(data.outDatetime, "hh:mm")}</td>
                    <td class="beginEnd">
                        <div><p><samp class="begin">起</samp>${base.findObj(startSelectArr, "dkey", data.startSite)["dvalue"]}</p></div>
                        <div class="mt10"><p><samp class="end">达</samp>${base.findObj(endSelectArr, "dkey", data.endSite)["dvalue"]}</p></div>
                    </td>
                    <td class="trainNum">${data.name}</td>
                    <td class="price">￥${base.formatMoney(data.price)}</td>
                    <td class="remainNum">${data.remainNum}张</td>
                    <td class="purchase">
                        <div class="number">
                            <div class="icon icon-sub"></div>
                            <div class="num">1</div>
                            <div class="icon icon-add"></div>
                        </div>
                        <div class="btn-wrap">
                            <input class="btn-booking" type="button" value="立即预订" />
                        </div>
                    </td>
                </tr>`;
    }
    // 初始化分页器
    function initPagination(data){
        $("#pagination .pagination").pagination({
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
                    getPageTravelSpecialLine();
                }
            }
        });
    }
    function addListener() {
        setTimeout(() => {
            laydate({
                elem: '#choseDate',
                min: laydate.now()
            });
            $("#choseDate").val(laydate.now());
        }, 1);

        $("#searchBtn").click(function(){
            config = {
                start: 1,
                limit: 10,
                startSite: $("#startSite").val(),
                endSite: $("#endSite").val(),
                dateStart: $("#choseDate").val(),
                type
            };
            getPageTravelSpecialLine();
        })
    }
});
