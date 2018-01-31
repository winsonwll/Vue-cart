define("pub/login/login", [ "lib/jquery/jquery", "pub/cookie/cookie", "pub/load/load", "pub/encrypt/encrypt" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery");
    var COOKIE = require("pub/cookie/cookie");
    var LOAD = require("pub/load/load");
    var ENCRYPT = require("pub/encrypt/encrypt");
    var win = window;
    /*
	* Login(统一登录) 基于jQuery
	* @Date: 2015-01-27
	* @author: xiayu chen
	*/
    win.LOGIN = function() {
        //业务处理
        var CONTROL = function() {
            return {
                //配置
                SETING: function() {
                    var self = this;
                    //Tips text
                    var userTips = {
                        t0: "",
                        //验证成功默认
                        t1: "请输入用户名！",
                        t2: "请输入密码！",
                        t3: "请输入验证码！",
                        t4: "验证码错误！"
                    };
                    //初始化配置
                    var codeSwitch = "open";
                    //验证码开关
                    var codeUrl = "http://user.vas.pptv.com/api/vcode.php?type=login";
                    //验证码地址
                    //DOM遍历: 注册事件
                    var $formID = $(".L_loginForm");
                    if ($formID.length > 0) {
                        $.each($formID, function(index, val) {
                            var $Wrap = $(this);
                            //返回当前Form
                            var submitType = $Wrap.find('input[name="type"]').length ? $Wrap.find('input[name="type"]')[0].value : "form";
                            //提交方式(form, ajax)
                            var ajaxUrl = "http://user.vas.pptv.com/api/login.php";
                            //ajax登录地址
                            var formUrl = "http://user.vas.pptv.com/api/login.php";
                            //Form登录地址
                            var formSucUrl = $Wrap.find('input[name="gourl"]').length ? $Wrap.find('input[name="gourl"]')[0].value : "";
                            //Form登录成功跳转地址
                            var othHidden = $Wrap.find('input[type="hidden"][name!="type"][name!="gourl"]');
                            //增加其它隐藏域
                            var $customCallback = $Wrap.attr("cb");
                            //自定义回调
                            var $userName = $Wrap.find(".L_username");
                            //登录用户名
                            var $userNameTips = $Wrap.find(".L_usernameTips");
                            //登录用户名tips
                            var $passWord = $Wrap.find(".L_password");
                            //登录密码
                            var $passWordTips = $Wrap.find(".L_passwordTips");
                            //登录密码tips
                            var $authCode = $Wrap.find(".L_authCode");
                            //验证码
                            var $authCodeImg = $Wrap.find(".L_authCodeImg");
                            //验证码图片
                            var $authCodeTips = $Wrap.find(".L_authCodeTips");
                            //验证码tips
                            var $formSubmit = $Wrap.find(".L_btnSubmit");
                            //登录按钮
                            var $errorTip = $(".L_errorTip");
                            //Form表单提交错误返回
                            //默认提取Cookie[PPVasUid]
                            if (COOKIE.get("PPVasUid")) {
                                $userName.val(COOKIE.get("PPVasUid"));
                            }
                            //点击登录标识
                            var loginSubmitClick = true;
                            var vcodeFlag = false;
                            //验证码对错标识(false,true)
                            //enter alert flag
                            _userEnter = true;
                            _passwordEnter = true;
                            _loginEvent = "";
                            //load: Form表单提交返回错误
                            if ($errorTip.length) {
                                var _push = win.message || "";
                                $errorTip.html(_push);
                            } else {
                                win.message && alert(win.message);
                            }
                            //验证码: 开
                            if (codeSwitch == "open") {
                                if (!$authCode.length) {
                                    alert("未配置验证码输入框");
                                    return false;
                                }
                                if (!$authCodeImg.length) {
                                    alert("未配置验证码图片");
                                    return false;
                                }
                            } else if (codeSwitch == "close") {
                                //验证码: 关	
                                $authCode.length && $authCode.hide();
                                $authCodeImg.length && $authCodeImg.hide();
                                $authCodeTips.length && $authCodeTips.hide();
                            }
                            //回车登录
                            $userName.keydown(function(e) {
                                if (e && e.keyCode == 13) {
                                    _userEnter = false;
                                    $formSubmit.click();
                                }
                            });
                            $passWord.keydown(function(e) {
                                if (e && e.keyCode == 13) {
                                    _passwordEnter = false;
                                    $formSubmit.click();
                                }
                            });
                            if (codeSwitch == "open") {
                                $authCode.keydown(function(e) {
                                    var _tmpVal = $authCode[0].value;
                                    if (e && e.keyCode == 13) {
                                        if (!_tmpVal) return;
                                        // _loginEvent = 'enter'; //bug: 验证码框第一次回车发送校验，随后点击登录按钮不发送接口校验了。
                                        LOAD("http://user.vas.pptv.com/api/vcode.php", {
                                            type: "login",
                                            action: "check",
                                            vcode: _tmpVal
                                        }, function(d) {
                                            if (d && d == 1) {
                                                vcodeFlag = true;
                                            } else if (d == 0) {
                                                vcodeFlag = false;
                                            }
                                            $formSubmit.click();
                                        });
                                    }
                                });
                            }
                            //验证码事件
                            if (codeSwitch == "open") {
                                //if( submitType == 'form' ) _loginEvent = 'enter'; //bug:解决form提交，发送两次验证码
                                var _FirstFocus = false;
                                //第一次获取验证码
                                //Focus In
                                $authCode.focusin(function(event) {}).focusout(function(event) {
                                    if (_loginEvent != "enter") {
                                        LOAD("http://user.vas.pptv.com/api/vcode.php", {
                                            type: "login",
                                            action: "check",
                                            vcode: $authCode[0].value
                                        }, function(d) {
                                            if (d && d == 1) {
                                                vcodeFlag = true;
                                            } else if (d == 0) {
                                                vcodeFlag = false;
                                            }
                                        });
                                    }
                                });
                                //点击切换
                                $authCodeImg.die().live("click", function(e) {
                                    $authCodeImg.attr("src", codeUrl + "&v=" + Math.random().toString(36).substr(2));
                                    vcodeFlag = false;
                                });
                            }
                            //登录
                            $formSubmit.die().live("click", function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                //延迟执行(enter提交等待接口返回验证码状态)
                                setTimeout(function() {
                                    if (!loginSubmitClick) {
                                        //console.log('正在登录中');
                                        return;
                                    }
                                    //用户名验证							
                                    if (!$userName[0].value) {
                                        if (_userEnter) {
                                            if ($userNameTips.length) {
                                                $userNameTips.html(userTips.t1);
                                            } else {
                                                alert(userTips.t1);
                                            }
                                            $userName.focus();
                                            _userEnter = false;
                                            return false;
                                        } else {
                                            _userEnter = true;
                                            return;
                                        }
                                    } else {
                                        $userNameTips.html(userTips.t0);
                                    }
                                    //密码验证							
                                    if (!$passWord[0].value) {
                                        if (_passwordEnter) {
                                            if ($passWordTips.length) {
                                                $passWordTips.html(userTips.t2);
                                            } else {
                                                alert(userTips.t2);
                                            }
                                            $passWord.focus();
                                            _passwordEnter = false;
                                            return false;
                                        } else {
                                            _passwordEnter = true;
                                            return;
                                        }
                                    } else {
                                        $passWordTips.html(userTips.t0);
                                    }
                                    //验证码验证
                                    if (codeSwitch == "open") {
                                        //验证码输入
                                        if (!$authCode[0].value) {
                                            if ($authCodeTips.length) {
                                                $authCodeTips.html(userTips.t3);
                                            } else {
                                                alert(userTips.t3);
                                            }
                                            $authCode.focus();
                                            return false;
                                        } else {
                                            $authCodeTips.html(userTips.t0);
                                        }
                                        //验证对错
                                        if (!vcodeFlag) {
                                            if ($authCodeTips.length) {
                                                $authCodeTips.html(userTips.t4);
                                            } else {
                                                alert(userTips.t4);
                                            }
                                            $authCode.focus();
                                            //$authCodeImg.attr('src', codeUrl + '&v=' + Math.random().toString(36).substr(2));
                                            vcodeFlag = false;
                                            //失败
                                            return false;
                                        }
                                    }
                                    //提交
                                    //param get
                                    var _enCode_u = $userName[0].value, _enCode_p = $passWord[0].value;
                                    var _enCode_c = codeSwitch == "open" ? $authCode[0].value : "";
                                    //form success GoTo
                                    var _enCode_url = formSucUrl || "";
                                    var _PARAMS = "";
                                    //param encode
                                    _PARAMS = "type=" + submitType;
                                    _PARAMS += "&username=" + encodeURIComponent(_enCode_u) + "&password=" + encodeURIComponent(_enCode_p);
                                    _PARAMS += codeSwitch == "open" ? "&vcode=" + encodeURIComponent(_enCode_c) : "";
                                    _PARAMS += "&goto=" + encodeURIComponent(_enCode_url);
                                    //增加其它隐藏域
                                    for (var _k = 0; _k < othHidden.length; _k++) {
                                        _PARAMS += "&" + othHidden[_k].name + "=" + encodeURIComponent(othHidden[_k].value);
                                    }
                                    //url encode
                                    _PARAMS = encodeURIComponent(_PARAMS);
                                    //加密
                                    _PARAMS = ENCRYPT.enCode(_PARAMS, "ppvaslogin");
                                    //Bug: IE直接跳转无referer
                                    function gotoUrl(url) {
                                        if (document.all) {
                                            var gotoLink = document.createElement("a");
                                            gotoLink.href = url;
                                            document.body.appendChild(gotoLink);
                                            gotoLink.click();
                                        } else {
                                            window.location.href = url;
                                        }
                                    }
                                    switch (submitType) {
                                      case "ajax":
                                        //login
                                        loginSubmitClick = false;
                                        LOAD(ajaxUrl, {
                                            params: _PARAMS
                                        }, function(d) {
                                            loginSubmitClick = true;
                                            if (d && d.status && d.status == 1) {
                                                //登录成功
                                                if ($customCallback == undefined) {
                                                    if (win.loginSuccess && typeof win.loginSuccess == "function") {
                                                        win.loginSuccess.apply(null, arguments);
                                                    }
                                                } else {
                                                    win.customFunc && win.customFunc();
                                                }
                                                //清除errorTip
                                                if ($errorTip.length) $errorTip.html("");
                                            } else {
                                                //登录失败
                                                $authCodeImg.attr("src", codeUrl + "&v=" + Math.random().toString(36).substr(2));
                                                vcodeFlag = false;
                                                //失败
                                                if ($errorTip.length) {
                                                    var _push = d.message || "";
                                                    $errorTip.html(_push);
                                                } else {
                                                    d.message && alert(d.message);
                                                }
                                            }
                                        });
                                        break;

                                      case "form":
                                        loginSubmitClick = false;
                                        //window.location.href = 'http://user.vas.pptv.com/api/login.php?params=' + _PARAMS;
                                        gotoUrl("http://user.vas.pptv.com/api/login.php?params=" + _PARAMS);
                                        break;
                                    }
                                }, 200);
                            });
                        });
                    }
                }
            };
        }();
        CONTROL.SETING();
    }();
    /*
	* 第三方登录(基于jQuery)
	* @Date: 2015-03-24
	* @Author: xiayu chen
	*/
    $(function() {
        var $loginBtn = $(".popupLoginBtn");
        //login btn
        $loginBtn.die().live("click", function(e) {
            e.preventDefault();
            var _this = $(this), _loginUrl = _this.attr("popup-url"), _locationHref = window.location.href;
            window.opW = window.open(_loginUrl + "&url=" + encodeURIComponent(encodeURIComponent(_locationHref)), "_blank", "width=460, height=380, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        });
    });
});