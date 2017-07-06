define([
    'app/controller/base',
    'app/interface/tourismCtr',
    'app/util/dict',
    'pagination'
], function(base, tourismCtr, Dict, pagination) {
    var config = {
        start: 1,
        limit: 10,
        userId: base.getUserId(),
        status: ""
    }, travelNoteStatus = Dict.get("travelNoteStatus");
    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(3).addClass("active");
        getPageYJ();
        addListener();
    }
    var _loadingSpin = $("#loadingSpin");
    // 分页查询游记
    function getPageYJ(refresh) {
        tourismCtr.getPageYJ(config, refresh)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                config.start == 1 && initPagination(data);
                var html = '';
                if(data.list.length){
                    $.each(data.list, function(i, d){
                        html += buildHtml(d);
                    });
                } else {
                    html = '<li class="tc">暂无数据</li>';
                }
                $("#content").html(html);
            }, () => {
                _loadingSpin.addClass("hidden");
            })
    }
    // 生成table到html
    function buildHtml(data){
        return `<li data-code="${data.code}">
                    <div class="con wp100">
                        <div class="img fl"><a href="#"><img src="${base.getPic(data.pic)}"/></a></div>
                        <div class="txt fl">
                            <p>${data.name}</p>
                            <div class="description">${
                                data.description.length > 170
                                    ? data.description.substr(0, 170) + "..."
                                    : data.description
                            }</div>
                            <span>${base.formatDate(data.publishDatetime, "yyyy-MM-dd hh:mm:ss")}</span>
                        </div>
                        <div class="status status0">${travelNoteStatus[data.status]}</div>
                        <div class="btn-wrap">
                            <input type="button" value="" class="btn-delete" />
                        </div>
                    </div>
                </li>`;
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
                    getPageYJ();
                }
            }
        });
    }

    function addListener() {
        $("#content").on("click", ".btn-delete", function(){
            base.confirm("确定删除游记吗?")
                .then(() => {
                    var _this = $(this)
                    deleteNote(_this.closest("li[data-code]").attr("data-code"), _this);
                }, () => {});
        });
    }
    // 删除游记
    function deleteNote(code, ele) {
        ele.prop("disabled", true);
        _loadingSpin.removeClass("hidden");
        tourismCtr.deleteYJ(code)
            .then((data) => {
                base.showMsg("删除成功");
                setTimeout(function () {
                    getPageYJ(true);
                }, 100);
            }, () => {
                ele.prop("disabled", false);
                _loadingSpin.addClass("hidden");
            });
    }
});
