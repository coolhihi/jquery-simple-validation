/**
 * simpleValidation - By Closely Coded
 * ie bug fixed - By COoL
 */
(function($, window, undefined) {
	var methods = {
		init : function() {},
		isEmail : function( text ) {
			regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,5})?$/;
			return regex.test(text);
		},
		isAlpha : function( text ) {
			regex = /^[A-Za-z]*$/;
			return regex.test(text);
		},
		isAlphaNum : function( text ) {
			regex = /^[A-Za-z0-9]*$/;
			return regex.test(text);
		},
		isNumeric : function( text ) {
			regex = /^[0-9]*$/;
			return regex.test(text);
		},
		isPhone : function( text ) {
			regex = /^[\+]?[\s\d]+$/;
			return regex.test(text);
		},
		isInteger : function( value ) {
			return ((value - 0) == value && value % 1 == 0);
		},
		isUrl : function( text ) {
			regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
			return regex.test(text);
		},
		isIp : function( text ) {
			regex = /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/;
			return regex.test(text);
		},
		isDate : function( dateStr ) {
			var datePat = /^(\d{4})(\/|-)(\d{2})(\/|-)(\d{2})$/;
			var matchArray = dateStr.match(datePat);
			if( !datePat.test(dateStr) )
				return false;

			year = matchArray[1];
			month = matchArray[3];
			day = matchArray[5];
			if( month < 1 || month > 12 )
				return false;
			if( day < 1 || day > 31 )
				return false;
			if( (month==4 || month==6 || month==9 || month==11) && day==31 )
				return false;

			if( month == 2 ) { // check for february 29th
				var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
				if( day > 29 || (day==29 && !isleap) )
					return false;
			}
			return true; // date is valid
		}
	};

	$.fn.validate = function( opts ) {
		var options = $.extend({
			'short_error_message' : false
		}, opts || {});
		var form = this;

		//return $(form.selector).submit(function(ev) {
			var warning = '';
			$(form).find('input, select, textarea').each(function() {

				if( $(this).is(':visible') ) {
					var data_rules = $(this).data('rules');
					if( data_rules != '' && data_rules != undefined ) {
						var validation = data_rules.split('#');
						for( var x=0; x<validation.length; x++ ) {
							var rule = validation[x].split('-');
								var label = label_ori = rule[0];
								var type = rule[1];
								var value = $(this).val();

							//if( options.short_error_message == false ) {
								//label = 'The ' + label + ' field';
							//}

							if( type == 'required' && value == '' ) {
								warning += label + ' 不允许为空.\n';
							}

							else if( type == 'valid_email' && !methods.isEmail(value) ) {
								warning += label + ' 必须是一个有效的邮箱地址.\n';
							}

							else if( type == 'valid_url' && value != '' && !methods.isUrl(value) ) {
								warning += label + ' 必须是一个有效的网址.\n';
							}

							else if( type == 'valid_ip' && value != '' && !methods.isIp(value) ) {
								warning += label + ' 必须是一个有效的IP.\n';
							}

							else if( type.substr(0, 10) == 'min_length' && value != '' ) {
								temp = type.split('+');
								t_length = temp[1];
								if( value.length < t_length ) {
									suffix = '';
									if( t_length > 1 )
										suffix = 's';
									warning += label + ' 不允许少于 ' + t_length + ' 个字符或 '+Math.floor(t_length/2)+' 个中文.\n';
								}
							}

							else if( type.substr(0, 10) == 'max_length' && value != '' ) {
								temp = type.split('+');
								t_length = temp[1];
								if( value.length > t_length ) {
									suffix = '';
									if( t_length > 1 )
										suffix = 's';
									warning += label + ' 不允许多于 ' + t_length + ' 个字符或 '+Math.floor(t_length/2)+' 个中文.\n';
								}
							}

							else if( type.substr(0, 12) == 'exact_length' && value != '' ) {
								temp = type.split('+');
								t_length = temp[1];
								if( value.length != t_length ) {
									suffix = '';
									if( t_length > 1 )
										suffix = 's';
									warning += label + ' 必须是 ' + t_length + ' 个字符或 '+Math.floor(t_length/2)+' 个中文.\n';
								}
							}

							else if( type.substr(0, 3) == 'min' && value != '' && methods.isInteger(value) ) {
								temp = type.split('+');
								t_limit = temp[1];
								if( value < t_limit ) {
									warning += label + ' 不允许小于 ' + t_limit + '.\n';
								}
							}

							else if( type.substr(0, 3) == 'max' && value != '' && methods.isInteger(value) ) {
								temp = type.split('+');
								t_limit = temp[1];
								if( value > t_limit ) {
									warning += label + ' 不允许大于 ' + t_limit + '.\n';
								}
							}

							else if( type == 'alpha' && !methods.isAlpha(value) ) {
								warning += label + ' 只允许输入英文字符.\n';
							}

							else if( type == 'alpha_numeric' && !methods.isAlphaNum(value) ) {
								warning += label + ' 只允许输入英文字符或数字.\n';
							}

							else if( type == 'numeric' && value != '' && parseFloat(value).toString() != value ) {
								warning += label + ' 必须是一个数.\n';
							}

							else if( type == 'is_numeric' && !methods.isNumeric(value) ) {
								warning += label + ' 只允许输入数字.\n';
							}

							else if( type == 'integer' && value != '' && !methods.isInteger(value) ) {
								warning += label + ' 必须是一个整数.\n';
							}

							else if( type.substr(0, 7) == 'matches' && value != '' ) {
								temp = type.split('+');
								match_id = temp[1];
								match_label = temp[2];
								match_value = $('#'+match_id).val();
								//if( options.short_error_message == false )
								//	match_label = 'the ' + label + ' field';
								if( value != match_value ) {
									warning += label + ' 必须与 ' + match_label + ' 一致.\n';
								}
							}

							else if( type == 'valid_phone' && value != '' && !methods.isPhone(value) ) {
								warning += label + ' 必须是有效的号码.\n';
							}

							else if( type == 'valid_date' && value != '' && !methods.isDate(value) ) {
								warning += label + ' 必须是有效的日期.\n';
							}

							else if( type.substr(0, 11) == 'valid_check' ) {
								if( $(this).attr('checked') != 'checked' )
									warning += label_ori + '\n';
							}

							else if( type.substr(0, 11) == 'valid_radio' ) {
								match_class = $(this).attr('name');
								flag = 0;
								$(form.selector).find('input:radio').each(function() {
									if( $(this).attr('name') == match_class  && $(this).attr('checked') == 'checked' ) {
										flag++;
									}
								});
								if( flag == 0 )
									warning += '请选择 ' + label_ori + ' .\n';
							}

							else if( type.substr(0, 11) == 'multi_check' ) {
								temp = type.split('+');
								match_unit = temp[1];
								match_class = $(this).attr('name');
								flag = 0;
								$(form.selector).find('input:checkbox').each(function() {
									if( $(this).attr('name') == match_class  && $(this).attr('checked') == 'checked' ) {
										flag++;
									}
								});
								if( flag < match_unit )
									warning += '请选择最少 ' + match_unit + ' 个 ' + label_ori + ' .\n';
							}

						} //end for
					} //if set data-rules
				} //if visible
			});

			if( warning != '' ) {
				//alert(warning);
				return  warning;
			} else {
				return true;
			}
		//});
	};
})(jQuery, window);
