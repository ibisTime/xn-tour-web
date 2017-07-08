define([
    'app/controller/base',
    'app/module/validate/validate',
    'app/interface/generalCtr',
    'app/interface/userCtr',
], function(base, Validate, generalCtr, userCtr) {
	var isReturn = base.getUrlParam("isReturn");
	
	var _loadingSpin = $("#loadingSpin");
	
    init();
    
    // 初始化页面
    function init() {
        
        _loadingSpin.removeClass("hidden");
        getAddressList();
        addListener();
        _loadingSpin.addClass("hidden");
    }
    
    function getAddressList(){
    	return userCtr.getAddressList(true).then((data)=>{
    		var html = "";
    		if(data.length){
                $.each(data, function(i, d){
                    html +=`<tr>
	    					<td>${d.addressee}</td>
	    					<td>${d.mobile}</td>
	    					<td>${d.province} ${d.city} ${d.district}</td>
	    					<td>${d.detailAddress}</td>
	    					<td>
	    						<input class="btn-edit" type="button"  data-code="${d.code}" value="修改"/><samp>|</samp>
	    						<input class="btn-delete" type="button"  data-code="${d.code}" value="删除"/></td>
	    					<td><input class="btn-defalut ${d.isDefault==0?'setDefault':''}" data-code="${d.code}" type="button" value=" ${d.isDefault==0?'设为默认':'默认地址'}"/></td>
	    				</tr>`;
                });
            } else {
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
	    		var params = $("#addressForm").serializeObject();
	    		if(!params.district){
	    			params.district = params.city;
	    			params.city = params.province;
	    		}
        		_loadingSpin.removeClass("hidden");
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
        
    }
});
