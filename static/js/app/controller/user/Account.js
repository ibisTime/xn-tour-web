define([
    'app/controller/base',
    'app/interface/generalCtr',
    'app/interface/userCtr',
    'pagination'
], function(base, generalCtr, userCtr, pagination) {
    var config = {
        currency: "CNY",
        start: 1,
        limit: 15,
        status: "effect_all"
    },
    _loadingSpin = $("#loadingSpin");
    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(5).addClass("active");
        getPageCapitalFlow();
        userCtr.getUserAccount("CNY")
            .then((data) => {
                $.each(data, function(i, item){
                    if(item.currency == "CNY") {
                        $("#enabledAmount").html(base.formatMoney(item.amount));
                    }
                });
            });
    }
    // 分页查询资金流水
    function getPageCapitalFlow() {
        _loadingSpin.removeClass("hidden");
        generalCtr.getPageCapitalFlow(config)
            .then((data) => {
                _loadingSpin.addClass("hidden");
                var html = "";
                config.start == 1 && initPagination(data);
                if(data.list.length){
                    $.each(data.list, function(i, item) {
                        html += `<li>
    		    				<p>${item.bizNote}${
                                    item.transAmount >= 0
                                        ? `<i class="add">+${base.formatMoney(item.transAmount)}</i>`
                                        : `<i class="sub">${base.formatMoney(item.transAmount)}</i>`
                                }</p>
    		    				<samp>${base.formatDate(item.createDatetime, "yyyy-MM-dd hh:mm:ss")}</samp>
    		    			</li>`;
                    });
                }else{
                    html = "<li class='tc wp100'>暂无余额流水</li>";
                }
                $("#integralList").html(html);
            }, () => {
                _loadingSpin.addClass("hidden");
            });
    }
    // 初始化分页器
    function initPagination(data){
        $("#pagination").find(".pagination")
            .pagination({
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
                        getPageCapitalFlow();
                    }
                }
            });
    }
});
