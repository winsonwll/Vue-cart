/*
* @note: 第三方登录未绑定手机号
* @date: 2016-06-06
* @author: xiayu chen
*/
define("pub/bindmob/bindmob", [ "lib/zepto/zepto", "pub/utils/utils", "lib/jquery/jquery", "lib/copy/ZeroClipboard", "pub/load/load" ], function(require, exports, module) {
    var $ = require("lib/zepto/zepto");
    var UTILS = require("pub/utils/utils");
    var LOAD = require("pub/load/load");
    var win = window;
    var doc = document;
    var body = $("body");
    var noop = function() {};
    var bindMob = function() {
        var err_tips = [ "请输入手机号", "请输入正确的手机号", "请输入右边的验证码", "请输入短信验证码", "请输入正确的短信验证码", "请设置登录密码" ], codeUrl = "http://user.vas.pptv.com/api/vcode.php?type=text", popupID = "bindMobWrap", //弹出层框ID
        popupHtml = '<style>.bind_mask{width:100%;height:100%;position:fixed;top:0;left:0;z-index:999;}				            .bind_mask .bindWrap{width:90%;position:relative;top:25%;left:5%;padding:4% 0;overflow:hidden;background:#293044;}				            .bind_mask .part_t{width:100%;float:;font-size:1.2em;text-align:center;color:#fff;}				            .bind_mask .close{position:absolute;top:.5em;right:.5em;width:5%;overflow:hidden;font-size:1.4em;color:#fff;}				            .bind_mask .bind_btn{margin:auto;width:50%;height:35px;line-height:35px;overflow:hidden;position:relative;background:#FFC819;border-radius:5px;}				            .bind_mask .bind_btn a{display:block;width:100%;text-align:center;font-weight:bold;font-size:1.2em;color:#A43600;}				            .bind_mask .loginform,.bind_mask .error_tip{width:86%;float:left;margin:0 7%;}				            .bind_mask .loginform{margin-bottom:5%;}				            .bind_mask .wrap_item{width:100%;float:left;height:2.5em;position:relative;margin:4% 0 0 0;}				            .bind_mask .input_style{display:block;width:100%;height:100%;line-height:2.5em;text-indent:1em;float:left;border:1px solid #242b3e;font-size:.8em;background:#3f475c;color:#FFF;border-radius:4px;}				            .bind_mask .yzm_img{display:block;float:right;width:28%;height:100%;position:absolute;top:1px;right:0px;border-radius:0 4px 4px 0;}				            .bind_mask .sendcode{display:block;float:right;width:35%;height:100%;text-align:center;position:absolute;top:1px;right:0px;background:#3f475c;text-align:center;line-height:2.5em;color:#FFF;text-decoration:underline;}				            .bind_mask .error_tip{color:red;line-height:2.2em;}						</style>						<div class="bind_mask" id="' + popupID + '">					        <div class="bindWrap">					            <div class="part_t">当前为第三方联合登陆账号<br>请绑定帐号后参加活动</div>					            <div class="loginform">					                <div class="wrap_item"><input type="text" class="input_style" id="bindMobNum" placeholder="请输入手机号" maxlength="11"></div>					                <div class="wrap_item">					                    <input type="text" class="input_style" id="bindCode" placeholder="请输入右边的验证码">					                    <img src="' + codeUrl + '" class="yzm_img" id="bindCodeBtn">					                </div>					                <div class="wrap_item">					                    <input type="text" class="input_style" placeholder="请输入短信验证码" id="bindMsg">					                    <a href="Javascript:void(0);" class="sendcode" id="bindMsgBtn">获取验证码</a>					                </div>					                <div class="wrap_item"><input type="text" class="input_style" id="bindMobPwd" placeholder="请设置登录密码"></div>					            </div>					            <div class="error_tip none" id="bindErr"></div>					            <div class="bind_btn"><a href="javascript:;" class="sure" id="bindBtn">提交</a></div>					            <a href="javascript:void(0);" class="close" id="bindClose">×</a>					        </div>					    </div>', _mob, _code, _msgCode, _pwd, _codeBtn, _msgBtn, _err, _closeBtn, _bindBtn;
        return {
            init: function(params) {
                //弹层
                this.popup();
            },
            //弹层
            popup: function() {
                var self = this;
                var popDom = $("#" + popupID);
                if (popDom.length <= 0) {
                    $("body").append(popupHtml);
                } else {
                    popDom.show();
                }
                _mob = $("#bindMobNum");
                _code = $("#bindCode");
                _msgCode = $("#bindMsg");
                _pwd = $("#bindMobPwd");
                _codeBtn = $("#bindCodeBtn");
                _msgBtn = $("#bindMsgBtn");
                _bindBtn = $("#bindBtn");
                _closeBtn = $("#bindClose");
                _err = $("#bindErr");
                //事件绑定
                self.bindEvent();
            },
            //事件绑定
            bindEvent: function() {
                var self = this;
                var mobCheck = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
                var msgCode = /^(\d+)$/;
                var msgClick = true;
                //提交按钮
                _bindBtn.off().on("click", function(e) {
                    var _this = $(this);
                    if (!_mob.val()) {
                        _err.show().html(err_tips[0]);
                        return;
                    }
                    if (!mobCheck.test(_mob.val())) {
                        _err.show().html(err_tips[1]);
                        return;
                    }
                    if (!_code.val()) {
                        _err.show().html(err_tips[2]);
                        return;
                    }
                    if (!_msgCode.val()) {
                        _err.show().html(err_tips[3]);
                        return;
                    }
                    if (!msgCode.test(_msgCode.val())) {
                        _err.show().html(err_tips[4]);
                        return;
                    }
                    if (!_pwd.val()) {
                        _err.show().html(err_tips[5]);
                        return;
                    }
                    var randomkey = UTILS.roundKey(200);
                    var encodepass = UTILS.enCode(_pwd.val(), randomkey);
                    _err.show().html("数据提交中...");
                    LOAD("http://game.g.pptv.com/api/ajax/bindPasswordSet.php", {
                        phone: _mob.val(),
                        code: _msgCode.val(),
                        password: encodepass,
                        pkey: randomkey
                    }, function(d) {
                        if (d && d.status && d.status == 1) {
                            alert && alert("绑定成功，请注销后重新登录！");
                            win.location.reload();
                            _err.hide();
                        } else {
                            d.message && _err.show().html(d.message);
                        }
                    });
                });
                //发送短信验证码
                _msgBtn.off().on("click", function(e) {
                    var _this = $(this);
                    if (!msgClick) {
                        return;
                    }
                    if (!_mob.val()) {
                        _err.show().html(err_tips[0]);
                        return;
                    }
                    if (!mobCheck.test(_mob.val())) {
                        _err.show().html(err_tips[1]);
                        return;
                    }
                    if (!_code.val()) {
                        _err.show().html(err_tips[2]);
                        return;
                    }
                    msgClick = false;
                    LOAD("http://game.g.pptv.com/api/ajax/sendsms.php", {
                        type: "pptvbd",
                        phone: _mob.val(),
                        vcode: _code.val()
                    }, function(d) {
                        msgClick = true;
                        if (d && d.status && d.status == 1) {
                            var resendtime = 59, resendInterval = setInterval(function() {
                                if (resendtime == 1) {
                                    resendInterval && clearInterval(resendInterval);
                                    _this.html("重新发送");
                                    return;
                                }
                                _this.html(resendtime + "s重新发送");
                                resendtime--;
                            }, 1e3);
                        } else {
                            d.message && _err.show().html(d.message);
                        }
                    });
                });
                //验证码点击更换
                _codeBtn.off().on("click", function(e) {
                    $(this).attr("src", codeUrl + "&" + Math.random().toString(36).substr(2));
                });
                //关闭按钮
                _closeBtn.off().on("click", function(e) {
                    $("#" + popupID).hide();
                });
                // 输入框获取焦点
                var $input_style = $(".input_style"), $bindWrap = $(".bindWrap");
                $input_style.focus(function() {
                    $bindWrap.css("top", 0);
                });
            }
        };
    }();
    return bindMob;
});