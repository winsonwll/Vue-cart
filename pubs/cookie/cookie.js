/*
* cookie
* @date: 2015-06-17
* @author: xiayu chen
*/
define("pub/cookie/cookie", [], function(require, exports, module) {
    return {
        /*
		 * set cookie
		 * @params : cookie name, value, time
		 */
        set: function(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = c_name + "=" + escape(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
        },
        /*
		 * get cookie
		 * @params : cookie name
		 */
        get: function(c_name) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) c_end = document.cookie.length;
                    return decodeURIComponent(document.cookie.substring(c_start, c_end));
                }
            }
            return;
        },
        /*
		* remove cookie
		*/
        remove: function(c_name) {
            this.set(c_name, "", -1);
        }
    };
});