define([
    'app/controller/base',
    'app/module/qiniu'
], function(base, qiniu) {

    init();

    // 初始化页面
    function init() {
        $("#userNav li").eq(3).addClass("active");
        initUpload();
        addListener();
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
                        // $("#" + file.id).find(".write-progress-wrap").show()
                        //     .find(".write-progress-up").css("width", parseInt(file.percent, 10) + "%");
                    },
                    fileAdd: function(file, up){
                        // showImgContainer.show();
                        // var imgCtn = $('<div class="wp33 pt10 plr6 p-r fl" id="'+file.id+'">'+
                        //                     '<div class="write-travel-img-wrap" style="height: '+width+'px">'+
                        //                         '<img src="'+defaultImg+'" class="center-img wp100 hp100">'+
                        //                     '</div>'+
                        //                     '<div class="w-travel-close-wrap">'+
                        //                         '<img src="'+closeImg+'" class="shan1">'+
                        //                     '</div>'+
                        //                     '<div class="write-progress-wrap"><div class="write-progress-up"></div></div>'+
                        //                 '</div>').appendTo(showImgContainer);
                        // (function(imgCtn, id){
                        //     imgCtn.find('.w-travel-close-wrap').on('click', function (e) {
                        //         up.removeFile(file);
                        //         if(showImgContainer.find(".w-travel-close-wrap").length == 1){
                        //             showImgContainer.hide();
                        //         }
                        //         var key = $("#" + id).find(".center-img").attr("data-src");
                        //         var pic = $("#pic").val();
                        //         pic = pic.split(/\|\|/);
                        //         for(var i = 0; i < pic.length; i++){
                        //             if(pic[i] == key){
                        //                 pic.splice(i, 1);
                        //                 break;
                        //             }
                        //         }
                        //         $("#pic").val(pic);
                        //         imgCtn.remove();
                        //     });
                        // })(imgCtn, file.id)
                    },
                    fileUploaded: function(up, url, key, file){
                        // $("#" + file.id).find(".write-progress-wrap").hide()
                        //     .end().find(".center-img").attr("src", url + suffix)
                        //     .attr("data-src", key).removeClass("hp100 wp100");
                        // var pic = $("#pic").val();
                        // if(pic)
                        //     pic = pic + '||' + key;
                        // else
                        //     pic = key;
                        // $("#pic").val(pic).valid();
                    }
                });
            }, () => {});
    }

    function addListener() {


    }
});
