let date = {};
let number_format = function(number, digit){
	digit = digit || 2;
	number = number.toString();
	for(let i = 0; i < digit; i++){
		number = '0' + number;
	}
	return number.slice(number.length - digit);
}
date.format = function(date, format){
	//date = date || new Date();
	if(!date){
		return '';
	}
	format = format || 'yyyy-MM-dd HH:mm:ss';
	format = format.replace('yyyy', date.getFullYear());
	format = format.replace('MM', number_format(date.getMonth() + 1, 2));
	format = format.replace('dd', number_format(date.getDate(), 2));
	format = format.replace('HH', number_format(date.getHours(), 2));
	format = format.replace('mm', number_format(date.getMinutes(), 2));
	format = format.replace('ss', number_format(date.getSeconds(), 2));
	return format;
}
export default date;