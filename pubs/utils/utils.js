/*
* utils 共用方法
* @date: 2015-06-15
* @author: xiayu chen
*/
module.exports = {
    
    //获取cookie  
    getCookie: function(name) {
        var str = "; " + document.cookie + "; ", index = str.indexOf("; " + name + "=");
        if (index != -1) {
            var tempStr = str.substring(index + name.length + 3, str.length), target = tempStr.substring(0, tempStr.indexOf("; "));
            return decodeURIComponent(target);
        }
        return null;
    },
    /*
    * set cookie
    * @params : cookie name, value, time
    */
    setCookie: function(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    },
    //随机key
    roundKey: function(n) {
        var chars = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 61);
            res += chars[id];
        }
        return res;
    },
    /*
    * @note: js 获取地址栏参数
    * @param: key
    * @return: value
    */
    getStr: function(params) {
        var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //判断微信
    isWechat: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    //页面加载完成
    loaded: function(callback) {
        callback && !function() {
            if (/loaded|complete/.test(document.readyState)) {
                callback.apply(null);
            } else {
                document.onreadystatechange = function() {
                    if (/loaded|complete/.test(document.readyState)) {
                        callback.apply(null);
                    }
                };
            }
        }();
    },
    //判断 IOS或安卓
    platform: function() {
        var ua = navigator.userAgent.toLowerCase();
        var returnVal;
        if (/iphone|ipad|ipod/.test(ua)) {
            //ios
            returnVal = "ios";
        } else if (/android/.test(ua)) {
            //安卓
            returnVal = "aph";
        }
        return returnVal;
    }
};