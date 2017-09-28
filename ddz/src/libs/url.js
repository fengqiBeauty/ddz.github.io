let url = {};
url.serialize = function(options, jsonp){
	let param = '';
	for(let key in options){
		param += '&' + key + '=' + options[key];
	}
	if(jsonp){
		param += '&callback';
	}
	return param;
}
url.query = function(name){
	var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return '';
}
export default url;