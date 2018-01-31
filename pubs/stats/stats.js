define("pub/stats/stats", [], function(a, b, c) {
    var d = function() {
        return {
            getCookie: function(a) {
                if (document.cookie.length > 0) {
                    var b = document.cookie.indexOf(a + "=");
                    if (-1 != b) return b = b + a.length + 1, c_end = document.cookie.indexOf(";", b), 
                    -1 == c_end && (c_end = document.cookie.length), decodeURIComponent(document.cookie.substring(b, c_end));
                }
            },
            enCode: function(a) {
                for (var b = "pplive_vas", c = a.length, d = b.length, e = "", f = 0; c > f; f++) e += String.fromCharCode(a.charAt(f).charCodeAt(0) + b.charAt(f % d).charCodeAt(0));
                return this.enCodeFun(e);
            },
            enCodeFun: function(a) {
                if (!/([^\u0000-\u00ff])/.test(a)) {
                    for (var b, c, d, e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, g = []; f < a.length; ) {
                        switch (b = a.charCodeAt(f), d = (f + 1) % 3) {
                          case 1:
                            g.push(e.charAt(b >> 2));
                            break;

                          case 2:
                            g.push(e.charAt((3 & c) << 4 | b >> 4));
                            break;

                          case 0:
                            g.push(e.charAt((15 & c) << 2 | b >> 6)), g.push(e.charAt(63 & b));
                        }
                        c = b, f++;
                    }
                    return 1 == d ? (g.push(e.charAt((3 & c) << 4)), g.push("==")) : 2 == d && (g.push(e.charAt((15 & c) << 2)), 
                    g.push("=")), g.join("");
                }
            },
            deCode: function(a) {
                for (var a = a.toLowerCase(), b = a.length, c = "", d = 0, e = 0, f = "", g = 0; b > g; g++) for (d <<= 5, 
                f = a.charAt(g), f >= "a" && "z" >= f ? d += f.charCodeAt(0) - 97 : f >= "2" && "7" >= f && (d += 24 + parseInt(f)), 
                e += 5; e >= 8; ) e -= 8, c += String.fromCharCode(d >> e), d &= (1 << e) - 1;
                return c;
            },
            toObject: function(a) {
                return new Function("return " + a)();
            },
            extend: function(a, b) {
                for (var key in b) a[key] = b[key];
                return a;
            }
        };
    }(), e = function() {
        var a = null, b = "http://tj.g.pptv.com/data/1.php", c = "", e = "", f = {
            app: "",
            f: "",
            plt: "",
            uid: "",
            puid: "",
            chid: "",
            cid: "",
            ccid: "",
            gid: "",
            sid: "",
            pid: "",
            scbid: "",
            scid: "",
            stid: "",
            ukey: "",
            ukid: "",
            evf: "",
            evt: "",
            url: "",
            etm: "",
            wtm: "",
            stat: "",
            info: ""
        }, g = !1, h = "";
        return {
            config: function(f) {
                a = f || {}, b = a.sUrl || b, c = a.scookie || "vas_ch", e = d.getCookie(c) || "", 
                e = d.deCode(e);
                var _isDebug = f.debug || false;
                this.setting(_isDebug);
            },
            setting: function(isdebug) {
                d.extend(f, d.toObject(e)), f.app = a.app || "", f.f = a.f || "", f.plt = a.plt || "";
                var b = a.params || {};
                d.extend(f, b), f.evt = a.evt || "", f.evf = g ? h : "";
                var c = "";
                for (var i in f) c += i + "=" + encodeURIComponent(f[i]) + "&";
                if (!isdebug) c = d.enCode(c), this.send(c);
            },
            send: function(a) {
                var c = document.createElement("iframe");
                c.src = b + "?" + a, c.width = 0, c.height = 0, c.style.display = "none", document.body.appendChild(c), 
                g = !0, h = f.evt;
            }
        };
    }();
    return function(a) {
        e.config(a);
    };
});