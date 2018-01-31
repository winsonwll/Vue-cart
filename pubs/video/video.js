define("pub/video/video", [], function(require, exports, module) {
    !function(a, b) {
        function c(a) {
            return document.getElementById(a) || document.body;
        }
        function d(a, b) {
            for (var c in b) a[c] = b[c];
            return a;
        }
        function e(a) {
            return "[object Object]" === Object.prototype.toString.call(a);
        }
        function f(a) {
            var b = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
            return null !== b ? v(b[2]) : null;
        }
        function g(a, b) {
            var c = new RegExp("(^|\\?|&)" + b + "=([^&]*)(\\s|&|$)", "i");
            return c.test(a) ? unescape(RegExp.$2.replace(/\+/g, " ")) : void 0;
        }
        function h(a) {
            if (!a || "" === a) return {};
            for (var b, c = {}, d = a.split("&"), e = 0; d[e]; ) b = d[e].split("="), c[b[0]] = b[1], 
            e++;
            return c;
        }
        function i(a) {
            var b = [];
            for (var c in a) b.push(e(a[c]) ? c + "=" + u(i(a[c])) : c + "=" + u(a[c]));
            return b.join("&");
        }
        function j(a) {
            var b = g(p, r) || function() {
                return a.o || "";
            }() || g(q, r) || h(v(f("sctx"))).o || function() {
                var a = q && q.toLowerCase().match(t)[1];
                if (a && -1 == a.indexOf(s)) return a;
                var b = p.toLowerCase().match(t)[1];
                return b && -1 == b.indexOf(s) ? b : void 0;
            }() || 0;
            return b;
        }
        function k() {
            var a = navigator.appVersion.indexOf("MSIE") >= 0, b = !0;
            if (a) try {
                {
                    new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                }
            } catch (c) {
                b = !1;
            } else navigator.plugins["Shockwave Flash"] || (b = !1);
            return b;
        }
        function l(a, b) {
            var c = document.getElementById(b), e = h(a.ctx);
            if (e.pageUrl && delete e.pageUrl, !b || !c) return void alert("请填写播放容器ID");
            if (this.config = d(w, a), !o) return new m(this.config, b);
            if (this.config.pageUrl = u(p), this.config.pageRefer = u(q), e.o = j(e), !e.o || "0" === e.o) try {
                e.o = window.location.href.toLowerCase().match(/\:\/\/([0-9a-z\-\_\.{}]+).*/i)[1];
            } catch (f) {}
            this.config.ctx = i(e), c.innerHTML = '<iframe src="http://player.aplus.pptv.com/corporate/proxy/proxy.html#' + i(this.config) + '" scrolling="no" frameborder="0" width="' + this.config.w + '" height="' + this.config.w + '"></iframe>';
        }
        function m(a, b) {
            var d = this;
            this.config = a || {}, this.playerbox = c(b), b && this.playerbox && (this.init = function() {
                var b = a.id;
                b && d.loadPlayEncode(b, function(b) {
                    d.config.pl = b, 0 === Number(a.autoplay) && (d.config.flashvars = "ap=0"), d.playerbox.innerHTML = d.makeHtml(d.config);
                });
            }, this.makeHtml = function(a) {
                return k() ? [ '<embed src="', a.pl, '" flashvars="', a.flashvars, '" quality="high" width="', a.w, '" height="', a.h, '" allowScriptAccess="always" allownetworking="all" type="application/x-shockwave-flash" wmode="', a.wmode, '" allowfullscreen="true" align="middle" ></embed>' ].join("") : '<div style="text-align:center;color:#999; padding:100px 0; line-height:2; background:#000;">您没有安装FlashPlayer <a target="_blank" href="http://get.adobe.com/cn/flashplayer/" style="color:#ff0;">请点击此处去下载安装最新的FlashPlayer</a><br/>安装完毕之后请刷新页面或者重新启动浏览器。</div><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0 width="1" height="1"></object>';
            }, this.loadPlayEncode = function(a, b) {
                x.load({
                    url: "http://api.v.pptv.com/swfurl/?cid=" + a,
                    callback: function(a) {
                        0 === a.err ? b(a.data) : alert("非常抱歉,我们暂无此视频资源！");
                    }
                });
            }, this.init());
        }
        var n = a.navigator.userAgent, o = n.match(/(iPhone|iPod|Android|iPad|BlackBerry|webOS|Windows Phone)/i) ? !0 : !1, p = a.location.href, q = document.referrer || "", r = "rcc_id", s = "pptv.com", t = /\:\/\/([0-9a-z\-\_\.{}]+).*/i, u = encodeURIComponent, v = decodeURIComponent, w = {
            id: "",
            autoplay: 0,
            w: "100%",
            h: "100%"
        };
        a.ppliveplayer || (a.ppliveplayer = {});
        var x = function() {
            function a(a) {
                a = a || c || {};
                var g, h, i, j, k = "js", l = function() {};
                if (g = a.url, k = a.type, h = a.charset, l = a.callback, userCall = a.userCall !== b ? a.userCall : !0, 
                i = a.bind, params = a.params, j = a.cache, cbStr = a.cbStr, g && "" !== g) try {
                    if ((userCall || params) && g.indexOf("?") < 0 && (g += "?_t=0"), userCall && l) {
                        var m = cbStr || f + e;
                        window[m] = function() {
                            l.apply(i, arguments);
                        }, g = g + "&cb=" + m, cbStr || e++;
                    }
                    for (var n in params) g += "&" + n + "=" + params[n];
                    var o;
                    "css" == k ? (o = document.createElement("link"), o.rel = "stylesheet", o.type = "text/css", 
                    o.href = g) : (o = document.createElement("script"), o.src = g, o.type = "text/javascript"), 
                    h && (o.charset = h), !userCall && l && (o.onload !== b ? o.onload = function() {
                        l.apply(i, [ g, !0 ]);
                    } : o.onreadystatechange !== b && (o.onreadystatechange = function() {
                        "loaded" == o.readyState && l.apply(i, [ g, !0 ]);
                    }), o.onerror = function() {
                        l.apply(i, [ g, !1 ]);
                    }), d[g] = o, document.getElementsByTagName("head")[0].appendChild(o);
                } catch (p) {
                    l(g, !1);
                }
            }
            var c, d = {}, e = +new Date(), f = "pptv_player_";
            return {
                load: function(b) {
                    return a(b), this;
                },
                cancle: function() {
                    d[src] && (document.removeChild(d[src]), delete d[src]);
                }
            };
        }();
        a.ppliveplayer.addVideo = function(a, b) {
            new l(a, b);
        }, a.ppliveplayer._proxy = function(b, c) {
            return !c || a.ppliveplayer[b] || "function" != typeof c ? a.ppliveplayer[b] : void (a.ppliveplayer[b] = c);
        }, a.define && "function" == typeof define && define(function() {
            return a.ppliveplayer;
        });
    }(window);
});