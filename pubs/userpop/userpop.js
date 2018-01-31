/**
 * 
 * @authors mengzhang(mengzhang@pptv.com)
 * @date    2016-12-30 13:08:29
 * @desc	login & register for wap
 */
define("pub/userpop/userpop", [ "lib/jquery/jquery", "pub/load/load", "pub/utils/utils", "pub/encrypt/encrypt" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery"), LOAD = require("pub/load/load"), UTILS = require("pub/utils/utils"), ENCRYPT = require("pub/encrypt/encrypt");
    var win = window;
    var errorTips = {
        username: "请输入用户名",
        mobile: "请输入正确的手机号",
        picCode: "请输入正确的验证码",
        mobileCode: "请输入正确的短信验证码",
        password: "密码为6-20位数字、字母或下划线"
    };
    var repMobile = /^1\d{10}$/, // 验证手机号码的正则表达式
    repPassword = /^\w{6,20}$/, // 验证密码的正则表达式
    repMobileCode = /^\d{6}$/, // 短信验证码的正则表达式
    SysSecond = 60;
    // 重新发送的等待时间   
    var PORT = {
        vcode: "http://user.vas.pptv.com/api/vcode.php",
        // 常规验证码接口
        checkTelAPI: "http://api.user.vas.pptv.com/ajax/sendsms.php",
        // 获取短信验证码接口地址
        regTelAPI: "http://user.vas.pptv.com/api/register_mobile.php",
        // 手机号注册接口
        LoginAPI: "http://user.vas.pptv.com/api/login.php"
    };
    var pop = '		<div class="popup J_popup none">	        <div class="menu">	            <a href="javascript:;" class="J_register_tab">注册</a><a href="javascript:;" class="active J_login_tab">登录</a>	        </div>	        <a href="javascript:void(0);" class="close J_close"><img src="http://res99.vas.pptv.com/mt/app/subject/newyear_2016/dist/v_20161230103508/images/close_2.png" width="100%"></a>	        <div class="register none J_register">	            <p><input type="text"  class="J_register_mobile_input" placeholder="请输入手机号" maxlength="11"></p>	            <p class="picCode-row">	                <input type="text"  class="J_register_picCode_input" placeholder="请输入右侧验证码" maxlength="4">	                <img class="J_register_picCode" src="http://user.vas.pptv.com/api/vcode.php?type=register" alt="图片验证码"/>	            </p>	            <p class="vcode-row">	                <input type="text"  class="J_mobile_code_input" placeholder="请输入短信验证码" maxlength="6">	                <a href="javascript:;" class="send-mobile-btn J_send_mobile_btn">发送验证短信</a>	            </p>	            <p><input type="password" class="J_set_password" placeholder="请设置登录密码" maxlength="20"></p>	            <p><a href="javascript:;"   class="btn register-btn J_register_btn"  data-role="none" >注册</a></p>	            <span class="error-tip J_register_error_tip"></span>	        </div>	        <div class="login J_login">	            <p><input type="text"  class="J_login_mobile_input" placeholder="请输入用户名"></p>	            <p><input type="password" class="J_login_password_input" placeholder="请输入登录密码" maxlength="20"></p>	            <p class="picCode-row">	                <input type="text"  class="J_login_picCode_input" placeholder="请输入右侧验证码" maxlength="4">	                <img class="J_login_picCode" src="http://user.vas.pptv.com/api/vcode.php?type=login" alt="图片验证码">	            </p>	            <p><a  href="javascript:;" class="btn login-btn J_login_btn" >登录</a></p>	            <span class="error-tip J_login_error_tip"></span>	        </div>	    </div>	    <style>	    .none{display: none;}	    .popup{position: fixed; left: 3%; top: 20%; width: 94%; margin: auto; z-index: 10; background: #35373b; border-radius: 5px; padding: 0 0 .5rem 0; } .error-tip{display: inline-block; width: 84%; margin-left: 8%; margin-top: .5rem; color: #ffe65f; font-size: 0.6rem; } .close{width: .8rem; height: .8rem; position: absolute; top: -1.6rem; right: 0.1rem; } .popup p{width: 100%; float: left; position: relative; } input{display: block; width: 84%; float: left; margin: 0 0 .5rem 8%; border: 1px solid #3f4146; line-height: 1.6rem; height: 1.6rem; font-size: .7rem; border-radius: 5px; text-indent: 5px; background: #2f3034; color: #FFF; } .register-btn,.login-btn,.confirm-btn{display: block; width: 84%; float: left; color: #FFF; font-size: .8rem; height: 1.7rem; line-height: 1.7rem; text-align: center; margin: 0 0 0 8%; border-radius: 5px; background: #53565c; } .vcode-row{position: relative; } .send-mobile-btn{position: absolute; top: 0; right: 10%; display: inline-block; color: #5191f2; text-decoration: underline; line-height: 1.6rem; height: 1.6rem; font-size: .7rem; padding-left: .7rem; } .picCode-row img{position: absolute; display: block; width: 3.2rem; height: 1.6rem; top: 1px; right: 8%; border-radius: 0 5px 5px 0; } .menu{width: 100%; float: left; border-bottom: 1px solid #3f4146; background: #212225; line-height: 2rem; margin: 0 0 1rem 0; } .menu a{width: 50%; float:left; color: #999; font-size:.8rem; display: block; text-align: center; } .active{background: #3f4146; color: #FFF; } 	    </style>';
    var USERPOP = function() {
        return {
            init: function(showobj, $mask, cb) {
                // showobj 判断显示登录/注册页面; $mask 弹窗模版; cb 登录注册成功之后的回执函数 
                if (!$(".J_popup")[0]) {
                    $("body").append(pop);
                }
                $popup = $(".J_popup"), // 	登录注册弹层
                $close = $(".J_close"), //  关闭按钮
                $popupMenu = $(".J_popup .menu a"), // 	注册切换按钮
                $registerArea = $(".J_register"), //	注册区
                $loginArea = $(".J_login"), //	登录区
                $register_tab = $(".J_register_tab"), //  注册tab
                $login_tab = $(".J_login_tab"), //  登录tab
                $registerErrorTip = $(".J_register_error_tip"), // 	注册错误提示
                $loginErrorTip = $(".J_login_error_tip");
                //	登录错误提示
                this.bindEvent($mask);
                this.userRegister(cb);
                this.userLogin(cb);
                // 
                switch (showobj) {
                  case "login":
                    $loginArea.show();
                    $registerArea.hide();
                    $login_tab.addClass("active").siblings().removeClass("active");
                    $popup.show();
                    //  登录注册弹层
                    break;

                  case "register":
                    $loginArea.hide();
                    $registerArea.show();
                    $register_tab.addClass("active").siblings().removeClass("active");
                    $popup.show();
                }
            },
            // 事件
            bindEvent: function($mask) {
                var self = this;
                //点击注册&登录切换栏目
                $popupMenu.on("click", function(e) {
                    //切换
                    var index = $(this).index();
                    $popupMenu.removeClass("active");
                    $(this).addClass("active");
                    if (index == 0) {
                        //注册切换
                        $loginArea.hide();
                        $registerArea.show();
                        $registerErrorTip.text("");
                        self.loadPicCode($(".J_register_picCode"), "register");
                        return;
                    }
                    $registerArea.hide();
                    $loginArea.show();
                    $loginErrorTip.text("");
                });
                // 关闭弹窗
                $close.on("click", function() {
                    $mask.fadeOut();
                    $popup.hide();
                });
            },
            //用户注册
            userRegister: function(cb) {
                var self = this, $registerMobileInput = $(".J_register_mobile_input"), // 机号输入框
                $registerPicCodeInput = $(".J_register_picCode_input"), // 片验证码输入框
                $mobileCodeInput = $(".J_mobile_code_input"), // 信验证码输入框
                $setPasswordInput = $(".J_set_password"), // 置登录密码
                $send_mobile_btn = $(".J_send_mobile_btn"), // 发送短信验证码按钮
                $register_btn = $(".J_register_btn"), // 注册按钮
                $register_picCode = $(".J_register_picCode");
                // 注册图形验证码
                //校验手机号
                $registerMobileInput.on("blur", function(e) {
                    var mobileFlag = repMobile.test($(this).val());
                    self.errorTip(mobileFlag, $(this), $registerErrorTip, errorTips.mobile);
                });
                //校验图片验证码
                $registerPicCodeInput.on("blur", function(e) {
                    var picCodeFlag = $.trim($(this).val()).length == 4;
                    self.errorTip(picCodeFlag, $(this), $registerErrorTip, errorTips.picCode);
                });
                //校验短信验证码
                $mobileCodeInput.on("blur", function(e) {
                    var mobileCodeFlag = repMobileCode.test($(this).val());
                    self.errorTip(mobileCodeFlag, $(this), $registerErrorTip, errorTips.mobileCode);
                });
                //校验密码
                $setPasswordInput.on("blur", function(e) {
                    var passwordFlag = repPassword.test($(this).val());
                    self.errorTip(passwordFlag, $(this), $registerErrorTip, errorTips.password);
                });
                //点击发送验证短信
                $send_mobile_btn.on("click", function(e) {
                    var _this = $(this);
                    var registerMobileValue = $registerMobileInput.val(), //用户输入的手机号
                    registerPicCodeValue = $registerPicCodeInput.val();
                    //用户输入的图片验证码
                    var mobileFlag = repMobile.test(registerMobileValue), picCodeFlag = $.trim(registerPicCodeValue).length == 4;
                    if (!mobileFlag) {
                        self.errorTip(mobileFlag, $registerMobileInput, $registerErrorTip, errorTips.mobile);
                        return;
                    }
                    if (!picCodeFlag) {
                        self.errorTip(picCodeFlag, $registerPicCodeInput, $registerErrorTip, errorTips.picCode);
                        return;
                    }
                    if (_this.hasClass("sended")) {
                        return;
                    }
                    //请求验证图片验证码是否正确
                    var pkey = UTILS.roundKey(20);
                    LOAD(PORT.vcode, {
                        type: "register",
                        action: "check",
                        vcode: registerPicCodeValue
                    }, function(d) {
                        if (d && d == 1) {
                            //图片验证码输入正确
                            //请求发送验证码接口
                            LOAD(PORT.checkTelAPI, {
                                username: registerMobileValue,
                                app: "game",
                                type: "pptvzc",
                                index: pkey,
                                phone: registerMobileValue,
                                token: ENCRYPT.enCode(registerMobileValue, pkey),
                                vcode: registerPicCodeValue
                            }, function(d) {
                                console.log(d);
                                if (d && d.status && d.status == 1) {
                                    //请求接口成功
                                    //错误提示隐藏
                                    $registerErrorTip.hide();
                                    //跑秒倒计时
                                    self.runTimeSendCode(_this);
                                    _this.addClass("sended");
                                } else {
                                    //请求接口失败
                                    $registerErrorTip.text(d.message).show();
                                }
                            });
                        } else {
                            //接口错误
                            $registerErrorTip.text(d.message).show();
                        }
                    });
                });
                //点击注册按钮
                $register_btn.on("click", function(e) {
                    var registerMobileValue = $registerMobileInput.val(), //用户输入的手机号
                    registerPicCodeValue = $registerPicCodeInput.val(), //用户输入的图片验证码
                    registerMobileCodeValue = $mobileCodeInput.val(), //用户输入的短信验证码
                    setPasswordValue = $setPasswordInput.val();
                    //用户设置的登录密码
                    var mobileFlag = repMobile.test(registerMobileValue), picCodeFlag = $.trim(registerPicCodeValue).length == 4, mobileCodeFlag = repMobileCode.test(registerMobileCodeValue), passwordFlag = repPassword.test(setPasswordValue);
                    if (!mobileFlag) {
                        self.errorTip(mobileFlag, $registerMobileInput, $registerErrorTip, errorTips.mobile);
                        return;
                    }
                    if (!picCodeFlag) {
                        self.errorTip(picCodeFlag, $registerMobileInput, $registerErrorTip, errorTips.picCode);
                        return;
                    }
                    if (!mobileCodeFlag) {
                        self.errorTip(mobileCodeFlag, $registerMobileInput, $registerErrorTip, errorTips.mobileCode);
                        return;
                    }
                    if (!passwordFlag) {
                        self.errorTip(passwordFlag, $registerMobileInput, $registerErrorTip, errorTips.password);
                        return;
                    }
                    // 生成加密字符串参数
                    var randomkey = UTILS.roundKey(32), encode_passwords = ENCRYPT.enCode(setPasswordValue, randomkey);
                    var params = "&username=" + encodeURIComponent(registerMobileValue);
                    params += "&phonecheckcode=" + encodeURIComponent(registerMobileCodeValue);
                    params += "&password=" + encode_passwords;
                    params += "&pkey=" + encodeURIComponent(randomkey);
                    var enParams = ENCRYPT.enCode(encodeURIComponent(params), "ppvasreg");
                    // 编码加密后的值
                    //先验证图片验证码
                    LOAD(PORT.vcode, {
                        type: "register",
                        action: "check",
                        vcode: registerPicCodeValue
                    }, function(d) {
                        if (d && d == 1) {
                            //图片验证码输入正确
                            //请求注册接口
                            LOAD(PORT.regTelAPI, {
                                params: enParams,
                                vcode: registerPicCodeValue
                            }, function(d) {
                                if (d && d.status && d.status == 1) {
                                    //注册成功
                                    //注册成功
                                    cb && typeof cb == "function" ? cb.apply(null, arguments) : win.location.reload();
                                } else {
                                    //注册不成功
                                    self.errorTip(false, $mobileCodeInput, $registerErrorTip, d.message);
                                }
                            });
                        } else {
                            //接口错误
                            $registerErrorTip.text("验证码错误").show();
                        }
                    });
                });
                $register_picCode.on("click", function() {
                    self.loadPicCode($(this), "register");
                });
            },
            //用户登录
            userLogin: function(cb) {
                var self = this, $loginMobileInput = $(".J_login_mobile_input"), // 用户名输入框
                $loginPasswordInput = $(".J_login_password_input"), // 登录密码输入框
                $loginPicCodeInput = $(".J_login_picCode_input"), // 图片验证码输入框
                $login_btn = $(".J_login_btn"), // 登录按钮
                $login_picCode = $(".J_login_picCode");
                // 登录图形验证码
                // 校验用户名
                $loginMobileInput.on("blur", function() {
                    var loginmobileFlag = $(this).val().length > 0;
                    self.errorTip(loginmobileFlag, $(this), $loginErrorTip, errorTips.username);
                });
                //校验密码
                $loginPasswordInput.on("blur", function(e) {
                    var passwordFlag = repPassword.test($(this).val());
                    self.errorTip(passwordFlag, $(this), $loginErrorTip, errorTips.password);
                });
                //校验图片验证码
                $loginPicCodeInput.on("blur", function(e) {
                    var picCodeFlag = $.trim($(this).val()).length == 4;
                    self.errorTip(picCodeFlag, $(this), $loginErrorTip, errorTips.picCode);
                });
                //点击登录按钮
                $login_btn.on("click", function(e) {
                    var loginMobileValue = $loginMobileInput.val(), //用户输入的用户名
                    loginPasswordValue = $loginPasswordInput.val(), //用户输入的登录密码
                    loginPicCodeValue = $loginPicCodeInput.val();
                    //用户输入的图片验证码
                    var loginmobileFlag = $loginMobileInput.val().length > 0, picCodeFlag = $.trim(loginPicCodeValue).length == 4, passwordFlag = repPassword.test(loginPasswordValue);
                    if (!loginmobileFlag) {
                        self.errorTip(loginmobileFlag, $loginMobileInput, $loginErrorTip, errorTips.username);
                        return;
                    }
                    if (!passwordFlag) {
                        self.errorTip(passwordFlag, $loginPasswordInput, $loginErrorTip, errorTips.password);
                        return;
                    }
                    if (!picCodeFlag) {
                        self.errorTip(picCodeFlag, $loginPicCodeInput, $loginErrorTip, errorTips.picCode);
                        return;
                    }
                    //加密字符串参数
                    var params = "&username=" + encodeURIComponent(loginMobileValue);
                    params += "&vcode=" + encodeURIComponent(loginPicCodeValue);
                    params += "&password=" + encodeURIComponent(loginPasswordValue);
                    params += "&type=ajax";
                    var enParams = ENCRYPT.enCode(encodeURIComponent(params), "ppvaslogin");
                    //先验证图片验证码
                    LOAD(PORT.vcode, {
                        type: "login",
                        action: "check",
                        vcode: loginPicCodeValue
                    }, function(d) {
                        if (d && d == 1) {
                            //图片验证码输入正确
                            //请求登录接口
                            LOAD(PORT.LoginAPI, {
                                params: enParams
                            }, function(d) {
                                if (d && d.status && d.status == 1) {
                                    cb && typeof cb == "function" ? cb.apply(null, arguments) : win.location.href = win.location.href;
                                } else {
                                    //登录失败
                                    $loginErrorTip.text(d.message).show();
                                }
                            });
                        } else {
                            //请求不成功
                            $loginErrorTip.text("图形验证码错误").show();
                        }
                    });
                });
                // 图形验证码切换
                $login_picCode.on("click", function() {
                    self.loadPicCode($(this), "login");
                });
            },
            // 错误提示
            errorTip: function(flag, $inputEle, $errorEle, errorText) {
                if (!flag) {
                    $errorEle.text(errorText);
                } else {
                    $errorEle.text("");
                }
            },
            // 短信倒计时
            runTimeSendCode: function($ele) {
                var resend = setInterval(function() {
                    SysSecond--;
                    if (SysSecond > 0) {
                        $ele.css("textDecoration", "none").text(SysSecond + "秒后重新发送");
                        $ele.attr("disabled", "disabled").css("cursor", "not-allowed");
                        return false;
                    } else {
                        $ele.removeClass("sended");
                        clearInterval(resend);
                        $ele.text("重新发送");
                        $ele.removeAttr("disabled style");
                        SysSecond = 60;
                    }
                }, 1e3);
            },
            //加载图片验证码
            loadPicCode: function($ele, picType) {
                var randomStr = Math.random().toString(36).substr(2);
                //随机字符串
                $ele.attr("src", PORT.vcode + "?type=" + picType + "&" + randomStr);
            }
        };
    }();
    return USERPOP;
});