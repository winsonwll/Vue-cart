/*
 * js transfrom
 * @param obj {obj}    原生dom对象
 * @param properties  {json}      { translate3d:'220px,10px,0',left:'1em',opacity:0.2,perspective:'400px', rotateY:'30deg'}
 * @param duration {number}      css3持续时间 秒 默认400毫秒
 * @param ease {str}         transition-timing-function  默认linear 支持  cubic-bezier(0.42,0,1,1)写法;
 * @param callback {function}    回调函数
 * @param delay {number}    延迟时间

 */
define("pub/transform/transform", [], function(require, exports, module) {
    var prefix = function() {
        var div = document.createElement("div");
        //建立临时DIV容器
        var cssText = "-webkit-transition:all .1s;-moz-transition:all .1s; -Khtml-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;";
        div.style.cssText = cssText;
        var style = div.style;
        var dom = "";
        if (style.webkitTransition) {
            dom = "webkit";
        }
        if (style.MozTransition) {
            dom = "moz";
        }
        if (style.khtmlTransition) {
            dom = "Khtml";
        }
        if (style.oTransition) {
            dom = "o";
        }
        if (style.msTransition) {
            dom = "ms";
        }
        div = null;
        ////去掉不必要的数据存储，便于垃圾回收
        if (dom) {
            ////style.transition 情况
            return {
                dom: dom,
                lowercase: dom,
                css: "-" + dom + "-",
                js: dom[0].toUpperCase() + dom.substr(1)
            };
        } else {
            return false;
        }
    }();
    //alert(prefix.js);
    var transitionEnd = function() {
        //参考  bootstrap.transition.js
        var el = document.createElement("div");
        var transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            msTransition: "MSTransitionEnd",
            transition: "transitionend"
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }
        el = null;
        //清楚内存
        return false;
    }();
    //alert('支持'+transitionEnd);
    var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
    //变形检测
    var dasherize = function(str) {
        return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    };
    var transform = function(obj, properties, duration, ease, callback, delay) {
        if (!obj) return;
        //参数修正
        if (typeof duration == "function") callback = duration, ease = undefined, duration = 400, 
        delay = delay;
        if (typeof ease == "function") //传参为function(properties,duration，callback)
        callback = ease, ease = undefined, delay = delay;
        if (duration) duration = typeof duration == "number" ? duration : 400;
        if (typeof callback == "number") delay = callback, callback = undefined;
        //没有回调函数 有delay
        delay = typeof delay == "number" ? delay : 0;
        // delay 设置 delay:'none'也可以
        //参数修正
        var nowTransition = prefix.js + "Transition";
        var nowTransform = prefix.js + "Transform";
        var prefixcss = prefix.css;
        if (!prefix.js) {
            nowTransition = "transition";
            nowTransform = "transform";
            prefixcss = "";
        }
        var transitionProperty, transitionDuration, transitionTiming, transitionDelay;
        //过渡
        var key, cssValues = {}, cssProperties, transforms = "";
        // transforms 变形   cssValues设置给DOM的样式
        var transform;
        //变形
        var cssReset = {};
        var css = "";
        var cssProperties = [];
        transform = prefixcss + "transform";
        //变形    cssValues[transform]
        cssReset[transitionProperty = prefixcss + "transition-property"] = cssReset[transitionDuration = prefixcss + "transition-duration"] = cssReset[transitionDelay = prefixcss + "transition-delay"] = cssReset[transitionTiming = prefixcss + "transition-timing-function"] = "";
        // CSS transitions
        for (key in properties) {
            //如果设置 的CSS属性是变形之类的
            if (supportedTransforms.test(key)) transforms += key + "(" + properties[key] + ") "; else cssValues[key] = properties[key], 
            cssProperties.push(dasherize(key));
        }
        //for end
        if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
        if (duration > 0 && typeof properties === "object") {
            cssValues[transitionProperty] = cssProperties.join(", ");
            cssValues[transitionDuration] = duration + "ms";
            cssValues[transitionTiming] = ease || "linear";
            cssValues[transitionDelay] = delay + "ms";
        }
        for (var attr in cssValues) {
            css += dasherize(attr) + ":" + cssValues[attr] + ";";
        }
        obj.style.cssText = obj.style.cssText + ";" + css;
        //加分号 兼容ie
        if (!callback) {
            return;
        }
        //没有回调函数 return
        var fired = false;
        var handler = function() {
            callback && callback.apply(obj, arguments);
            fired = true;
            if (obj.removeEventListener) obj.removeEventListener(transitionEnd, arguments.callee, false);
        };
        if (obj.addEventListener) {
            obj.addEventListener(transitionEnd, handler, false);
        }
        if (!transitionEnd || duration <= 0) {
            //没有  @1 transitionEnd 事件    或者@2 duration为0，即浏览器不支持动画的情况  直接执行动画结束，执行回调。
            setTimeout(function() {
                handler();
            });
            return;
        }
        setTimeout(function() {
            //绑定过事件还做延时处理，是transitionEnd在older Android phones不一定触发
            if (fired) return;
            handler();
        }, duration + delay + 25);
    };
    //end
    // window.transform = transform;
    exports.init = transform;
});