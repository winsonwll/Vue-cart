/*
* @note: 移动端分享模块
* @date: 2016-07-21
* @author: xiayu chen
*/
define("pub/share/share", [], function(require, exports, module) {
    "use strict";
    var win = window;
    var doc = document;
    var sUrl = {
        weibo: "http://v.t.sina.com.cn/share/share.php?c=pptv_vas_h5game_weibo&url=" + encodeURIComponent(win.location.href) + "&title=" + doc.title + "&source=&sourceUrl=&content=utf-8&pic=&appkey=1938876518",
        qzone: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(win.location.href),
        qq: "http://connect.qq.com/widget/shareqq/index.html?title=" + doc.title + "&url=" + encodeURIComponent(win.location.href) + "&desc=&pics=&site=http%3A%2F%2Fm.g.pptv.com "
    };
    //分享超类构造
    function share() {
        this.init.apply(this, arguments);
    }
    share.prototype = {
        //入口
        init: function() {
            //插入必要节点
            this.tmpl(arguments[0] || []);
        },
        //事件绑定
        bindEvent: function(dom) {
            var self = this;
            var btnWeibo = doc.getElementById("shareBtnWeibo");
            var btnQzone = doc.getElementById("shareBtnQzone");
            var btnQQ = doc.getElementById("shareBtnQQ");
            var btnCancel = doc.getElementById("shareBtnCancel");
            //weibo
            btnWeibo.addEventListener("touchend", function(e) {
                e.preventDefault();
                this.setAttribute("href", sUrl.weibo);
                this.click();
            });
            //qzone
            btnQzone.addEventListener("touchend", function(e) {
                e.preventDefault();
                this.setAttribute("href", sUrl.qzone);
                this.click();
            });
            //qq
            btnQQ.addEventListener("touchend", function(e) {
                e.preventDefault();
                this.setAttribute("href", sUrl.qq);
                this.click();
            });
            //close share wrap
            btnCancel.addEventListener("touchend", function(e) {
                doc.getElementById(dom).style.display = "none";
            });
        },
        //tmpl
        tmpl: function(params) {
            var self = this;
            var _position = params.position || "bottom";
            var cssTmpl = "							.shareWrap {position: absolute; " + _position + ":0; left: 0; z-index: 801; width: 100% }							.shareWrap .shareList {display: -webkit-box; display: -ms-flexbox; display: -webkit-flex; display: flex; padding: .14rem 0; width: 100%; background: #fff }							.shareWrap .shareList li {height: 100%; text-align: center; -webkit-box-flex: 1; -moz-box-flex: 1; -webkit-flex: 1; -ms-flex: 1; flex: 1; }							.shareWrap .shareList li a {display: inline-block }							.shareWrap .shareList li .icon_qq,.shareWrap .shareList li .icon_qzone,.shareWrap .shareList li .icon_weibo {display: inline-block; margin: auto; width: .6rem; height: .6rem; background-size: cover; background-repeat: no-repeat; text-align: center }							.shareWrap .shareList li .icon_weibo {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAA3NCSVQICAjb4U/gAAAAsVBMVEX////xYmX1YmTxYmX1YmT1ZWj1ZWj1YmT1YmT1ZWj1ZWj1ZWj1ZWj1ZWj1YmT1ZWj1YmT1ZWj/////+vv+9/f+7+/96uv95uf94uP93t792dr81tf80dL/zMz7xcb7vb76ubr5tLb6sLL5rK75pab5n6H4m534mJv4lJb3j5L3i433h4r3goT3fYD3enz2dXj2cnX1bXD2a231ZWj1YmT1XGD1WVz1VVj0UFP0TVDzSk0jcAl8AAAAO3RSTlMAETMzRFVmZneImaq7zMzd3e7//////////////////////////////////////////////////////2MlpgsAAAAJcEhZcwAACusAAArrAYKLDVoAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAAC8UlEQVRIiZ2WaXuiMBCAabeXVqtNgBUFVmk9ELknA+7//2GbkHCo2G6dL/hg3rlngqZdyv3TcDwBmIyHT/c9f1+eH4ze80beR4PvqMdxfiHjxx8CX0J3r/2AkNe7PuJhcp3I88nDJfH8FSDk+Zx4+Y7I85f/swFwzc7DVQKAIau5Tjx3VyKHbPF7ZnsBoIQmbd6uZZfFpBJrqwy9NhW80K5OQObMLVNAbi7f1DU9c4uxNEylK8AYQujpnJFaJn1GGAtcg5ormSvIorQ4RtzSFjtmuo0FmLjSf08cgcQgun04HiiZSx1jQdyfEFuDqJCr/Ga2RYkelg6hEauOiFkYdMNekVrcErMojFmRucQ5bgjZSWTAkVEbRu40BPnc2CYldL4vUmrCgb+QwYw07VczgwwWLUFo/UwyauS8QB8Sef/VdheATfokiIiFYWOFd9qwicPtJYws3UXFrslyPtTeFIIfvQTZlogA8eojVc35pk1VICFtFdvexvc3ni1eWcs9MJ59rNt5qtVuNaFbOyiRYVkgi1eVnoUqiRKFsEAB+gZx65jG3EswZ8WhqqyRdidN9ST+UT6Fx9hSP/dcdxFUdpbYEhPZYaBKQg9lIvQGvKmIHnPdWOVx3hnosUwywLxCVoVINSW7SvmK68Z1FU0HGapSSmX0gJlOlmk8qxTYDeJ2HHtWDYN+FXvCR9cq2F9ZVXFQ6vLblPGGkW0pPaMh5rqZwFavEN67GNGzUEZN87NIr2LhTaCbMmU2AOYifXq3LoN2xDDgDN2XTas5vCxVwvWgE0k1YvUgY8R909dY+rahG45fFNmnsGxFXWJ8si4YrLlL1joFyHhbBUvhoPkJJ93yeLqUALONmBljprYXtTcZdnulXkqdrQTIEt9z5jNztnA9P2anQLv6ugtWrBWxt+XjDGgX7PkaByn5hXTW+NXL4kxOLr9vrz0hZ1ffzy++W67XWy7xWz4VtBs+SK5BXwJCfvxxJamn4dsUYPrW/wn3D762OxZbhrb0AAAAAElFTkSuQmCC)}							.shareWrap .shareList li .icon_qzone {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAA3NCSVQICAjb4U/gAAAAn1BMVEX////xvDz1vTvxvDz1vTv1vkH1vTv1vkH1vTv1vTv1vkH1vkH1vkH1vkH1vkH1vTv1vkH1vTv1vkH//////fj++e7+9+b99N798tv98db979D87Mf86sL86L375rb64qv646z64ab63p3525T514r41oX403340Xj3z3P3zWr3y2X3yWH2x1r2xVP2wkv1wEf1vkH1vTv1uTH0tynzsyBmU7VTAAAANXRSTlMAETMzRFVVZmZ3iJmqu8zM3d3u/////////////////////////////////////////////9FcyJIAAAAJcEhZcwAACusAAArrAYKLDVoAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAACbklEQVRIiZ2W23aqMBCG0baWeqBoOAi1WEUBMWAS9vs/W0GSkGTUvepcuUg+55A/M7EsaGN75iwJWToze3xjGe6fLlZE2mox/R81cQgwZ/JH4CE0mt8GOpuPbhGv7n2CEPcVEu+PgM7eTeLD3MGo+eVDJ2xzne5OzPxma3kAHzmKKPCj5DNyTR90jVAG3LhD3UB1WYYQWkM3c3mCIBEatQjKgRsiztQMi7CiI1AMvBD3jhPCNlcElffcfIK4cE+gBCKfHTGGTnYc8SoYWncXpoYLyojPEZQ21CzbtEUWcitj7Ya6wntBoKDEVb8i9bOwrJf+DlKC83T3HYe+h1Tz/GD9leyPp5ozqxeuLlqH+lZgXsprYVszHlYy/G0YtbYOdH9eyd3MLEek8s2Xos3P/pCXuK5xWRxjQUhhO9ZSVipB2r/6m0vTZLx4/nCqS2uoLttqTFg29UZU7qwc6oC0TKoQP7QpAv57XakykIFdmaMA/KyhQgMovqjE0tJaFyv62OPq3zkSRKILwOFFlgzugtlROsS4NRrHzGgUlIYoKJqmiMPA7ywIzLZhC8EIBLfHfD6VZ4zPpyI/prsk1Z20ghGy5IFlQCkB0ZiFKX55VRTDGjI1rxiNIaI3p7FxkelF3q5Bk3sVuV5k601BSnkYlZAX+lIDm5hNSWQfnRhl9Rbm74LW12cfHGgXC2XlNTNPyV+OM9lguwbm7S/ivBnNwpYZDlM22KGNs9DbVopAWm+HYCiZ0sblsKA5NhRF2SWTgWnDTygNzq4WEt+0kXRj8EEzBt8z4/WZIf7MU8F64kFyD3oIdPbnx1VPPX7C/QIKty1gjzv+uQAAAABJRU5ErkJggg==)}							.shareWrap .shareList li .icon_qq {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAA3NCSVQICAjb4U/gAAAAXVBMVEX////////2+v3w9vvs9Prr8vrl7/nh7fjc6ffW5vXL3/LG3PG91u+10u2z0O2wzuyqy+qixuiew+eawOaUveWMt+OGtOGAsOB7rd92qt1yp9xro9prpNtmodljntjglcF0AAAAH3RSTlMA////////////////////////////////////////R0mdFQAAAAlwSFlzAAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAHnSURBVEiJnZbbtoIgEIadbWmllBooIvT+j7mhDGdktFX/lUv51hycA1mWqqwapY3RqqlK5nN6Xkh//C0txSfqIk0iedkDVAoEqS0o73ggqMs54jxsE8YM55So9oCgak3Unwhj6n0bkwvas3Om35xRragbOTpL3qN4chL5NLUlPHUQI7E0LHkj2XXDCaKOkjAd69bU54DVEebtWo/e2fEIVMROP5cJcataEXAwOAev0sGFZfs1AXDDZlQgSmLkmiIFPmBCLwj8wp5TBNSETgiP0A45MAhJmvR+aUyMfwzSYESXtLqcYAg4jjhnVdYSvwoOgRabaUmKJ8UScKVpxqFMA48QKzojoTQ8UpICwIiTPAFQYzPEMT74oH75mxqF79pNAptRKMn2tI2gOmvRr9xI1+xZTEC1FIy77yHyHYwvmFiWIV8FV2JQnJAViYtfw5++cMhNQx7dF6TFGvVgmhIOo5P3GEpJGtmPxwfz/+XDj7YlxatxYRXTlSfclZdkKK0n0lP50i/9evRNG0V2j2biVH4PWNwvBSq46FkcsMsYt93sWdlZ287PRTSCxvjimhtlU9eN8vvCP99vtfArI3WLriS8jFaLabX6vl98v6zXX5b4L1eF7IcLyRP69toT9PXl6kXtX+H+AQgohdLs7fwuAAAAAElFTkSuQmCC)}							.shareWrap .shareList li .txt {display: block; font-size: .12rem }							.shareWrap .cancel_btn {display: block; padding: .15rem 0; border-top: 1px solid #dcdcdc; background: #fff; color: #04adf6; text-align: center; font-size: .2rem }						    ";
            var htmlTmpl = '<ul class="shareList">					            <li>					                <a href="javascript:;" id="shareBtnWeibo" target="_blank">					                    <i class="icon_weibo"></i>					                    <em class="txt">微博</em>					                </a>					            </li>					            <li>					                <a href="javascript:;" id="shareBtnQzone" target="_blank">					                    <i class="icon_qzone"></i>					                    <em class="txt">空间</em>					                </a>					            </li>					            <li>					                <a href="javascript:;" id="shareBtnQQ" target="_blank">					                    <i class="icon_qq"></i>					                    <em class="txt">QQ</em>					                </a>					            </li>					        </ul>					        <a href="javascript:;" class="cancel_btn" id="shareBtnCancel">取消</a>';
            var domID = "shareWrap";
            !doc.getElementById(domID) && !function() {
                var eleCss = doc.createElement("style");
                var eleHtml = doc.createElement("div");
                eleHtml.className = "shareWrap";
                eleHtml.id = domID;
                eleCss.innerHTML = cssTmpl;
                eleHtml.innerHTML = htmlTmpl;
                doc.head.appendChild(eleCss);
                doc.body.appendChild(eleHtml);
                //事件绑定
                self.bindEvent(domID);
                return;
            }();
            doc.getElementById(domID).style.display = "";
        }
    };
    module.exports = share;
});