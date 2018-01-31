/*
* pub 平台共用方法
* @date: 2015-06-15
* @author: xiayu chen
*/
define("pub/public/pub", [ "lib/jquery/jquery", "pub/utils/utils", "lib/copy/ZeroClipboard" ], function(require, exports, module) {
    var $ = require("lib/jquery");
    var UTILS = require("pub/utils");
    return {
        /*
		* jsonp
		* @param: url
		* @param: params
		* @return: function(){}
		*/
        load: function(url, params, callback, errcallback) {
            var errcallback = errcallback || $.noop, setting = {
                url: url + "?" + $.param(params),
                cache: false,
                dataType: "jsonp",
                jsonp: params.cb || "cb",
                timeout: 3e4,
                success: function() {
                    if (callback && typeof callback == "function") {
                        callback.apply(null, arguments);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.console && console.log && console.log(textStatus);
                    errcallback();
                }
            };
            $.ajax(setting);
        },
        //登录标识
        loginStatic: false,
        load: function(url, params, callback, errcallback) {
            var errcallback = errcallback || $.noop, setting = {
                url: url + "?" + $.param(params),
                cache: false,
                dataType: "jsonp",
                jsonp: params.cb || "cb",
                timeout: 3e4,
                success: function() {
                    if (callback && typeof callback == "function") {
                        callback.apply(null, arguments);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.console && console.log && console.log(textStatus);
                    errcallback();
                }
            };
            $.ajax(setting);
        },
        /*
		 * @param ( object )
		 * nav: Tab navigation ( have A tag )
		 * wrap: Content blocks
		 * bindEvent: Trigger event
		 * presentClass: Class identify
		 * defaultIndex: default index
		 */
        tab: function(params) {
            var tabItem = params.nav, wrap = params.wrap, bindEvent = params.bindEvent, presentClass = params.presentClass, defaultIndex = params.defaultIndex ? params.defaultIndex - 1 : 0;
            //Default set
            tabItem.parent().find("li:eq(" + defaultIndex + ") a").attr("class", presentClass);
            wrap.hide();
            wrap.eq(defaultIndex).show();
            //Event set
            tabItem.die().live(bindEvent, function() {
                var _this = $(this), d = $(this).index();
                tabItem.find("a").removeClass(presentClass);
                _this.find("a").addClass(presentClass);
                wrap.hide();
                wrap.eq(d).show();
            });
        },
        /*
		* @note: 加密
		* @param: [logstr: 密文]  [key: 密钥]
		* @return: 
		*/
        enCode: function(logstr, key) {
            var key = key;
            var logstr_len = logstr.length;
            var key_len = key.length;
            var en_str = "";
            for (var i = 0; i < logstr_len; i++) {
                en_str += String.fromCharCode(logstr.charAt(i).charCodeAt(0) + key.charAt(i % key_len).charCodeAt(0));
            }
            return this.enCodeFun(en_str);
        },
        enCodeFun: function(text) {
            if (/([^\u0000-\u00ff])/.test(text)) return;
            var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, cur, prev, byteNum, result = [];
            while (i < text.length) {
                cur = text.charCodeAt(i);
                byteNum = (i + 1) % 3;
                switch (byteNum) {
                  case 1:
                    result.push(table.charAt(cur >> 2));
                    break;

                  case 2:
                    result.push(table.charAt((prev & 3) << 4 | cur >> 4));
                    break;

                  case 0:
                    result.push(table.charAt((prev & 15) << 2 | cur >> 6));
                    result.push(table.charAt(cur & 63));
                    break;
                }
                prev = cur;
                i++;
            }
            if (byteNum == 1) {
                result.push(table.charAt((prev & 3) << 4));
                result.push("==");
            } else if (byteNum == 2) {
                result.push(table.charAt((prev & 15) << 2));
                result.push("=");
            }
            return result.join("");
        }
    };
});