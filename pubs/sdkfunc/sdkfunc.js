/**
 * 
 * @authors Mengzhang (Mengzhang@pptv.com)
 * @date    2016-04-14 18:05:54
 * @Desc    sdk里APK下载&视频播放&登录
 */
define("pub/sdkfunc/sdkfunc", [ "lib/jquery/jquery", "pub/share/share" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery"), SHARE = require("pub/share/share");
    // ppsdk初始化
    var sdk = window.ppsdk;
    sdk && sdk.config({});
    return {
        /**
   		 * 分平台调用视频播放
         * @params :sdkor, link, vid, autoplay, domId
   		 * sdkor:平台识别；link:视频播放地址；vid:视频播放串；autoplay:1自动播放，0不自动播放，domId:插入播放器的domId。
   		**/
        videoPlay: function(params, callback) {
            var callback = callback || $.noop, //向下兼容
            _link = params.link + "&cp=1";
            switch (params.sdkor) {
              // 浏览器
                case 0:
                ppliveplayer.addVideo({
                    // 视频ID
                    id: params.vid,
                    autoplay: params.autoplay
                }, params.domId);
                callback.apply(null, arguments);
                break;

              // sdk
                case 1:
                sdk.ready(function() {
                    ppsdk.playVideo({
                        playlink: _link,
                        success: function(rspData) {},
                        error: function(errCode, msg) {}
                    });
                });
                break;

              // 微信
                case 2:
                ppliveplayer.addVideo({
                    // 视频ID
                    id: params.vid,
                    autoplay: params.autoplay
                }, params.domId);
                callback.apply(null, arguments);
                break;
            }
        },
        /**
         * app分平台下载
         * @params : apkinfo, downloadBtn, sdkor, apkurl
         * apkinfo:app的地址(举个栗子：ddd_m&&弹弹岛2&&http://img3.pplive.cn/images/2016/06/14/16194373969.png&&http://dl4.vas.pptv.com/mobgame/ddd/v1.0.4/ddd_1.0.4_187_316.apk&&com.wyd.hero.dandandao.pptv&&0)，downloadBtn:对应的下载按钮类名，sdkor:平台识别，apkurl: apk地址(.apk)
        **/
        downLoad: function(params, callback) {
            // 下载状态码
            var statusMap = {
                0: "等待下载",
                1: "下载中",
                2: "已暂停，继续",
                3: "点击安装",
                //下载完成
                4: "下载错误",
                //下载错误
                5: "删除",
                //删除
                6: "暂停中",
                //暂停中
                240: "打开",
                //已安装
                241: "点击更新",
                //有更新
                242: "点击安装"
            };
            var timer = null, $J_downbtn = $("." + params.downloadBtn), apkinfo = params.apkinfo;
            // 获取下载状态
            function getdownStatus() {
                ppsdk.ready(function() {
                    ppsdk.getDownloadStatus != undefined && ppsdk.getDownloadStatus({
                        data: apkinfo,
                        success: function(d) {
                            switch (d.status) {
                              //未下载
                                case -1:
                                break;

                              //等待下载
                                case 0:
                                break;

                              //下载中
                                case 1:
                                setTimeout(function() {
                                    getdownStatus();
                                }, 500);
                                $J_downbtn.attr("datatype", "pause");
                                $J_downbtn.html(statusMap[d.status] + (d.current_bytes / d.total_bytes * 100).toFixed(2) + "%");
                                break;

                              //暂停
                                case 2:
                                clearInterval(timer);
                                $J_downbtn.attr("datatype", "download_goon");
                                $J_downbtn.html(statusMap[d.status]);
                                break;

                              //下载完成
                                case 3:
                                timer = setInterval(function() {
                                    //下载完成之后会有一个自动安装，所以做定时器获取时事状态
                                    getdownStatus();
                                }, 1e3);
                                $J_downbtn.attr("datatype", "yetinstall");
                                $J_downbtn.html(statusMap[d.status]);
                                break;

                              //下载错误
                                case 4:
                                clearInterval(timer);
                                $J_downbtn.attr("datatype", "download_goon");
                                $J_downbtn.html(statusMap[d.status]);
                                break;

                              //已安装
                                case 240:
                                clearInterval(timer);
                                $J_downbtn.attr("datatype", "yetinstall");
                                $J_downbtn.html(statusMap[d.status]);
                                break;

                              //有更新
                                case 241:
                                clearInterval(timer);
                                $J_downbtn.attr("datatype", "update");
                                $J_downbtn.html(statusMap[d.status]);
                                break;

                              //未安装
                                case 242:
                                clearInterval(timer);
                                $J_downbtn.attr("datatype", "install");
                                $J_downbtn.html(statusMap[d.status]);
                                timer = setInterval(function() {
                                    getdownStatus();
                                }, 1e3);
                                break;
                            }
                        },
                        error: function(errCode, msg) {}
                    });
                });
            }
            getdownStatus();
            // 设置下载状态
            function setStatus(args) {
                var _op = args.op || 0, _url = args.url || "";
                ppsdk.ready(function() {
                    ppsdk.setDownloadStatus({
                        op: _op,
                        data: _url,
                        success: function(d) {
                            getdownStatus();
                        },
                        error: function(errCode, msg) {}
                    });
                });
            }
            //按钮事件
            $J_downbtn.off().on("click", function(e) {
                e.preventDefault();
                var $this = $(this);
                var _status = $this.attr("datatype") || "download";
                switch (_status) {
                  //下载
                    case "download":
                    ppsdk.ready(function() {
                        switch (params.sdkor) {
                          // sdk
                            case 1:
                            ppsdk.addDownload({
                                data: apkinfo,
                                success: function(d) {
                                    if (d && d.result && d.result == 1) {
                                        setTimeout(function() {
                                            getdownStatus();
                                        }, 1e3);
                                    }
                                },
                                error: function(errCode, msg) {}
                            });
                            break;

                          // 浏览器
                            case 0:
                            win.location.href = params.apkurl;
                            break;

                          // 微信
                            case 2:
                            win.location.href = "http://game.g.pptv.com/api/alone/wxgo.php?goto=" + params.apkurl;
                            break;
                        }
                    });
                    callback.apply(null, arguments);
                    //添加回调函数(方便统计)
                    break;

                  //打开
                    case "yetinstall":
                    setStatus({
                        op: 0,
                        url: apkinfo
                    });
                    break;

                  //暂停
                    case "pause":
                    setStatus({
                        op: 1,
                        url: apkinfo
                    });
                    break;

                  //恢复下载
                    case "download_goon":
                    setStatus({
                        op: 2,
                        url: apkinfo
                    });
                    break;

                  //已下载
                    case "install":
                    setStatus({
                        op: 3,
                        url: apkinfo
                    });
                    break;

                  //更新
                    case "update":
                    // update
                    break;
                }
            });
        }
    };
});