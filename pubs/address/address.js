/**
 * 
 * @authors mengzhang (mengzhang@pptv.com)
 * @date    2016-07-18 09:41:54
 * @desc    实物奖品要求地址填写
 */
define("pub/address/address", [ "lib/jquery/jquery", "pub/load/load" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery"), LOAD = require("pub/load/load");
    var _pushhtml = "";
    var addstatus = false;
    var ADD = function() {
        return {
            init: function(prizename, tc, mask) {
                this.contactTc(tc);
                //插入dom
                this.addStatus(prizename);
                //判断地址填写状态
                this.closeWind();
                //关闭窗口
                this.addressAdd();
            },
            // 载入弹窗
            contactTc: function(tc) {
                if (tc) tc.hide();
                //关闭页面其它弹窗
                _pushhtml = '<style>.none{display:none}.tc_contact{width:90%;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:999;background:#35373b;border-radius:0 0 5px 5px;font:1rem/1.5 yahei,微软雅黑,arial;padding:0 0 2rem 0}.close{width:1rem;height:1rem;position:absolute;top:-1rem;right:0}.close img{vertical-align:top}.add_part_t{width:100%;float:left;text-align:center;color:#FFF;height:2rem;line-height:2rem;background:#212225;border-bottom:1px solid #3f4146;font-size:.8rem;font-weight:bold}.contact_desc{width:90%;float:left;margin:2% 5%;color:#a0b3c1;font-size:.7rem}.addform{width:88%;float:left;margin:0 6%}.addform input,.address{display:block;width:79%;height:1.5rem;line-height:1.5rem;text-indent:.5rem;float:left;border:1px solid #3f4146;background:#2f3034;border-radius:4px;color:#FFF;outline:0;font:.7rem/1.5 yahei,微软雅黑,arial}.add_tr{width:100%;float:left;margin:2% 0 0 0}.add_key{width:20%;float:left;height:1.5rem;line-height:1.5rem;text-align:right;color:#FFF;font-size:.7rem;border-top:1px solid #35373b;border-bottom:1px solid #35373b}.city_choose{width:80%;float:left}.prov,.city{display:block;margin:0 0 2% 0;width:48%;float:left;height:1.6rem;border:1px solid #3f4146;background:#111520;line-height:1.5rem;color:#FFF;border-radius:4px;outline:0;background:#2f3034;font:.7rem/1.5 yahei,微软雅黑,arial}.prov{margin:0 3% 2% 0}.address{width:75%;float:left;height:4rem;line-height:1.3rem;padding:.2em 2% 0;margin:0 0 0 20%;font-size:.7rem;text-indent:0}.prov option,.city option{display:block;height:1rem;line-height:1rem;font-size:.7rem}.addressshow{margin:0 0 5% 0}.add_btn{width:70%;float:left;margin:0 0 0 15%;border-radius:10px;height:1.8rem;line-height:1.8rem;text-align:center;background:#ffcc19}.add_btn a{display:block;width:100%;font-size:1rem;font-weight:bold;color:#a43600;text-decoration:none}.add_btn_ok,.add_btn_giveup{width:41%;float:left;height:1.8rem;line-height:1.8rem;border-radius:10px;margin:0 0 0 6%;text-align:center;background:#ffcc19}.add_btn_ok a,.add_btn_giveup a{display:block;width:100%;float:left;font-size:1rem;font-weight:bold;color:#a43600;text-decoration:none}.add_part_tip{width:80%;float:left;margin:0 0 1% 20%;font-size:.6rem;color:#FFF;visibility:hidden;color:red;line-height:1.5rem}.add_contact_desc,.add_contact_tip{width:90%;float:left;margin:5% 5% 0 5%;color:#FFF;font-size:.6rem}.add_contact_tip{font-size:.8rem;padding:0 0 1rem 0}</style>				<div class="tc_contact J_usercontact none">		            <div class="add_part_t J_cong"></div>		            <div class="content contact_desc">请填写您的联系方式，我们将会在七个工作日内将奖品寄出</div>		            <div class="addform">		                <div class="add_tr"><div class="add_key">姓名：</div><input type="text" class="input_style J_name"></div>		                <div class="add_tr"><div class="add_key">手机号：</div><input type="text" class="input_style J_user_mobile" maxlength="11"></div>		                <div class="add_tr">		                	<div class="add_key">地址：</div>		                	<div class="city_choose">		                		<select class="prov J_prov">		                			<option></option>		                		</select>		                		<select class="city J_city">		                			<option></option>		                		</select>		                	</div>		                	<textarea class="address J_address"></textarea>		                </div>		                <div class="add_part_tip">姓名没有填</div>		            </div>		            <div class="add_btn"><a href="javascript:;" class="J_next">确定</a></div>' + '<div class="close"><img src="http://static.vas.pptv.com/vas/wap/subject/app/beforedown/dist/v_20160706140839/images/close.png" width="100%"></div>' + '</div>		        <div class="tc_contact J_revise none">		            <div class="add_part_t J_result"></div>		            <div class="addform">		                <div class="add_tr"><div class="add_key">姓名：</div><input type="text" class="input_style J_next_name" readonly></div>		                <div class="add_tr"><div class="add_key">手机号：</div><input type="text" class="input_style J_next_mobile" readonly maxlength="11"></div>		                <div class="add_tr">		                	<div class="add_key">地址：</div>		                	<textarea class="address addressshow J_result_address" readonly></textarea>		                </div>		            </div>		            <div class="add_btn_ok"><a href="javascript:;" class="J_send">确认提交</a></div>		            <div class="add_btn_giveup"><a href="javascript:;" class="back J_back">返回修改</a></div>		            <div class="add_contact_desc">*如有疑问请联系客服 : 400-001-2007</div>' + '<div class="close"><img src="http://static.vas.pptv.com/vas/wap/subject/app/beforedown/dist/v_20160706140839/images/close.png" width="100%"></div>' + '</div></div>		        <div class="tc_contact J_ok none">		            <div class="add_part_t J_lasttip_b">信息提交成功</div>		            <div class="add_contact_tip J_lasttip_s">请耐心等待，我们将会在七个工作日内将奖品寄出</div>		            <div class="add_btn"><a href="javascript:;" class="ok">确定</a></div>' + '<div class="close"><img src="http://static.vas.pptv.com/vas/wap/subject/app/beforedown/dist/v_20160706140839/images/close.png" width="100%"></div>' + "</div>";
                $("body").append(_pushhtml);
                // 插入省市选择
                LOAD("http://game.g.pptv.com/api/ajax/addr_info.php", {
                    act: "getAddr"
                }, function(d) {
                    if (d && d.status && d.status == 1) {
                        var area = d.data ? d.data : "";
                        var $prov = $(".prov"), $city = $(".city"), pushprov = "", pushcity = "";
                        var pv = $prov.find("option:eq(0)").html();
                        var ct = $city.find("option:eq(0)").html();
                        var city_key;
                        //一级地区选择
                        $.each(area, function(key, value) {
                            pushprov += '<option value="' + value.name + '" key="' + key + '">' + value.name + "</option>";
                        });
                        $prov.html("").append(pushprov);
                        var $option = $prov.find("option");
                        for (var i = 0; i < $option.length; i++) {
                            if ($option.eq(i).html() == pv) {
                                $option.eq(i).attr("selected", "selected");
                                city_key = $option.eq(i).attr("key");
                            }
                        }
                        if (pv == "") {
                            $prov.find("option:eq(0)").attr("selected", "selected");
                            city_key = 10;
                        }
                        city(city_key);
                        //城市选择
                        function city(i_key) {
                            pushcity = "";
                            var $option_city = $city.find("option");
                            var citys = area[i_key].list;
                            $.each(citys, function(key, value) {
                                pushcity += '<option value="' + value + '" key="' + key + '">' + value + "</option>";
                            });
                            $city.html("").append(pushcity);
                            for (var i = 0; i < $city.find("option").length; i++) {
                                if ($city.find("option").eq(i).html() == ct) {
                                    $city.find("option").eq(i).prop("selected", "selected");
                                }
                            }
                        }
                        //二级联动选择
                        $prov.change(function() {
                            var prov_checked = $(this).find("option:selected").attr("key");
                            city(prov_checked);
                            $city.find("option:eq(0)").attr("selected", "selected");
                        });
                    }
                });
            },
            // 判断用户填写状态
            addStatus: function(prizename) {
                var _self = this;
                var $J_usercontact = $(".J_usercontact"), $J_cong = $(".J_cong"), $J_revise = $(".J_revise"), $J_result = $(".J_result"), $J_next_name = $(".J_next_name"), $J_next_mobile = $(".J_next_mobile"), $J_result_address = $(".J_result_address"), $J_name = $(".J_name"), $J_mobile = $(".J_user_mobile"), $J_prov = $(".J_prov"), $J_city = $(".J_city"), $J_address = $(".J_address");
                LOAD("http://game.g.pptv.com/api/ajax/addr_info.php", {
                    act: "check"
                }, function(d) {
                    if (d && d.status && d.status == 1) {
                        var userinfo = d.data;
                        addstatus = true;
                        var index = userinfo.address.indexOf(","), prov = userinfo.address.substring(0, index), city = userinfo.address.substring(index, userinfo.address.length);
                        //显示用户地址信息以及用户获得的实物奖品
                        $J_revise.show();
                        $J_result.html(prizename);
                        $J_next_name.val(userinfo.name);
                        $J_next_mobile.val(userinfo.phone);
                        $J_result_address.val(prov + city + userinfo.area);
                        // 在表单保存用户信息
                        $J_name.val(userinfo.name);
                        $J_mobile.val(userinfo.phone);
                        $J_prov.val(prov);
                        $J_city.val(city);
                        $J_address.val(userinfo.area);
                    } else if (d.status == 1003) {
                        addstatus = false;
                        //显示地址填写表单以及用户获得的实物奖品
                        $J_usercontact.show();
                        $J_cong.html(prizename);
                    } else {}
                });
            },
            // 填写地址
            addressAdd: function() {
                var $J_usercontact = $(".J_usercontact"), $J_cong = $(".J_cong"), $J_next = $(".J_next"), $J_name = $(".J_name"), $J_mobile = $(".J_user_mobile"), $J_prov = $(".J_prov"), $J_city = $(".J_city"), $J_address = $(".J_address"), $add_part_tip = $(".add_part_tip"), $J_revise = $(".J_revise"), $J_result = $(".J_result"), $J_next_name = $(".J_next_name"), $J_next_mobile = $(".J_next_mobile"), $J_result_address = $(".J_result_address"), $J_send = $(".J_send"), $J_back = $(".J_back"), $J_ok = $(".J_ok"), $J_lasttip_b = $(".J_lasttip_b"), $J_lasttip_s = $(".J_lasttip_s");
                var mobCheck = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
                $J_name.change(function() {
                    $add_part_tip.css("visibility", "hidden");
                });
                $J_mobile.change(function() {
                    $add_part_tip.css("visibility", "hidden");
                });
                $J_address.change(function() {
                    $add_part_tip.css("visibility", "hidden");
                });
                // 点击提交
                $J_next.on("click", function() {
                    if ($J_name.val() == "") {
                        $add_part_tip.css("visibility", "visible").html("请填写您的姓名!");
                        $J_name.focus();
                        return;
                    }
                    if ($J_mobile.val() == "" || !mobCheck.test($J_mobile.val())) {
                        console.log($J_mobile.val());
                        $add_part_tip.css("visibility", "visible").html("请正确填写手机号码！");
                        $J_mobile.focus();
                        return;
                    }
                    if ($J_address.val() == "") {
                        $add_part_tip.css("visibility", "visible").html("请填写详细地址！");
                        $J_address.focus();
                        return;
                    }
                    $J_usercontact.hide();
                    $J_revise.show();
                    $J_result.html("请确认您的收货地址。");
                    $J_next_name.val($J_name.val());
                    $J_next_mobile.val($J_mobile.val());
                    $J_result_address.val($J_prov.val() + $J_city.val() + $J_address.val());
                });
                // 返回修改
                $J_back.on("click", function() {
                    addstatus = false;
                    $J_usercontact.show();
                    $J_revise.hide();
                    $J_cong.html("修改地址");
                });
                //提交
                $J_send.on("click", function() {
                    if (addstatus) {
                        $J_ok.show();
                        $J_revise.hide();
                        $J_lasttip_b.html("信息提交成功");
                        $J_lasttip_s.html("请耐心等待，我们将会在七个工作日内将奖品寄出");
                    } else {
                        LOAD("http://game.g.pptv.com/api/ajax/addr_info.php", {
                            act: "conserve",
                            name: $J_name.val(),
                            phone: $J_mobile.val(),
                            address: $J_prov.val() + "," + $J_city.val(),
                            area: $J_address.val()
                        }, function(d) {
                            $J_ok.show();
                            $J_revise.hide();
                            if (d && d.status && d.status == 1) {
                                $J_lasttip_b.html("信息提交成功");
                                $J_lasttip_s.html("请耐心等待，我们将会在七个工作日内将奖品寄出");
                            } else {
                                $J_lasttip_b.html("信息提交失败");
                                $J_lasttip_s.html(d.message);
                            }
                        });
                    }
                });
            },
            // 关闭窗口以及填写时表单上移
            closeWind: function() {
                $tc_contact = $(".tc_contact");
                $tc_contact.delegate(".close", "click", function() {
                    $tc_contact.hide();
                });
                $tc_contact.delegate(".ok", "click", function() {
                    $tc_contact.hide();
                    window.location.reload();
                });
                $tc_contact.find("input, textarea").on({
                    focus: function() {
                        $tc_contact.css("top", "50%");
                    }
                });
            }
        };
    }();
    return ADD;
});