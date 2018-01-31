/*
* encode平台共用方法
* @date: 2015-06-15
* @author: xiayu chen
*/
module.exports = {
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
        },
        /*
		* @note: 解密
		* @param: 
		* @return: 
		*/
        deCode: function(logstr) {
            var logstr = logstr.toLowerCase();
            var logstr_len = logstr.length;
            var en_str = "";
            var v = 0;
            var vbits = 0;
            var tstr = "";
            for (var i = 0; i < logstr_len; i++) {
                v <<= 5;
                tstr = logstr.charAt(i);
                if (tstr >= "a" && tstr <= "z") {
                    v += tstr.charCodeAt(0) - 97;
                } else if (tstr >= "2" && tstr <= "7") {
                    v += 24 + parseInt(tstr);
                }
                vbits += 5;
                while (vbits >= 8) {
                    vbits -= 8;
                    en_str += String.fromCharCode(v >> vbits);
                    v &= (1 << vbits) - 1;
                }
            }
            return en_str;
        }
};