/*
* lottery
* author: xiayu chen
* date: 2014-06-20
*/
define("pub/lottery/lottery", [ "lib/jquery/jquery", "pub/utils/utils" ], function(require, exports, module) {
    var $ = require("lib/jquery/jquery");
    var UTILS = require("pub/utils/utils");
    var noop = function() {};
    var LW = {
        //入口
        init: function(params) {
            this.wraper = params.wraper || "lotteryWrap";
            //容器ID
            this.matchAttr = params.matchAttr;
            //匹配
            this.matchVal = params.matchVal;
            //中奖item
            this.error = params.error || noop;
            this.success = params.success || noop;
            this.initialize();
            this.rotate();
        },
        //初始化
        initialize: function() {
            this.lotteryNum = $("#" + this.wraper).find("ul li").length;
        },
        // //调用接口
        // callAPI: function(){
        // 	var self = this;
        // 	UTILS.load(self.API, {}, function(d){
        // 		if( d && d.status === 1 ){
        // 			self.rotate(false, d.info.ctype, d.msg);
        // 		}else{
        // 			self.error.apply(null, arguments);
        // 		}
        // 	});
        // },
        //抽奖旋转
        rotate: function(hasAward) {
            var self = this, wraper = lotteryCont = $("#" + this.wraper).find("ul li"), subNum = 0, //奖项下标
            timer = 1;
            //执行下标
            //旋转item动作
            function itemExec() {
                wraper.find(".bg").removeClass("none");
                wraper.removeClass("on");
                wraper.eq(subNum).find(".bg").addClass("none");
            }
            if (!!hasAward) {
                var showAwardTimer = setInterval(function() {
                    if (timer > self.lotteryNum) {
                        clearInterval(showAwardTimer);
                        return;
                    }
                    itemExec();
                    //中标停止
                    if (wraper.eq(subNum).attr(self.matchAttr) == self.matchVal) {
                        self.success.apply(null, arguments);
                        wraper.find(".bg").addClass("none");
                        clearInterval(showAwardTimer);
                        return;
                    }
                    subNum++;
                    timer++;
                }, 200);
                return;
            }
            var gotoRotate = setInterval(function() {
                if (timer > self.lotteryNum * 3) {
                    //执行3圈后
                    clearInterval(gotoRotate);
                    self.rotate(true);
                    return false;
                }
                subNum = subNum >= self.lotteryNum ? subNum - self.lotteryNum : subNum;
                itemExec();
                subNum++;
                timer++;
            }, 75);
        }
    };
    return LW;
});