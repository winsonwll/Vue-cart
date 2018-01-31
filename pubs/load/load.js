/*
* pub 平台共用方法
* @date: 2015-06-15
* @author: xiayu chen
*/
define("pub/load/load", [ "lib/jquery/jquery" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery");
    /*
		* jsonp
		* @param: url
		* @param: params
		* @return: function(){}
		*/
    module.exports = function(url, params, callback, errcallback) {
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
    };
});