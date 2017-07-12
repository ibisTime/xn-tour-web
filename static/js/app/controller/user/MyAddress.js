define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/interface/generalCtr',
    'app/interface/userCtr',
], function(base, Validate, generalCtr, userCtr) {
	var isReturn = base.getUrlParam("isReturn"),
		configEdit={},configAdd={};

	var _loadingSpin = $("#loadingSpin");

    init();

    // 初始化页面
    function init() {
        _loadingSpin.removeClass("hidden");
        getAddressList();
        addListener();
        _loadingSpin.addClass("hidden");
    }
	
	//获取地址列表
    function getAddressList(){
    	return userCtr.getAddressList(true).then((data)=>{
    		var html = "";
    		if(data.length){
            	configAdd.isDefault = 0;
                $.each(data, function(i, d){
                    html +=`<tr>
	    					<td>${d.addressee}</td>
	    					<td>${d.mobile}</td>
	    					<td>${d.province} ${d.city} ${d.district}</td>
	    					<td>${d.detailAddress}</td>
	    					<td>
	    						<input class="btn-edit" type="button"  data-code="${d.code}" data-isDefault="${d.isDefault}" value="修改"/><samp>|</samp>
	    						<input class="btn-delete" type="button"  data-code="${d.code}" value="删除"/></td>
	    					<td><input class="btn-defalut ${d.isDefault==0?'setDefault':''}" data-code="${d.code}" type="button" value=" ${d.isDefault==0?'设为默认':'默认地址'}"/></td>
	    				</tr>`;
                });
            } else {
            	configAdd.isDefault = 1;
                html = '<tr><td colspan="6" class="tc">暂无数据</td></tr>';
            }

    		$("#addressTable tbody").html(html)
    	})
    }
	
    //删除地址
    function getAddressDelete(code){
    	_loadingSpin.removeClass("hidden");
    	userCtr.getAddressDelete(code).then(()=>{
			_loadingSpin.addClass("hidden");

			base.showMsg("删除成功");

			setTimeout(function(){
				location.reload(true);
			},800)
		},()=>{
			_loadingSpin.addClass("hidden");
		})
    }
	
	//修改
	function getAddressEdit(params){
        
        userCtr.getAddressEdit(params).then((d)=>{
        	_loadingSpin.addClass("hidden");
        	$("#Dialog").addClass("hidden");
        	
			base.showMsg("修改成功");

			setTimeout(function(){
				location.reload(true);
			},800)
        },()=>{
    		_loadingSpin.addClass("hidden");
        })
	}
	
	//获取地址详情
	function getAddressDetail(code){
        _loadingSpin.removeClass("hidden");
        
        userCtr.getAddressDetail(code).then((data)=>{
        	var prov = data.province;
        	var city = data.city;
        	var dist = data.district;
        	
        	if(prov==city){
        		city=dist;
        	}
        	
        	$("#addressee1").val(data.addressee);
        	$("#mobile1").val(data.mobile);
        	$("#detailAddress1").val(data.detailAddress);
        	
        	$("#city-group1").citySelect({
		        required: false,
		        prov:prov,
		        city:city,
		        dist:dist
		    });
    		_loadingSpin.addClass("hidden");
        	$("#Dialog").removeClass("hidden");
        },()=>{
    		_loadingSpin.addClass("hidden");
        })
	}
	
	//新增
	function getAddressAdd(params){
		userCtr.getAddressAdd(params).then((data)=>{

			_loadingSpin.addClass("hidden");
			base.showMsg("保存成功")
			setTimeout(function(){
				if(isReturn){
					base.goBack()
				}else{
					location.reload(true);
				}
			},800)
		},()=>{

			_loadingSpin.addClass("hidden");
		})
	}
	
    function addListener() {
    	$("#city-group").citySelect({
	        required: false
	    });

	    $("#addressForm").validate({
            'rules': {
                "addressee": {
                    required: true
                },
                "mobile": {
                    required: true,
                    mobile:true
                },
                "detailAddress": {
                    required: true
                },
                "province": {
                    required: true
                },
                "city": {
                    required: true
                },
                "district": {
                    required: true
                },
            },
            onkeyup: false
        });

	    //保存地址
	    $("#subBtn").click(function(){
	    	if($("#addressForm").valid()){
	    		var data = $("#addressForm").serializeObject();
	    		data.isDefault = configAdd.isDefault;
	    		if(!data.district){
	    			data.district = data.city;
	    			data.city = data.province;
	    		}
        		_loadingSpin.removeClass("hidden");
	    		getAddressAdd(data)
	    	}
	    })

        //设置默认
        $("#addressTable tbody").on("click",".setDefault",function(){

        	_loadingSpin.removeClass("hidden");
        	userCtr.getAddressDefault($(this).attr("data-code")).then(()=>{
    			_loadingSpin.addClass("hidden");

    			base.showMsg("设置成功");

    			setTimeout(function(){
    				location.reload(true);
    			},800)
    		},()=>{
    			_loadingSpin.addClass("hidden");
    		})
        })

        //删除地址
        $("#addressTable tbody").on("click",".btn-delete",function(){
        	var thisCode = $(this).attr("data-code")
        	base.confirm("确定删除该地址？").then(function(){
        		getAddressDelete(thisCode);
        	},base.emptyFun())
        })
        
        //修改地址
        $("#submitForm").validate({
            'rules': {
            	"addressee": {
                    required: true
                },
                "mobile": {
                    required: true,
                    mobile:true
                },
                "detailAddress": {
                    required: true
                },
                "province": {
                    required: true
                },
                "city": {
                    required: true
                },
                "district": {
                    required: true
                },
            },
            onkeyup: false
        });
        //弹窗-取消
        $("#Dialog #cancel").click(function(){
        	$("#Dialog").addClass("hidden");
        })
        
    	//弹窗-提交订单
        $("#Dialog #confirm").click(function(){
        	if($("#submitForm").valid()){
        		_loadingSpin.removeClass("hidden");
		        var data = $("#submitForm").serializeObject();
		        if(!data.district){
					data.district = data.city;
					data.city = data.province;
				}
		        data.isDefault=configEdit.isDefault;
		        data.code=configEdit.code;
        		_loadingSpin.removeClass("hidden");
                getAddressEdit(data);
        	}
        })
        
        //修改按钮
        $("#addressTable tbody").on("click",".btn-edit",function(){
        	configEdit.isDefault=$(this).attr("data-isDefault");
        	configEdit.code=$(this).attr("data-code");
        	getAddressDetail($(this).attr("data-code"))
        })

    }
});
