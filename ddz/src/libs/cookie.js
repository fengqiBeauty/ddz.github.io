var cookie = function(key, value, time){
    if('undefined' == typeof(value)){
    	var arr,reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
    	if(arr = document.cookie.match(reg)){
    		return arr[2];
    	}else{
    		return null;
    	}
    }else{
    	time = time || 7200;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + time * 1000);
	    document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString();
    }
}
export default cookie;