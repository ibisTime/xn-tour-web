define([
    'app/controller/base',
    'app/module/qiniu',
    'app/module/validate/validate',
    'app/interface/tourismCtr'
], function(base, qiniu, Validate, tourismCtr) {

    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(3).addClass("active");
        getListTravelOrder();
        initUpload();
        addListener();
    }
    function getListTravelOrder(){
        tourismCtr.getTourismOrderList(4)
            .then((data) => {
                if(data.length){
                    var html = "";
                    $.each(data, function(i, d){
                        html += `<option value="${d.lineCode}">${d.line.name}</option>`;
                    });
                    $("#lineCode").html(html).trigger("change");
                }else{
                    base.showMsg("您还为购买过线路，无法发表游记");
                }
            }, () => {});
    }
    function initUpload() {
        qiniu.getQiniuToken()
            .then((data) => {
                var token = data.uploadToken;
                qiniu.uploadInit({
                    token: token,
                    btnId: "uploadBtn",
                    containerId: "uploadContainer",
                    multi_selection: true,
                    showUploadProgress: function(up, file){
                        $("#" + file.id)
                            .find(".ant-progress-bg").css({
                                "width": parseInt(file.percent, 10) + "%",
                                "height": "2px"
                            });
                    },
                    fileAdd: function(file, up){
                        var _img = $(`<div class="ant-upload-list-item ant-upload-list-item-uploading" data-src="" id="${file.id}">
                                        <div class="ant-upload-list-item-info">
                                            <span>
                                                <div class="ant-upload-list-item-uploading-text">上传中...</div>
                                            </span>
                                        </div>
                                        <i class="anticon anticon-cross"></i>
                                        <div class="ant-upload-list-item-progress">
                                            <div class="ant-progress ant-progress-line ant-progress-status-normal">
                                                <div>
                                                    <div class="ant-progress-outer">
                                                        <div class="ant-progress-inner">
                                                            <div class="ant-progress-bg"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`);
                        (function(_img, id){
                            _img.find('.anticon-cross').on('click', function (e) {
                                up.removeFile(file);
                                _img.remove();
                            });
                        })(_img, file.id)
                        $("#picture-card").append(_img);
                    },
                    fileUploaded: function(up, url, key, file){
                        $("#" + file.id).removeClass('ant-upload-list-item-uploading').attr("data-src", key)
                            .html(`<div class="ant-upload-list-item-info">
                                        <span>
                                            <a href="" class="ant-upload-list-item-thumbnail">
                                                <img src="${base.getPic(key)}"/>
                                            </a>
                                        </span>
                                    </div>
                                    <span class="ant-upload-list-item-actions">
                                        <i class="anticon anticon-eye-o"></i>
                                        <i class="anticon anticon-delete"></i>
                                    </span>`);
                        var pic = $("#pic").val();
                        pic = pic ? pic + '||' + key : key;
                        $("#pic").val(pic).valid();
                    }
                });
            }, () => {});
    }

    function addListener() {
        var _modal = $("#modal"),
            _modalImg = $("#ant-modal-img");
        // 关闭图片预览窗口
        $(".ant-modal-close-x").on("click", function(){
            _modal.addClass("hidden");
        });
        // 预览图片
        $("#picture-card").on("click", ".anticon-eye-o", function() {
            var url = $(this).closest(".ant-upload-list-item").attr("data-src");
            _modalImg.attr("src", base.getPic(url));
            _modal.removeClass("hidden");
        });
        // 删除图片
        $("#picture-card").on("click", ".anticon-delete", function() {
            var _item = $(this).closest(".ant-upload-list-item"),
                key = _item.attr("data-src");
            _item.remove();
            var pic = $("#pic").val();
            pic = pic.split(/\|\|/);
            for(var i = 0; i < pic.length; i++){
                if(pic[i] == key){
                    pic.splice(i, 1);
                    break;
                }
            }
            $("#pic").val(pic).valid();
        });
        var _travelForm = $("#travelForm");
        // 发表游记
        $("#publish").on("click", function(){
            if(_travelForm.valid()){
                publish(_travelForm.serializeObject());
            }
        });
        $.validator.setDefaults({
            errorPlacement: function(error, element) {
                error.insertAfter(element.parent()).css({
                    "padding-top": "12px",
                    "padding-left": "12px",
                    "color": "#ff0000",
                    "font-size": "12px"
                });
            }
        });
        _travelForm.validate({
            'rules': {
                lineCode: {
                    required: true
                },
                name: {
                    required: true,
                    maxlength: 32,
                    isNotFace: true
                },
                pic: {
                    required: true
                },
                description: {
                    required: true,
                    isNotFace: true
                }
            }
        });
    }
    // 发表游记
    function publish(config) {
        var _publish = $("#publish");
        _publish.prop("disabled", true).find("span").text("发表中...");
        tourismCtr.publishYJ(config)
            .then(function(data){
                base.showMsg("发表成功");
                setTimeout(() => {
                    location.href = '../tourism/tourism-note-yj.html?code=' + data.code || data;
                }, 1000);
            }, function(){
                _publish.prop("disabled", false).find("span").text("发表游记");
            });
    }
});
