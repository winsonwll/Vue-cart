/**
 * @User        :  kelvinwang
 * @Date        :  13-07-04
 * @Description :
 */
define("pub/register/register", [ "lib/jquery/jquery", "pub/rsa/rsa" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery"), RSA = require("pub/rsa/rsa");
    var VAS = {};
    //监控代码处理:
    clickTj = typeof clickTj == "undefined" ? function() {} : clickTj;
    clickTj_config = typeof clickTj_config == "undefined" ? {} : clickTj_config;
    //
    gid = typeof gid != "undefined" ? gid : "";
    sid = typeof sid != "undefined" ? sid : 0;
    fcid = typeof fcid != "undefined" ? fcid : 0;
    fccid = typeof fccid != "undefined" ? fccid : 0;
    var $tipsWrap = {
        unTips: $(".J_username_tips"),
        pswTips: $(".J_password_tips"),
        rePswTips: $(".J_repassword_tips"),
        codeTips: $(".J_code_tips"),
        realnameTips: $(".J_realname_tips"),
        cardTips: $(".J_card_tips"),
        paperTips: $(".J_paper_tips")
    };
    var Register = {
        // cache dom
        dom: {
            // 用户名输入框
            $regUN: $("#reg_username"),
            // 密码输入框
            $regPassword: $("#reg_password"),
            // 重复密码输入框
            $regRePsw: $("#reg_psd_rpt"),
            // 验证码输入框
            $code: $("#reg_code"),
            // 真实姓名
            $realName: $("#reg_realname"),
            // 选择证件类型
            $papertyle: $("#reg_papertyle"),
            // 护照
            $paper: $("#reg_paper"),
            // 身份证输入框           
            $card: $("#reg_card"),
            // 验证码图片
            $codeChangeBtn: $("#reg_code_img"),
            // 用户名信息提示框
            $unTips: $tipsWrap.unTips,
            // 密码提示框
            $pswTips: $tipsWrap.pswTips,
            // 重复密码提示框
            $rePswTips: $tipsWrap.rePswTips,
            // 验证码提示框
            $codeTips: $tipsWrap.codeTips,
            // 真实姓名提示框
            $realnameTips: $tipsWrap.realnameTips,
            // 身份证号码提示框
            $cardTips: $tipsWrap.cardTips,
            // 护照号码提示框
            $paperTips: $tipsWrap.paperTips,
            // 勾选协议复选框
            $deal: $("#deal_check"),
            // 勾选协议提示框
            $dealTips: $(".J_deal_tips"),
            // 注册按钮
            $submitBtn: $("#reg_submit"),
            // request status tips wrapper 
            $tips: $("#J_over_time_tip"),
            usernameTips: {
                infor: $tipsWrap.unTips.html(),
                err1: '<i class="tips-error"></i><em>账号过短,至少6字符</em>',
                err2: '<i class="tips-error"></i><em>账号过长,需小于18字</em>',
                err3: '<i class="tips-error"></i><em>该账号已被注册</em>',
                err4: '<i class="tips-error"></i><em>禁止数字开头或纯数字</em>',
                err5: '<i class="tips-error"></i><em>"_"不可连续或在首尾</em>',
                err6: '<i class="tips-error"></i><em>账号不支持中文字符</em>',
                err7: '<i class="tips-error"></i><em>账号不支持这些字符*</em>',
                err8: "正在检测",
                // loading
                err9: '<i class="tips-error"></i><em>账号检测超时</em>',
                // loading
                ok: '<i class="tips-ok"></i>'
            },
            passwordTips: {
                infor: $tipsWrap.pswTips.html(),
                err1: '<i class="tips-error"></i><em>密码过长,需小于18字符</em>',
                err2: '<i class="tips-error"></i><em>密码过短,需6-18字符</em>',
                ok: '<i class="tips-ok"></i>'
            },
            rePswTips: {
                infor: $tipsWrap.rePswTips.html(),
                err1: '<i class="tips-error"></i><em>两次密码不一致</em>',
                ok: '<i class="tips-ok"></i>'
            },
            codeTips: {
                infor: $tipsWrap.codeTips.html(),
                err1: '<i class="tips-error"></i><em>验证码为空</em>',
                ok: '<i class="tips-ok">输入正确</i>'
            },
            realnameTips: {
                infor: $tipsWrap.realnameTips.html(),
                err1: '<i class="tips-error"></i><em>真实姓名填写有误</em>',
                ok: '<i class="tips-ok"></i>'
            },
            cardTips: {
                infor: $tipsWrap.cardTips.html(),
                err1: '<i class="tips-error"></i><em>身份证号码填写有误</em>',
                ok: '<i class="tips-ok"></i>'
            },
            paperTips: {
                infor: $tipsWrap.paperTips.html(),
                err1: '<i class="tips-error"></i><em>护照号码填写有误</em>',
                ok: '<i class="tips-ok"></i>'
            },
            usernameOk: false,
            passwordOk: false,
            repasswordOk: false,
            codeOk: false,
            // 真实姓名验证
            realNameOk: false,
            // 身份证验证
            cardOk: false,
            paperOk: false,
            hasPaper: false,
            hasMail: false,
            // 验证码验证
            hasCode: false,
            hasCard: false,
            hasRealName: false,
            isBack: false
        },
        // loader
        loader: function(options) {
            $.ajax({
                url: options.url,
                dataType: "jsonp",
                jsonp: "cb",
                type: "GET",
                cache: false,
                timeout: options.timeout || 5e3,
                jsonpCallback: options.jsonpCallback,
                success: options.success,
                error: options.error || function(jqXHR, textStatus, throwError) {}
            });
        },
        // 清空上次输入框里的值
        start: function() {},
        // 用户名验证
        checkUN: function() {
            var re = /[^\w]+/, // 特殊字符
            reLine = /^_+|_+$/, // 首尾下划线
            reLine2 = /_{2,}/, // 下划线相邻
            re2 = /[\u4e00-\u9fa5]+/, // 中文
            re3 = /^\d+$/, // 纯数字或者以数字开头
            $unTips = this.dom.$unTips, // 用户名信息提示框
            usernameTips = this.dom.usernameTips, // 用户名信息提示文字
            //statusTips   = Register.statusTips,
            allowCheck = true, // 避免重复请求 
            unCheckRequest;
            // 初始化用户名tips
            $unTips.html(usernameTips.infor);
            var saveErrMsg, tempVal;
            // 临时存储用户名检测错误状态信息,及用户名输入框获取焦点时当前输入值
            Register.dom.$regUN.on({
                focus: function() {
                    tempVal = this.value;
                    $unTips.html(usernameTips.infor);
                },
                blur: function() {
                    if (tempVal == this.value) {
                        $unTips.html(saveErrMsg);
                    }
                },
                change: function() {
                    var sVal = this.value, _len = sVal.length;
                    Register.dom.usernameOk = false;
                    // 用户名含有汉字
                    if (re2.test(sVal)) {
                        $unTips.html(usernameTips.err6);
                        saveErrMsg = usernameTips.err6;
                        // Register.borderHighLight.error($(this));
                        return null;
                    }
                    // 特殊字符
                    if (sVal.match(re)) {
                        var str = usernameTips.err7.replace(/\*/, '"' + sVal.match(re) + '"');
                        // Register.borderHighLight.error($(this));
                        $unTips.html(str);
                        saveErrMsg = str;
                        return null;
                    }
                    // 用户名长度6-30个字符验证
                    if (_len < 6) {
                        $unTips.html(usernameTips.err1);
                        // 账号过短
                        saveErrMsg = usernameTips.err1;
                        return null;
                    }
                    if (_len > 18) {
                        $unTips.html(usernameTips.err2);
                        // 账号过长
                        saveErrMsg = usernameTips.err2;
                        return null;
                    }
                    // 账号开头结尾不能是下划线，下划线间不能相邻
                    if (reLine.test(sVal) || reLine2.test(sVal)) {
                        $unTips.html(usernameTips.err5);
                        saveErrMsg = usernameTips.err5;
                        //  Register.borderHighLight.error($(this));
                        return null;
                    }
                    // 不能是纯数字
                    if (re3.test(sVal)) {
                        $unTips.html(usernameTips.err4);
                        saveErrMsg = usernameTips.err4;
                        // Register.borderHighLight.error($(this));
                        return null;
                    }
                    // 避免重复请求
                    if (!allowCheck) {
                        return false;
                    }
                    allowCheck = false;
                    //statusTips.remove();
                    $unTips.html("");
                    //Register.dom.$tips.html("正在检测账号..").show();
                    // 用户名检测请求返回回调
                    startTime = new Date().getTime();
                    Register.dom.isBack = false;
                    unCheckResponse = function(resp) {
                        Register.dom.isBack = true;
                        // Register.dom.$tips.html("");
                        if (unCheckRequest === null) {
                            return;
                        }
                        // 请求成功,发生监控请求
                        clickTj_config.wait_time = new Date().getTime() - startTime;
                        clickTj_config.type = 23;
                        clickTj();
                        clickTj_config.wait_time = 0;
                        if (resp != 0) {
                            // 账号已被注册
                            $unTips.html(usernameTips.err3);
                            saveErrMsg = usernameTips.err3;
                        } else {
                            $unTips.html(usernameTips.ok);
                            saveErrMsg = usernameTips.ok;
                            //  Register.borderHighLight.ok(Register.dom.$regUN);
                            //Register.dom.$tips.html("<strong class='success'>账号检测通过</strong>").show();
                            // Register.dom.$tips.html("");
                            Register.dom.usernameOk = true;
                        }
                        allowCheck = true;
                    };
                    // $unTips.html(usernameTips.err8);    // show loading
                    // Register.borderHighLight.error(Register.dom.$regUN);
                    unCheckRequest = Register.loader({
                        url: "http://passport.pptv.com/isUserNameExsit.do?username=" + encodeURIComponent(sVal),
                        jsonpCallback: "unCheckResponse",
                        error: function(jqXHR, textStatus) {
                            unCheckRequest = null;
                            Register.dom.isBack = true;
                            clickTj_config.wait_time = 5e3;
                            clickTj_config.type = 24;
                            clickTj();
                            clickTj_config.wait_time = 0;
                            //if(textStatus == "timeout"){
                            // Register.dom.$tips.html("").show();
                            $unTips.html(usernameTips.err9);
                            //  Register.borderHighLight.error(Register.dom.$regUN);
                            //}
                            allowCheck = true;
                        }
                    });
                }
            });
        },
        // 密码验证
        checkPassword: function() {
            var $pswTips = this.dom.$pswTips, // 密码提示框
            // 密码tips初始化
            $regPassword = this.dom.$regPassword;
            // 第一次密码验证
            $pswTips.html(Register.dom.passwordTips.infor);
            $regPassword.on({
                focus: function() {
                    if (this.value == "") {
                        $pswTips.html(Register.dom.passwordTips.infor);
                    }
                },
                change: function() {
                    Register.dom.passwordOk = false;
                    var $pswTips = Register.dom.$pswTips, passwordTips = Register.dom.passwordTips, sVal = this.value;
                    Register.dom.$regRePsw.trigger("blur");
                    if (sVal.length < 6) {
                        $pswTips.html(passwordTips.err2);
                        return false;
                    }
                    if (sVal.length > 18) {
                        $pswTips.html(passwordTips.err1);
                        return false;
                    }
                    $pswTips.html(passwordTips.ok);
                    Register.dom.passwordOk = true;
                }
            });
        },
        // 重复密码验证
        checkRePassword: function() {
            var $rePswTips = this.dom.$rePswTips, // 重复密码提示框  
            rePswTips = Register.dom.rePswTips, // 重复密码提示文字
            // 重复密码输入框
            $regRePsw = this.dom.$regRePsw;
            // $rePswTips.html(rePswTips.infor);
            this.dom.$regRePsw.on({
                blur: function() {
                    Register.dom.repasswordOk = false;
                    var val = Register.dom.$regPassword.val(), repVal = this.value;
                    //   repVal  = Register.dom.$regRePsw.val();
                    // 如果上面密码输入框的长度不对，下面的重复密码输入框的提示信息还是默认的
                    if (val.length < 6 || val.length > 18) {
                        $rePswTips.html(rePswTips.infor);
                        return false;
                    }
                    if (repVal == "") {
                        $rePswTips.html(rePswTips.infor);
                        return false;
                    }
                    if (val !== repVal) {
                        $rePswTips.html(rePswTips.err1);
                        return false;
                    } else {
                        $rePswTips.html(rePswTips.ok);
                        Register.dom.repasswordOk = true;
                    }
                },
                focus: function() {
                    $rePswTips.html(rePswTips.infor);
                }
            });
        },
        // 验证码验证
        checkCode: function() {
            var _dom = this.dom, $code = _dom.$code;
            // 验证码输入框
            if (!$code.length) {
                return false;
            }
            var $codeChangeBtn = _dom.$codeChangeBtn, // 验证码图片
            base = "http://user.vas.pptv.com/api/validate.php?";
            _dom.hasCode = true;
            _dom.codeOk = false;
            function getRandomNum() {
                return new Date().getTime() + Math.random() * 1e9 + "" + Math.random() * 1e9;
            }
            function refreshImg() {
                _dom.$codeChangeBtn.attr("src", base + getRandomNum());
                $code[0].onfocus = "";
            }
            $code[0].onfocus = function() {
                _dom.codeOk = false;
                refreshImg();
            };
            $codeChangeBtn.on("click", function() {
                refreshImg();
            }).click();
            $code.on({
                focus: function() {
                    //_dom.$codeOk = false;
                    _dom.$codeTips.html(_dom.codeTips.infor);
                },
                change: function() {
                    //_dom.$codeOk = false;
                    _dom.codeOk = false;
                    if (this.value == "") {
                        _dom.$codeTips.html(_dom.codeTips.err1);
                        return false;
                    }
                    _dom.codeOk = true;
                },
                blur: function() {
                    if (this.value != "") {
                        _dom.$codeTips.html("");
                    }
                }
            });
        },
        // 真实姓名验证
        checkRealName: function() {
            if (!this.dom.$realName.length) {
                return false;
            }
            var _dom = this.dom, $realnameTips = _dom.$realnameTips, realnameTips = _dom.realnameTips, // 重复密码提示文字
            re = /^[\u4e00-\u9fa5]{2,5}$/;
            // 中文姓名验证
            _dom.hasRealName = true;
            _dom.realNameOk = false;
            _dom.$realName.on({
                focus: function() {
                    $realnameTips.html(realnameTips.infor);
                    if (_dom.$realName.value == "") {
                        $realnameTips.html(realnameTips.err1);
                    }
                },
                blur: function() {
                    _dom.realNameOk = false;
                    if (!re.test(_dom.$realName[0].value)) {
                        $realnameTips.html(realnameTips.err1);
                        return false;
                    }
                    $realnameTips.html(realnameTips.ok);
                    _dom.realNameOk = true;
                }
            });
        },
        // 选择证件类型
        choosePaper: function() {
            var _dom = this.dom, $choose = _dom.$papertyle, $no1 = $(".J_card"), $no2 = $(".J_paper");
            $choose.on("click", ".J_label", function(e) {
                var $this = $(this);
                $this.find("input").attr("checked", true);
                if ($this.attr("data-value") == 1) {
                    $no1.css("display", "block");
                    $no2.css("display", "none");
                    _dom.$card.change();
                    return;
                }
                _dom.$paper.change();
                $no1.css("display", "none");
                $no2.css("display", "block");
            });
        },
        // 验证护照
        checkPaper: function() {
            var _dom = this.dom, $paper = _dom.$paper, $paperTips = _dom.$paperTips, paperTips = _dom.paperTips;
            if (!$paper.length) {
                return false;
            }
            var p = /^[A-Za-z]\d{6,8}$/;
            _dom.hasPaper = true;
            $paper.on({
                focus: function() {
                    $paperTips.html(paperTips.infor);
                },
                blur: function() {
                    if ($paper[0].value == "") {
                        $paperTips.html(paperTips.err1);
                        _dom.cardOk = false;
                    }
                },
                change: function() {
                    var paperResult = p.test(this.value);
                    _dom.cardOk = false;
                    if (paperResult != true) {
                        $paperTips.html(paperTips.err1);
                        return false;
                    }
                    $paperTips.html(paperTips.ok);
                    _dom.cardOk = true;
                }
            });
        },
        // 身份证验证
        checkCard: function() {
            var _dom = this.dom, $card = _dom.$card, $cardTips = _dom.$cardTips, cardTips = _dom.cardTips;
            if (!$card.length) {
                return false;
            }
            // 身份证验证函数
            function checkIdcard(d) {
                d = d.toUpperCase();
                var f = new Array("true", "身份证号码位数不对！", "身份证号码出生日期超出范围或含有非法字符！", "身份证号码校验错误！", "身份证号码中地区编码不正确！");
                var e = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                };
                var d, g, b;
                var c, h;
                var a = new Array();
                a = d.split("");
                if (d.length != 15 && d.length != 18) {
                    return f[1];
                }
                // substr() 的参数指定的是子串的开始位置和长度
                if (d.substr(0, 6) == "000000" || d.substr(0, 6) == "111111" || d.substr(0, 6) == "222222" || d.substr(0, 6) == "333333" || d.substr(0, 6) == "444444" || d.substr(0, 6) == "555555" || d.substr(0, 6) == "666666" || d.substr(0, 6) == "777777" || d.substr(0, 6) == "888888" || d.substr(0, 6) == "999999") {
                    return f[4];
                }
                if (d.substr(0, 6) == "123456" || d.substr(0, 6) == "234567" || d.substr(0, 6) == "345678" || d.substr(0, 6) == "456789" || d.substr(0, 6) == "567890" || d.substr(0, 6) == "012345" || d.substr(0, 6) == "543210" || d.substr(0, 6) == "432109" || d.substr(0, 6) == "321098" || d.substr(0, 6) == "210987" || d.substr(0, 6) == "109876" || d.substr(0, 6) == "098765" || d.substr(0, 6) == "987654" || d.substr(0, 6) == "876543" || d.substr(0, 6) == "765432") {
                    return f[4];
                }
                if (d.substr(0, 6) == "121212" || d.substr(0, 6) == "131313" || d.substr(0, 6) == "141414" || d.substr(0, 6) == "151515" || d.substr(0, 6) == "161616" || d.substr(0, 6) == "171717" || d.substr(0, 6) == "181818" || d.substr(0, 6) == "191919" || d.substr(0, 6) == "101010") {
                    return f[4];
                }
                if (d.substr(0, 6) == "212121" || d.substr(0, 6) == "232323" || d.substr(0, 6) == "242424" || d.substr(0, 6) == "252525" || d.substr(0, 6) == "262626" || d.substr(0, 6) == "272727" || d.substr(0, 6) == "282828" || d.substr(0, 6) == "292929" || d.substr(0, 6) == "202020") {
                    return f[4];
                }
                if (d.substr(0, 6) == "313131" || d.substr(0, 6) == "323232" || d.substr(0, 6) == "343434" || d.substr(0, 6) == "353535" || d.substr(0, 6) == "363636" || d.substr(0, 6) == "373737" || d.substr(0, 6) == "383838" || d.substr(0, 6) == "393939" || d.substr(0, 6) == "303030") {
                    return f[4];
                }
                if (d.substr(0, 6) == "414141" || d.substr(0, 6) == "424242" || d.substr(0, 6) == "434343" || d.substr(0, 6) == "454545" || d.substr(0, 6) == "464646" || d.substr(0, 6) == "474747" || d.substr(0, 6) == "484848" || d.substr(0, 6) == "494949" || d.substr(0, 6) == "404040") {
                    return f[4];
                }
                if (d.substr(0, 6) == "515151" || d.substr(0, 6) == "525252" || d.substr(0, 6) == "535353" || d.substr(0, 6) == "545454" || d.substr(0, 6) == "565656" || d.substr(0, 6) == "575757" || d.substr(0, 6) == "585858" || d.substr(0, 6) == "595959" || d.substr(0, 6) == "505050") {
                    return f[4];
                }
                if (d.substr(0, 6) == "616161" || d.substr(0, 6) == "626262" || d.substr(0, 6) == "636363" || d.substr(0, 6) == "646464" || d.substr(0, 6) == "656565" || d.substr(0, 6) == "676767" || d.substr(0, 6) == "686868" || d.substr(0, 6) == "696969" || d.substr(0, 6) == "606060") {
                    return f[4];
                }
                if (d.substr(0, 6) == "717171" || d.substr(0, 6) == "727272" || d.substr(0, 6) == "737373" || d.substr(0, 6) == "747474" || d.substr(0, 6) == "757575" || d.substr(0, 6) == "767676" || d.substr(0, 6) == "787878" || d.substr(0, 6) == "797979" || d.substr(0, 6) == "707070") {
                    return f[4];
                }
                if (d.substr(0, 6) == "818181" || d.substr(0, 6) == "828282" || d.substr(0, 6) == "838383" || d.substr(0, 6) == "848484" || d.substr(0, 6) == "858585" || d.substr(0, 6) == "868686" || d.substr(0, 6) == "878787" || d.substr(0, 6) == "898989" || d.substr(0, 6) == "808080") {
                    return f[4];
                }
                if (d.substr(0, 6) == "919191" || d.substr(0, 6) == "929292" || d.substr(0, 6) == "939393" || d.substr(0, 6) == "949494" || d.substr(0, 6) == "959595" || d.substr(0, 6) == "969696" || d.substr(0, 6) == "979797" || d.substr(0, 6) == "989898" || d.substr(0, 6) == "909090") {
                    return f[4];
                }
                if (e[parseInt(d.substr(0, 2))] == null) {
                    return f[4];
                }
                switch (d.length) {
                  case 15:
                    if ((parseInt(d.substr(6, 2)) + 1900) % 4 == 0 || (parseInt(d.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(d.substr(6, 2)) + 1900) % 4 == 0) {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
                    } else {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
                    }
                    if (ereg.test(d)) {
                        return f[0];
                    } else {
                        return f[2];
                    }
                    break;

                  case 18:
                    if (parseInt(d.substr(6, 4)) % 4 == 0 || parseInt(d.substr(6, 4)) % 100 == 0 && parseInt(d.substr(6, 4)) % 4 == 0) {
                        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
                    } else {
                        ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;
                    }
                    if (ereg.test(d)) {
                        c = (parseInt(a[0]) + parseInt(a[10])) * 7 + (parseInt(a[1]) + parseInt(a[11])) * 9 + (parseInt(a[2]) + parseInt(a[12])) * 10 + (parseInt(a[3]) + parseInt(a[13])) * 5 + (parseInt(a[4]) + parseInt(a[14])) * 8 + (parseInt(a[5]) + parseInt(a[15])) * 4 + (parseInt(a[6]) + parseInt(a[16])) * 2 + parseInt(a[7]) * 1 + parseInt(a[8]) * 6 + parseInt(a[9]) * 3;
                        g = c % 11;
                        h = "F";
                        b = "10X98765432";
                        h = b.substr(g, 1);
                        if (h == a[17]) {
                            return f[0];
                        } else {
                            return f[3];
                        }
                    } else {
                        return f[2];
                    }
                    break;

                  default:
                    return f[1];
                    break;
                }
            }
            _dom.hasPaper = true;
            _dom.hasCard = true;
            _dom.cardOk = false;
            $card.on({
                focus: function() {
                    $cardTips.html(cardTips.infor);
                },
                blur: function() {
                    if ($card[0].value == "") {
                        $cardTips.html(cardTips.err1);
                    }
                },
                change: function() {
                    var cardResult = checkIdcard(this.value);
                    _dom.cardOk = false;
                    if (cardResult != "true") {
                        $cardTips.html("<i class='tips-error'></i><em>" + cardResult + "</em>");
                        return false;
                    }
                    $cardTips.html(cardTips.ok);
                    _dom.cardOk = true;
                }
            });
        },
        // 提交注册表单
        doRegister: function() {
            var allowSubmit = true, registerRequest;
            this.dom.$submitBtn.on({
                click: function(event) {
                    var _dom = Register.dom, that = this;
                    event.preventDefault();
                    //clickTj_config.reg_infomation = clickTj_config.getInfo();
                    clickTj_config.type = 13;
                    clickTj();
                    clickTj_config.reg_infomation = 0;
                    //Register.statusTips.remove();
                    /* 用户未输入任何信息直接点提交提示 */
                    // 用户名验证
                    // console.log("22:",_dom.usernameOk,_dom.passwordOk,_dom.repasswordOk ,_dom.cardOk,_dom.codeOk,_dom.realNameOk);
                    if (!_dom.usernameOk) {
                        if (_dom.$regUN[0].value == "") {
                            _dom.$unTips.html(_dom.usernameTips.err1);
                        }
                        /* if(Register.dom.isBack){
                            alert(_dom.$unTips.text());  //用户名信息提示框
                        }*/
                        return null;
                    }
                    // 密码验证
                    if (!_dom.passwordOk) {
                        if (_dom.$regPassword[0].value == "") {
                            _dom.$pswTips.html(_dom.passwordTips.err2);
                        }
                        //alert(_dom.$pswTips.text());
                        return null;
                    }
                    // 重复密码验证
                    if (!_dom.repasswordOk) {
                        if (_dom.$regRePsw[0].value == "") {
                            _dom.$rePswTips.html(_dom.rePswTips.err1);
                        }
                        //alert(_dom.$rePswTips.text());
                        return null;
                    }
                    // 验证码检测
                    if (_dom.hasCode && !_dom.codeOk) {
                        if (_dom.$code[0].value == "") {
                            _dom.$codeTips.html(_dom.codeTips.err1);
                        }
                        //alert(_dom.$codeTips.text());
                        return null;
                    }
                    // 真实姓名验证
                    if (_dom.hasRealName && !_dom.realNameOk) {
                        if (_dom.$realName[0].value == "") {
                            _dom.$realnameTips.html(_dom.realnameTips.err1);
                        }
                        return null;
                    }
                    // 护照 身份证验证
                    if (_dom.hasCard && !_dom.cardOk) {
                        if (_dom.$paper.is(":visible")) {
                            _dom.$paper.change();
                        } else if (_dom.$card.is(":visible")) {
                            _dom.$card.change();
                        }
                        return null;
                    }
                    // 身份证验证验证
                    /*if(_dom.hasCard && !_dom.cardOk){
                        if(_dom.$card[0].value == ""){
                            _dom.$cardTips.html(_dom.cardTips.err1);
                        }
                        return null;
                    }*/
                    // 协议检测
                    if (_dom.$deal.length && !_dom.$deal.prop("checked")) {
                        alert("请勾选协议后再注册");
                        return null;
                    }
                    if (_dom.$unTips.html() == _dom.usernameTips.err8) {
                        //_dom.$tips.show().html("账号检测中...");
                        //Register.borderHighLight.error(Register.dom.$regUN);
                        return null;
                    }
                    //if( _dom.cardOk && _dom.codeOk && _dom.realNameOk){
                    var param = [ "username=" + encodeURIComponent(_dom.$regUN[0].value), "password=" + encodeURIComponent(_dom.$regPassword[0].value) ];
                    if (_dom.$code.length !== 0) {
                        param.push("realname=" + encodeURIComponent(_dom.$realName.val()));
                    }
                    if (_dom.$realName.length !== 0) {
                        param.push("code=" + encodeURIComponent(_dom.$code.val()));
                    }
                    if (_dom.$code.length == 0 && _dom.$card.length == 0 && _dom.$realName.length == 0) {
                        param.push("type=simple");
                    }
                    param.push("from=guest");
                    param.push("gid=" + gid);
                    param.push("sid=" + sid);
                    param.push("fcid=" + fcid);
                    param.push("fccid=" + fccid);
                    if (_dom.hasMail) {
                        param.push("mail=" + _dom.$mail[0].value);
                    }
                    if (_dom.hasCode) {
                        param.push("code=" + _dom.$code[0].value);
                    }
                    // 根据 type 判断 是获得 paper 还是 card
                    var type = $("#reg_papertyle").find("input:checked").attr("data-type");
                    var v = type == 1 ? _dom.$card.val() : _dom.$paper.val();
                    if (_dom.hasCard) {
                        param.push("idtype=" + type);
                    }
                    if (_dom.$card.length !== 0) {
                        param.push("idcard=" + v);
                    }
                    if (!allowSubmit) {
                        return false;
                    }
                    allowSubmit = false;
                    // Register.statusTips.loading();
                    // 注册返回回调
                    reg_start_time = new Date().getTime();
                    window.registerResponse = function(resp) {
                        allowSubmit = true;
                        $("#reg_submit").removeClass("no");
                        // if( registerRequest === null ){
                        //     return;
                        // }
                        clickTj_config.wait_time = new Date().getTime() - reg_start_time;
                        clickTj_config.type = 28;
                        clickTj();
                        clickTj_config.wait_time = 0;
                        // Register.statusTips.remove();
                        if (resp.status === 0) {
                            alert(resp.message);
                        } else if (resp.status == 1) {
                            // 注册页面 成功注册后执行的函数
                            if (typeof gamesRegSuccess != "undefined") {
                                window.gamesRegSuccess(resp);
                                return false;
                            }
                            // 弹出层里的注册 成功注册后执行的函数
                            $(that).closest(".J_layers").hide();
                        }
                    };
                    $("#reg_submit").addClass("no");
                    /*
                        registerRequest = Register.loader({
                            url           : "http://user.vas.pptv.com/api/get/reg.php?app=game&" + param.join("&"),
                            timeout       : 10000,
                            jsonpCallback : "registerResponse",
                            success : function(resp) {
                                if(resp.status && typeof _regSuccess){
                                    _regSuccess();
                                }
                            },
                            error : function(jqXHR,textStatus){
                                registerRequest = null;

                                // 数据监控代码
                                clickTj_config.wait_time = 10000;
                                clickTj_config.type = 29;
                                clickTj();
                                clickTj_config.wait_time = 0;

                                allowSubmit = true;

                            }
                        });
                        */
                    /*
                        * 防恶意注册
                        * @Date: 2015-04-10
                        * @Author: xiayu chen
                        * {
                        */
                    //十六进制公钥  
                    var pubKey = "C5628B393E3CAE2526588959E472F9DAD19A6C72818A86E519518237AB62CC68B08F17C433E7E251AC161C978B4B9D21DD998EB2C38464E666E7528F6322B7287F5CF2209B40B2DF98F0DFAFDA4AC09648EEBE767B1B1B9501E8E2F9CBA836E5293F80F47A513DE68D4025C126B5E20E46C67724E9B6EE7EAE9C60394F1A5CD7";
                    //传参
                    var _sign = "", _tm = "", _key = "";
                    //需要加载rsa.js,公钥使用此DEMO种的pubKey即可
                    var _signi = encryptedRsa(pubKey, encodeURIComponent(_dom.$regUN[0].value));
                    //第一次请求，请求加密函数和关键密钥及时间戳
                    $.ajax({
                        type: "post",
                        url: "http://user.vas.pptv.com/api/ajax/ppepGet.php?frp=" + encodeURIComponent(_dom.$regUN[0].value) + "&sign=" + _signi,
                        dataType: "jsonp",
                        jsonp: "callback",
                        //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                        success: function(rtn) {
                            //加载后端输出的JS函数
                            eval(rtn.data.js);
                            //上面执行完以后就可以调用encrypted函数对所要加密的字符串进行加密,加密后的值放入sign参数，在下次请求注册时使用
                            _sign = encrypted(encodeURIComponent(_dom.$regUN[0].value) + encodeURIComponent(_dom.$regPassword[0].value));
                            //时间戳，请求注册时要传到后端
                            _tm = rtn.data.ppep_tm;
                            //关键密钥,请求注册时要传到后端
                            _key = rtn.data.ppep_key;
                            //注册请求
                            $.ajax({
                                type: "get",
                                dataType: "jsonp",
                                url: "http://user.vas.pptv.com/api/get/reg_enc.php",
                                dataType: "jsonp",
                                jsonp: "registerResponse",
                                data: {
                                    f: "web",
                                    app: "game",
                                    cb: "registerResponse",
                                    ck_code: 1,
                                    username: encodeURIComponent(_dom.$regUN[0].value),
                                    password: encryptedRsa(pubKey, encodeURIComponent(_dom.$regPassword[0].value)),
                                    sign: _sign,
                                    ppep_tm: _tm,
                                    ppep_key: _key,
                                    realname: _dom.$code.length !== 0 ? _dom.$realName.val() : "",
                                    type: _dom.$code.length == 0 && _dom.$card.length == 0 && _dom.$realName.length == 0 ? "simple" : "",
                                    form: "guest",
                                    gid: gid,
                                    sid: sid,
                                    mail: _dom.hasMail ? _dom.$mail[0].value : "",
                                    code: _dom.$card.length !== 0 ? _dom.$code[0].value : "",
                                    idtype: _dom.hasCard ? type : "",
                                    idcard: _dom.$card.length !== 0 ? v : "",
                                    fcid: fcid,
                                    fccid: fccid
                                },
                                success: function(resp) {
                                    if (resp.status && typeof _regSuccess) {
                                        _regSuccess();
                                    }
                                },
                                error: function(jqXHR, textStatus) {
                                    registerRequest = null;
                                    // 数据监控代码
                                    clickTj_config.wait_time = 1e4;
                                    clickTj_config.type = 29;
                                    clickTj();
                                    clickTj_config.wait_time = 0;
                                    allowSubmit = true;
                                }
                            });
                        },
                        error: function(httpReq, status, exception) {
                            alert(status + " " + exception);
                        }
                    });
                    /*
                        * }
                        */
                    // }
                    return false;
                }
            });
        },
        // 状态提醒
        statusTips: {
            init: function() {
                var error1 = $(".register .main p em"), error2 = $(".md_reg em");
                var color = !error1 && !error2 ? "black" : error1 ? error1.css("color") : error2.css("color");
                Register.dom.$submitBtn.css("overflow", "hidden");
                Register.dom.$tips.css("color", "red");
            },
            loading: function() {
                Register.dom.$tips.html("注册中..").show().on("click", function(event) {
                    event.stopPropagation();
                });
            },
            busy: function() {
                Register.dom.$tips.html("连接超时，请重试").show();
            },
            remove: function() {
                Register.dom.$tips.html("").hide();
            }
        },
        // 回车登录.
        enterLogin: function() {
            $("input").on("keyup", function(event) {
                if (event.which == 13) {
                    Register.dom.$submitBtn.trigger("click");
                    event.preventDefault();
                }
            });
        },
        // 函数调用
        init: function() {
            // 清空数据
            this.start();
            // 用户名验证
            this.checkUN();
            // 密码验证
            this.checkPassword();
            // 重复密码验证
            this.checkRePassword();
            // 验证码验证
            this.checkCode();
            //真实姓名验证
            this.checkRealName();
            this.choosePaper();
            //护照验证
            this.checkPaper();
            //身份证验证
            this.checkCard();
            // 提交注册表单
            this.doRegister();
            // 回车注册或登陆
            this.enterLogin();
        }
    };
    VAS.Register = Register;
    window.VAS = VAS;
    // 注册代码调用
    $(function() {
        Register.init();
    });
});