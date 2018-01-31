!function(a, b, c) {
    function d(a, c) {
        this.wrapper = "string" == typeof a ? b.querySelector(a) : a, this.scroller = this.wrapper.children[0], 
        this.scrollerStyle = this.scroller.style, this.options = {
            resizeScrollbars: !0,
            mouseWheelSpeed: 20,
            snapThreshold: .334,
            startX: 0,
            startY: 0,
            scrollY: !0,
            directionLockThreshold: 5,
            momentum: !0,
            bounce: !0,
            bounceTime: 600,
            bounceEasing: "",
            preventDefault: !0,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            HWCompositing: !0,
            useTransition: !0,
            useTransform: !0
        };
        for (var d in c) this.options[d] = c[d];
        this.translateZ = this.options.HWCompositing && h.hasPerspective ? " translateZ(0)" : "", 
        this.options.useTransition = h.hasTransition && this.options.useTransition, this.options.useTransform = h.hasTransform && this.options.useTransform, 
        this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, 
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, 
        this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, 
        this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, 
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, 
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, 
        this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? h.ease[this.options.bounceEasing] || h.ease.circular : this.options.bounceEasing, 
        this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, 
        this.options.tap === !0 && (this.options.tap = "tap"), "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1), 
        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1, 
        this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, 
        this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), 
        this.enable();
    }
    function e(a, c, d) {
        var e = b.createElement("div"), f = b.createElement("div");
        return d === !0 && (e.style.cssText = "position:absolute;z-index:9999", f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"), 
        f.className = "iScrollIndicator", "h" == a ? (d === !0 && (e.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", 
        f.style.height = "100%"), e.className = "iScrollHorizontalScrollbar") : (d === !0 && (e.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", 
        f.style.width = "100%"), e.className = "iScrollVerticalScrollbar"), e.style.cssText += ";overflow:hidden", 
        c || (e.style.pointerEvents = "none"), e.appendChild(f), e;
    }
    function f(c, d) {
        this.wrapper = "string" == typeof d.el ? b.querySelector(d.el) : d.el, this.wrapperStyle = this.wrapper.style, 
        this.indicator = this.wrapper.children[0], this.indicatorStyle = this.indicator.style, 
        this.scroller = c, this.options = {
            listenX: !0,
            listenY: !0,
            interactive: !1,
            resize: !0,
            defaultScrollbars: !1,
            shrink: !1,
            fade: !1,
            speedRatioX: 0,
            speedRatioY: 0
        };
        for (var e in d) this.options[e] = d[e];
        this.sizeRatioX = 1, this.sizeRatioY = 1, this.maxPosX = 0, this.maxPosY = 0, this.options.interactive && (this.options.disableTouch || (h.addEvent(this.indicator, "touchstart", this), 
        h.addEvent(a, "touchend", this)), this.options.disablePointer || (h.addEvent(this.indicator, h.prefixPointerEvent("pointerdown"), this), 
        h.addEvent(a, h.prefixPointerEvent("pointerup"), this)), this.options.disableMouse || (h.addEvent(this.indicator, "mousedown", this), 
        h.addEvent(a, "mouseup", this))), this.options.fade && (this.wrapperStyle[h.style.transform] = this.scroller.translateZ, 
        this.wrapperStyle[h.style.transitionDuration] = h.isBadAndroid ? "0.001s" : "0ms", 
        this.wrapperStyle.opacity = "0");
    }
    var g = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || function(b) {
        a.setTimeout(b, 1e3 / 60);
    }, h = function() {
        function d(a) {
            return g === !1 ? !1 : "" === g ? a : g + a.charAt(0).toUpperCase() + a.substr(1);
        }
        var e = {}, f = b.createElement("div").style, g = function() {
            for (var a, b = [ "t", "webkitT", "MozT", "msT", "OT" ], c = 0, d = b.length; d > c; c++) if (a = b[c] + "ransform", 
            a in f) return b[c].substr(0, b[c].length - 1);
            return !1;
        }();
        e.getTime = Date.now || function() {
            return new Date().getTime();
        }, e.extend = function(a, b) {
            for (var c in b) a[c] = b[c];
        }, e.addEvent = function(a, b, c, d) {
            a.addEventListener(b, c, !!d);
        }, e.removeEvent = function(a, b, c, d) {
            a.removeEventListener(b, c, !!d);
        }, e.prefixPointerEvent = function(b) {
            return a.MSPointerEvent ? "MSPointer" + b.charAt(9).toUpperCase() + b.substr(10) : b;
        }, e.momentum = function(a, b, d, e, f, g) {
            var h, i, j = a - b, k = c.abs(j) / d;
            return g = void 0 === g ? 6e-4 : g, h = a + k * k / (2 * g) * (0 > j ? -1 : 1), 
            i = k / g, e > h ? (h = f ? e - f / 2.5 * (k / 8) : e, j = c.abs(h - a), i = j / k) : h > 0 && (h = f ? f / 2.5 * (k / 8) : 0, 
            j = c.abs(a) + h, i = j / k), {
                destination: c.round(h),
                duration: i
            };
        };
        var h = d("transform");
        return e.extend(e, {
            hasTransform: h !== !1,
            hasPerspective: d("perspective") in f,
            hasTouch: "ontouchstart" in a,
            hasPointer: a.PointerEvent || a.MSPointerEvent,
            hasTransition: d("transition") in f
        }), e.isBadAndroid = /Android /.test(a.navigator.appVersion) && !/Chrome\/\d/.test(a.navigator.appVersion), 
        e.extend(e.style = {}, {
            transform: h,
            transitionTimingFunction: d("transitionTimingFunction"),
            transitionDuration: d("transitionDuration"),
            transitionDelay: d("transitionDelay"),
            transformOrigin: d("transformOrigin")
        }), e.hasClass = function(a, b) {
            var c = new RegExp("(^|\\s)" + b + "(\\s|$)");
            return c.test(a.className);
        }, e.addClass = function(a, b) {
            if (!e.hasClass(a, b)) {
                var c = a.className.split(" ");
                c.push(b), a.className = c.join(" ");
            }
        }, e.removeClass = function(a, b) {
            if (e.hasClass(a, b)) {
                var c = new RegExp("(^|\\s)" + b + "(\\s|$)", "g");
                a.className = a.className.replace(c, " ");
            }
        }, e.offset = function(a) {
            for (var b = -a.offsetLeft, c = -a.offsetTop; a = a.offsetParent; ) b -= a.offsetLeft, 
            c -= a.offsetTop;
            return {
                left: b,
                top: c
            };
        }, e.preventDefaultException = function(a, b) {
            for (var c in b) if (b[c].test(a[c])) return !0;
            return !1;
        }, e.extend(e.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        }), e.extend(e.ease = {}, {
            quadratic: {
                style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fn: function(a) {
                    return a * (2 - a);
                }
            },
            circular: {
                style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                fn: function(a) {
                    return c.sqrt(1 - --a * a);
                }
            },
            back: {
                style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                fn: function(a) {
                    var b = 4;
                    return (a -= 1) * a * ((b + 1) * a + b) + 1;
                }
            },
            bounce: {
                style: "",
                fn: function(a) {
                    return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375;
                }
            },
            elastic: {
                style: "",
                fn: function(a) {
                    var b = .22, d = .4;
                    return 0 === a ? 0 : 1 == a ? 1 : d * c.pow(2, -10 * a) * c.sin(2 * (a - b / 4) * c.PI / b) + 1;
                }
            }
        }), e.tap = function(a, c) {
            var d = b.createEvent("Event");
            d.initEvent(c, !0, !0), d.pageX = a.pageX, d.pageY = a.pageY, a.target.dispatchEvent(d);
        }, e.click = function(a) {
            var c, d = a.target;
            /(SELECT|INPUT|TEXTAREA)/i.test(d.tagName) || (c = b.createEvent("MouseEvents"), 
            c.initMouseEvent("click", !0, !0, a.view, 1, d.screenX, d.screenY, d.clientX, d.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, 0, null), 
            c._constructed = !0, d.dispatchEvent(c));
        }, e;
    }();
    d.prototype = {
        version: "5.1.3",
        _init: function() {
            this._initEvents(), (this.options.scrollbars || this.options.indicators) && this._initIndicators(), 
            this.options.mouseWheel && this._initWheel(), this.options.snap && this._initSnap(), 
            this.options.keyBindings && this._initKeys();
        },
        destroy: function() {
            this._initEvents(!0), this._execEvent("destroy");
        },
        _transitionEnd: function(a) {
            a.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, 
            this._execEvent("scrollEnd")));
        },
        _start: function(a) {
            if ((1 == h.eventType[a.type] || 0 === a.button) && this.enabled && (!this.initiated || h.eventType[a.type] === this.initiated)) {
                !this.options.preventDefault || h.isBadAndroid || h.preventDefaultException(a.target, this.options.preventDefaultException) || a.preventDefault();
                var b, d = a.touches ? a.touches[0] : a;
                this.initiated = h.eventType[a.type], this.moved = !1, this.distX = 0, this.distY = 0, 
                this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this._transitionTime(), 
                this.startTime = h.getTime(), this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, 
                b = this.getComputedPosition(), this._translate(c.round(b.x), c.round(b.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, 
                this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, 
                this.absStartY = this.y, this.pointX = d.pageX, this.pointY = d.pageY, this._execEvent("beforeScrollStart");
            }
        },
        _move: function(a) {
            if (this.enabled && h.eventType[a.type] === this.initiated) {
                this.options.preventDefault && a.preventDefault();
                var b, d, e, f, g = a.touches ? a.touches[0] : a, i = g.pageX - this.pointX, j = g.pageY - this.pointY, k = h.getTime();
                if (this.pointX = g.pageX, this.pointY = g.pageY, this.distX += i, this.distY += j, 
                e = c.abs(this.distX), f = c.abs(this.distY), !(k - this.endTime > 300 && 10 > e && 10 > f)) {
                    if (this.directionLocked || this.options.freeScroll || (e > f + this.options.directionLockThreshold ? this.directionLocked = "h" : f >= e + this.options.directionLockThreshold ? this.directionLocked = "v" : this.directionLocked = "n"), 
                    "h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough) a.preventDefault(); else if ("horizontal" == this.options.eventPassthrough) return void (this.initiated = !1);
                        j = 0;
                    } else if ("v" == this.directionLocked) {
                        if ("horizontal" == this.options.eventPassthrough) a.preventDefault(); else if ("vertical" == this.options.eventPassthrough) return void (this.initiated = !1);
                        i = 0;
                    }
                    i = this.hasHorizontalScroll ? i : 0, j = this.hasVerticalScroll ? j : 0, b = this.x + i, 
                    d = this.y + j, (b > 0 || b < this.maxScrollX) && (b = this.options.bounce ? this.x + i / 3 : b > 0 ? 0 : this.maxScrollX), 
                    (d > 0 || d < this.maxScrollY) && (d = this.options.bounce ? this.y + j / 3 : d > 0 ? 0 : this.maxScrollY), 
                    this.directionX = i > 0 ? -1 : 0 > i ? 1 : 0, this.directionY = j > 0 ? -1 : 0 > j ? 1 : 0, 
                    this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(b, d), 
                    k - this.startTime > 300 && (this.startTime = k, this.startX = this.x, this.startY = this.y);
                }
            }
        },
        _end: function(a) {
            if (this.enabled && h.eventType[a.type] === this.initiated) {
                this.options.preventDefault && !h.preventDefaultException(a.target, this.options.preventDefaultException) && a.preventDefault();
                var b, d, e = (a.changedTouches ? a.changedTouches[0] : a, h.getTime() - this.startTime), f = c.round(this.x), g = c.round(this.y), i = c.abs(f - this.startX), j = c.abs(g - this.startY), k = 0, l = "";
                if (this.isInTransition = 0, this.initiated = 0, this.endTime = h.getTime(), !this.resetPosition(this.options.bounceTime)) {
                    if (this.scrollTo(f, g), !this.moved) return this.options.tap && h.tap(a, this.options.tap), 
                    this.options.click && h.click(a), void this._execEvent("scrollCancel");
                    if (this._events.flick && 200 > e && 100 > i && 100 > j) return void this._execEvent("flick");
                    if (this.options.momentum && 300 > e && (b = this.hasHorizontalScroll ? h.momentum(this.x, this.startX, e, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                        destination: f,
                        duration: 0
                    }, d = this.hasVerticalScroll ? h.momentum(this.y, this.startY, e, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                        destination: g,
                        duration: 0
                    }, f = b.destination, g = d.destination, k = c.max(b.duration, d.duration), this.isInTransition = 1), 
                    this.options.snap) {
                        var m = this._nearestSnap(f, g);
                        this.currentPage = m, k = this.options.snapSpeed || c.max(c.max(c.min(c.abs(f - m.x), 1e3), c.min(c.abs(g - m.y), 1e3)), 300), 
                        f = m.x, g = m.y, this.directionX = 0, this.directionY = 0, l = this.options.bounceEasing;
                    }
                    return f != this.x || g != this.y ? ((f > 0 || f < this.maxScrollX || g > 0 || g < this.maxScrollY) && (l = h.ease.quadratic), 
                    void this.scrollTo(f, g, k, l)) : void this._execEvent("scrollEnd");
                }
            }
        },
        _resize: function() {
            var a = this;
            clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
                a.refresh();
            }, this.options.resizePolling);
        },
        resetPosition: function(a) {
            var b = this.x, c = this.y;
            return a = a || 0, !this.hasHorizontalScroll || this.x > 0 ? b = 0 : this.x < this.maxScrollX && (b = this.maxScrollX), 
            !this.hasVerticalScroll || this.y > 0 ? c = 0 : this.y < this.maxScrollY && (c = this.maxScrollY), 
            b == this.x && c == this.y ? !1 : (this.scrollTo(b, c, a, this.options.bounceEasing), 
            !0);
        },
        disable: function() {
            this.enabled = !1;
        },
        enable: function() {
            this.enabled = !0;
        },
        refresh: function() {
            this.wrapper.offsetHeight;
            this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, 
            this.scrollerWidth = this.scroller.offsetWidth, this.scrollerHeight = this.scroller.offsetHeight, 
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, 
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, 
            this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), 
            this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), 
            this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = h.offset(this.wrapper), 
            this._execEvent("refresh"), this.resetPosition();
        },
        on: function(a, b) {
            this._events[a] || (this._events[a] = []), this._events[a].push(b);
        },
        off: function(a, b) {
            if (this._events[a]) {
                var c = this._events[a].indexOf(b);
                c > -1 && this._events[a].splice(c, 1);
            }
        },
        _execEvent: function(a) {
            if (this._events[a]) {
                var b = 0, c = this._events[a].length;
                if (c) for (;c > b; b++) this._events[a][b].apply(this, [].slice.call(arguments, 1));
            }
        },
        scrollBy: function(a, b, c, d) {
            a = this.x + a, b = this.y + b, c = c || 0, this.scrollTo(a, b, c, d);
        },
        scrollTo: function(a, b, c, d) {
            d = d || h.ease.circular, this.isInTransition = this.options.useTransition && c > 0, 
            !c || this.options.useTransition && d.style ? (this._transitionTimingFunction(d.style), 
            this._transitionTime(c), this._translate(a, b)) : this._animate(a, b, c, d.fn);
        },
        scrollToElement: function(a, b, d, e, f) {
            if (a = a.nodeType ? a : this.scroller.querySelector(a)) {
                var g = h.offset(a);
                g.left -= this.wrapperOffset.left, g.top -= this.wrapperOffset.top, d === !0 && (d = c.round(a.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), 
                e === !0 && (e = c.round(a.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), g.left -= d || 0, 
                g.top -= e || 0, g.left = g.left > 0 ? 0 : g.left < this.maxScrollX ? this.maxScrollX : g.left, 
                g.top = g.top > 0 ? 0 : g.top < this.maxScrollY ? this.maxScrollY : g.top, b = void 0 === b || null === b || "auto" === b ? c.max(c.abs(this.x - g.left), c.abs(this.y - g.top)) : b, 
                this.scrollTo(g.left, g.top, b, f);
            }
        },
        _transitionTime: function(a) {
            if (a = a || 0, this.scrollerStyle[h.style.transitionDuration] = a + "ms", !a && h.isBadAndroid && (this.scrollerStyle[h.style.transitionDuration] = "0.001s"), 
            this.indicators) for (var b = this.indicators.length; b--; ) this.indicators[b].transitionTime(a);
        },
        _transitionTimingFunction: function(a) {
            if (this.scrollerStyle[h.style.transitionTimingFunction] = a, this.indicators) for (var b = this.indicators.length; b--; ) this.indicators[b].transitionTimingFunction(a);
        },
        _translate: function(a, b) {
            if (this.options.useTransform ? this.scrollerStyle[h.style.transform] = "translate(" + a + "px," + b + "px)" + this.translateZ : (a = c.round(a), 
            b = c.round(b), this.scrollerStyle.left = a + "px", this.scrollerStyle.top = b + "px"), 
            this.x = a, this.y = b, this.indicators) for (var d = this.indicators.length; d--; ) this.indicators[d].updatePosition();
        },
        _initEvents: function(b) {
            var c = b ? h.removeEvent : h.addEvent, d = this.options.bindToWrapper ? this.wrapper : a;
            c(a, "orientationchange", this), c(a, "resize", this), this.options.click && c(this.wrapper, "click", this, !0), 
            this.options.disableMouse || (c(this.wrapper, "mousedown", this), c(d, "mousemove", this), 
            c(d, "mousecancel", this), c(d, "mouseup", this)), h.hasPointer && !this.options.disablePointer && (c(this.wrapper, h.prefixPointerEvent("pointerdown"), this), 
            c(d, h.prefixPointerEvent("pointermove"), this), c(d, h.prefixPointerEvent("pointercancel"), this), 
            c(d, h.prefixPointerEvent("pointerup"), this)), h.hasTouch && !this.options.disableTouch && (c(this.wrapper, "touchstart", this), 
            c(d, "touchmove", this), c(d, "touchcancel", this), c(d, "touchend", this)), c(this.scroller, "transitionend", this), 
            c(this.scroller, "webkitTransitionEnd", this), c(this.scroller, "oTransitionEnd", this), 
            c(this.scroller, "MSTransitionEnd", this);
        },
        getComputedPosition: function() {
            var b, c, d = a.getComputedStyle(this.scroller, null);
            return this.options.useTransform ? (d = d[h.style.transform].split(")")[0].split(", "), 
            b = +(d[12] || d[4]), c = +(d[13] || d[5])) : (b = +d.left.replace(/[^-\d.]/g, ""), 
            c = +d.top.replace(/[^-\d.]/g, "")), {
                x: b,
                y: c
            };
        },
        _initIndicators: function() {
            function a(a) {
                for (var b = h.indicators.length; b--; ) a.call(h.indicators[b]);
            }
            var b, c = this.options.interactiveScrollbars, d = "string" != typeof this.options.scrollbars, g = [], h = this;
            this.indicators = [], this.options.scrollbars && (this.options.scrollY && (b = {
                el: e("v", c, this.options.scrollbars),
                interactive: c,
                defaultScrollbars: !0,
                customStyle: d,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenX: !1
            }, this.wrapper.appendChild(b.el), g.push(b)), this.options.scrollX && (b = {
                el: e("h", c, this.options.scrollbars),
                interactive: c,
                defaultScrollbars: !0,
                customStyle: d,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenY: !1
            }, this.wrapper.appendChild(b.el), g.push(b))), this.options.indicators && (g = g.concat(this.options.indicators));
            for (var i = g.length; i--; ) this.indicators.push(new f(this, g[i]));
            this.options.fadeScrollbars && (this.on("scrollEnd", function() {
                a(function() {
                    this.fade();
                });
            }), this.on("scrollCancel", function() {
                a(function() {
                    this.fade();
                });
            }), this.on("scrollStart", function() {
                a(function() {
                    this.fade(1);
                });
            }), this.on("beforeScrollStart", function() {
                a(function() {
                    this.fade(1, !0);
                });
            })), this.on("refresh", function() {
                a(function() {
                    this.refresh();
                });
            }), this.on("destroy", function() {
                a(function() {
                    this.destroy();
                }), delete this.indicators;
            });
        },
        _initWheel: function() {
            h.addEvent(this.wrapper, "wheel", this), h.addEvent(this.wrapper, "mousewheel", this), 
            h.addEvent(this.wrapper, "DOMMouseScroll", this), this.on("destroy", function() {
                h.removeEvent(this.wrapper, "wheel", this), h.removeEvent(this.wrapper, "mousewheel", this), 
                h.removeEvent(this.wrapper, "DOMMouseScroll", this);
            });
        },
        _wheel: function(a) {
            if (this.enabled) {
                a.preventDefault(), a.stopPropagation();
                var b, d, e, f, g = this;
                if (void 0 === this.wheelTimeout && g._execEvent("scrollStart"), clearTimeout(this.wheelTimeout), 
                this.wheelTimeout = setTimeout(function() {
                    g._execEvent("scrollEnd"), g.wheelTimeout = void 0;
                }, 400), "deltaX" in a) 1 === a.deltaMode ? (b = -a.deltaX * this.options.mouseWheelSpeed, 
                d = -a.deltaY * this.options.mouseWheelSpeed) : (b = -a.deltaX, d = -a.deltaY); else if ("wheelDeltaX" in a) b = a.wheelDeltaX / 120 * this.options.mouseWheelSpeed, 
                d = a.wheelDeltaY / 120 * this.options.mouseWheelSpeed; else if ("wheelDelta" in a) b = d = a.wheelDelta / 120 * this.options.mouseWheelSpeed; else {
                    if (!("detail" in a)) return;
                    b = d = -a.detail / 3 * this.options.mouseWheelSpeed;
                }
                if (b *= this.options.invertWheelDirection, d *= this.options.invertWheelDirection, 
                this.hasVerticalScroll || (b = d, d = 0), this.options.snap) return e = this.currentPage.pageX, 
                f = this.currentPage.pageY, b > 0 ? e-- : 0 > b && e++, d > 0 ? f-- : 0 > d && f++, 
                void this.goToPage(e, f);
                e = this.x + c.round(this.hasHorizontalScroll ? b : 0), f = this.y + c.round(this.hasVerticalScroll ? d : 0), 
                e > 0 ? e = 0 : e < this.maxScrollX && (e = this.maxScrollX), f > 0 ? f = 0 : f < this.maxScrollY && (f = this.maxScrollY), 
                this.scrollTo(e, f, 0);
            }
        },
        _initSnap: function() {
            this.currentPage = {}, "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)), 
            this.on("refresh", function() {
                var a, b, d, e, f, g, h = 0, i = 0, j = 0, k = this.options.snapStepX || this.wrapperWidth, l = this.options.snapStepY || this.wrapperHeight;
                if (this.pages = [], this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
                    if (this.options.snap === !0) for (d = c.round(k / 2), e = c.round(l / 2); j > -this.scrollerWidth; ) {
                        for (this.pages[h] = [], a = 0, f = 0; f > -this.scrollerHeight; ) this.pages[h][a] = {
                            x: c.max(j, this.maxScrollX),
                            y: c.max(f, this.maxScrollY),
                            width: k,
                            height: l,
                            cx: j - d,
                            cy: f - e
                        }, f -= l, a++;
                        j -= k, h++;
                    } else for (g = this.options.snap, a = g.length, b = -1; a > h; h++) (0 === h || g[h].offsetLeft <= g[h - 1].offsetLeft) && (i = 0, 
                    b++), this.pages[i] || (this.pages[i] = []), j = c.max(-g[h].offsetLeft, this.maxScrollX), 
                    f = c.max(-g[h].offsetTop, this.maxScrollY), d = j - c.round(g[h].offsetWidth / 2), 
                    e = f - c.round(g[h].offsetHeight / 2), this.pages[i][b] = {
                        x: j,
                        y: f,
                        width: g[h].offsetWidth,
                        height: g[h].offsetHeight,
                        cx: d,
                        cy: e
                    }, j > this.maxScrollX && i++;
                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0), this.options.snapThreshold % 1 === 0 ? (this.snapThresholdX = this.options.snapThreshold, 
                    this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = c.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), 
                    this.snapThresholdY = c.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold));
                }
            }), this.on("flick", function() {
                var a = this.options.snapSpeed || c.max(c.max(c.min(c.abs(this.x - this.startX), 1e3), c.min(c.abs(this.y - this.startY), 1e3)), 300);
                this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, a);
            });
        },
        _nearestSnap: function(a, b) {
            if (!this.pages.length) return {
                x: 0,
                y: 0,
                pageX: 0,
                pageY: 0
            };
            var d = 0, e = this.pages.length, f = 0;
            if (c.abs(a - this.absStartX) < this.snapThresholdX && c.abs(b - this.absStartY) < this.snapThresholdY) return this.currentPage;
            for (a > 0 ? a = 0 : a < this.maxScrollX && (a = this.maxScrollX), b > 0 ? b = 0 : b < this.maxScrollY && (b = this.maxScrollY); e > d; d++) if (a >= this.pages[d][0].cx) {
                a = this.pages[d][0].x;
                break;
            }
            for (e = this.pages[d].length; e > f; f++) if (b >= this.pages[0][f].cy) {
                b = this.pages[0][f].y;
                break;
            }
            return d == this.currentPage.pageX && (d += this.directionX, 0 > d ? d = 0 : d >= this.pages.length && (d = this.pages.length - 1), 
            a = this.pages[d][0].x), f == this.currentPage.pageY && (f += this.directionY, 0 > f ? f = 0 : f >= this.pages[0].length && (f = this.pages[0].length - 1), 
            b = this.pages[0][f].y), {
                x: a,
                y: b,
                pageX: d,
                pageY: f
            };
        },
        goToPage: function(a, b, d, e) {
            e = e || this.options.bounceEasing, a >= this.pages.length ? a = this.pages.length - 1 : 0 > a && (a = 0), 
            b >= this.pages[a].length ? b = this.pages[a].length - 1 : 0 > b && (b = 0);
            var f = this.pages[a][b].x, g = this.pages[a][b].y;
            d = void 0 === d ? this.options.snapSpeed || c.max(c.max(c.min(c.abs(f - this.x), 1e3), c.min(c.abs(g - this.y), 1e3)), 300) : d, 
            this.currentPage = {
                x: f,
                y: g,
                pageX: a,
                pageY: b
            }, this.scrollTo(f, g, d, e);
        },
        next: function(a, b) {
            var c = this.currentPage.pageX, d = this.currentPage.pageY;
            c++, c >= this.pages.length && this.hasVerticalScroll && (c = 0, d++), this.goToPage(c, d, a, b);
        },
        prev: function(a, b) {
            var c = this.currentPage.pageX, d = this.currentPage.pageY;
            c--, 0 > c && this.hasVerticalScroll && (c = 0, d--), this.goToPage(c, d, a, b);
        },
        _initKeys: function(b) {
            var c, d = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            if ("object" == typeof this.options.keyBindings) for (c in this.options.keyBindings) "string" == typeof this.options.keyBindings[c] && (this.options.keyBindings[c] = this.options.keyBindings[c].toUpperCase().charCodeAt(0)); else this.options.keyBindings = {};
            for (c in d) this.options.keyBindings[c] = this.options.keyBindings[c] || d[c];
            h.addEvent(a, "keydown", this), this.on("destroy", function() {
                h.removeEvent(a, "keydown", this);
            });
        },
        _key: function(a) {
            if (this.enabled) {
                var b, d = this.options.snap, e = d ? this.currentPage.pageX : this.x, f = d ? this.currentPage.pageY : this.y, g = h.getTime(), i = this.keyTime || 0, j = .25;
                switch (this.options.useTransition && this.isInTransition && (b = this.getComputedPosition(), 
                this._translate(c.round(b.x), c.round(b.y)), this.isInTransition = !1), this.keyAcceleration = 200 > g - i ? c.min(this.keyAcceleration + j, 50) : 0, 
                a.keyCode) {
                  case this.options.keyBindings.pageUp:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? e += d ? 1 : this.wrapperWidth : f += d ? 1 : this.wrapperHeight;
                    break;

                  case this.options.keyBindings.pageDown:
                    this.hasHorizontalScroll && !this.hasVerticalScroll ? e -= d ? 1 : this.wrapperWidth : f -= d ? 1 : this.wrapperHeight;
                    break;

                  case this.options.keyBindings.end:
                    e = d ? this.pages.length - 1 : this.maxScrollX, f = d ? this.pages[0].length - 1 : this.maxScrollY;
                    break;

                  case this.options.keyBindings.home:
                    e = 0, f = 0;
                    break;

                  case this.options.keyBindings.left:
                    e += d ? -1 : 5 + this.keyAcceleration >> 0;
                    break;

                  case this.options.keyBindings.up:
                    f += d ? 1 : 5 + this.keyAcceleration >> 0;
                    break;

                  case this.options.keyBindings.right:
                    e -= d ? -1 : 5 + this.keyAcceleration >> 0;
                    break;

                  case this.options.keyBindings.down:
                    f -= d ? 1 : 5 + this.keyAcceleration >> 0;
                    break;

                  default:
                    return;
                }
                if (d) return void this.goToPage(e, f);
                e > 0 ? (e = 0, this.keyAcceleration = 0) : e < this.maxScrollX && (e = this.maxScrollX, 
                this.keyAcceleration = 0), f > 0 ? (f = 0, this.keyAcceleration = 0) : f < this.maxScrollY && (f = this.maxScrollY, 
                this.keyAcceleration = 0), this.scrollTo(e, f, 0), this.keyTime = g;
            }
        },
        _animate: function(a, b, c, d) {
            function e() {
                var m, n, o, p = h.getTime();
                return p >= l ? (f.isAnimating = !1, f._translate(a, b), void (f.resetPosition(f.options.bounceTime) || f._execEvent("scrollEnd"))) : (p = (p - k) / c, 
                o = d(p), m = (a - i) * o + i, n = (b - j) * o + j, f._translate(m, n), void (f.isAnimating && g(e)));
            }
            var f = this, i = this.x, j = this.y, k = h.getTime(), l = k + c;
            this.isAnimating = !0, e();
        },
        handleEvent: function(a) {
            switch (a.type) {
              case "touchstart":
              case "pointerdown":
              case "MSPointerDown":
              case "mousedown":
                this._start(a);
                break;

              case "touchmove":
              case "pointermove":
              case "MSPointerMove":
              case "mousemove":
                this._move(a);
                break;

              case "touchend":
              case "pointerup":
              case "MSPointerUp":
              case "mouseup":
              case "touchcancel":
              case "pointercancel":
              case "MSPointerCancel":
              case "mousecancel":
                this._end(a);
                break;

              case "orientationchange":
              case "resize":
                this._resize();
                break;

              case "transitionend":
              case "webkitTransitionEnd":
              case "oTransitionEnd":
              case "MSTransitionEnd":
                this._transitionEnd(a);
                break;

              case "wheel":
              case "DOMMouseScroll":
              case "mousewheel":
                this._wheel(a);
                break;

              case "keydown":
                this._key(a);
                break;

              case "click":
                a._constructed || (a.preventDefault(), a.stopPropagation());
            }
        }
    }, f.prototype = {
        handleEvent: function(a) {
            switch (a.type) {
              case "touchstart":
              case "pointerdown":
              case "MSPointerDown":
              case "mousedown":
                this._start(a);
                break;

              case "touchmove":
              case "pointermove":
              case "MSPointerMove":
              case "mousemove":
                this._move(a);
                break;

              case "touchend":
              case "pointerup":
              case "MSPointerUp":
              case "mouseup":
              case "touchcancel":
              case "pointercancel":
              case "MSPointerCancel":
              case "mousecancel":
                this._end(a);
            }
        },
        destroy: function() {
            this.options.interactive && (h.removeEvent(this.indicator, "touchstart", this), 
            h.removeEvent(this.indicator, h.prefixPointerEvent("pointerdown"), this), h.removeEvent(this.indicator, "mousedown", this), 
            h.removeEvent(a, "touchmove", this), h.removeEvent(a, h.prefixPointerEvent("pointermove"), this), 
            h.removeEvent(a, "mousemove", this), h.removeEvent(a, "touchend", this), h.removeEvent(a, h.prefixPointerEvent("pointerup"), this), 
            h.removeEvent(a, "mouseup", this)), this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper);
        },
        _start: function(b) {
            var c = b.touches ? b.touches[0] : b;
            b.preventDefault(), b.stopPropagation(), this.transitionTime(), this.initiated = !0, 
            this.moved = !1, this.lastPointX = c.pageX, this.lastPointY = c.pageY, this.startTime = h.getTime(), 
            this.options.disableTouch || h.addEvent(a, "touchmove", this), this.options.disablePointer || h.addEvent(a, h.prefixPointerEvent("pointermove"), this), 
            this.options.disableMouse || h.addEvent(a, "mousemove", this), this.scroller._execEvent("beforeScrollStart");
        },
        _move: function(a) {
            var b, c, d, e, f = a.touches ? a.touches[0] : a;
            h.getTime();
            this.moved || this.scroller._execEvent("scrollStart"), this.moved = !0, b = f.pageX - this.lastPointX, 
            this.lastPointX = f.pageX, c = f.pageY - this.lastPointY, this.lastPointY = f.pageY, 
            d = this.x + b, e = this.y + c, this._pos(d, e), a.preventDefault(), a.stopPropagation();
        },
        _end: function(b) {
            if (this.initiated) {
                if (this.initiated = !1, b.preventDefault(), b.stopPropagation(), h.removeEvent(a, "touchmove", this), 
                h.removeEvent(a, h.prefixPointerEvent("pointermove"), this), h.removeEvent(a, "mousemove", this), 
                this.scroller.options.snap) {
                    var d = this.scroller._nearestSnap(this.scroller.x, this.scroller.y), e = this.options.snapSpeed || c.max(c.max(c.min(c.abs(this.scroller.x - d.x), 1e3), c.min(c.abs(this.scroller.y - d.y), 1e3)), 300);
                    (this.scroller.x != d.x || this.scroller.y != d.y) && (this.scroller.directionX = 0, 
                    this.scroller.directionY = 0, this.scroller.currentPage = d, this.scroller.scrollTo(d.x, d.y, e, this.scroller.options.bounceEasing));
                }
                this.moved && this.scroller._execEvent("scrollEnd");
            }
        },
        transitionTime: function(a) {
            a = a || 0, this.indicatorStyle[h.style.transitionDuration] = a + "ms", !a && h.isBadAndroid && (this.indicatorStyle[h.style.transitionDuration] = "0.001s");
        },
        transitionTimingFunction: function(a) {
            this.indicatorStyle[h.style.transitionTimingFunction] = a;
        },
        refresh: function() {
            this.transitionTime(), this.options.listenX && !this.options.listenY ? this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.indicatorStyle.display = this.scroller.hasVerticalScroll ? "block" : "none" : this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none", 
            this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (h.addClass(this.wrapper, "iScrollBothScrollbars"), 
            h.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (h.removeClass(this.wrapper, "iScrollBothScrollbars"), 
            h.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px"));
            this.wrapper.offsetHeight;
            this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = c.max(c.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8), 
            this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth, 
            this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, 
            this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0, this.maxBoundaryX = this.maxPosX), 
            this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX), 
            this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ? (this.indicatorHeight = c.max(c.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), 
            this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, 
            this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, 
            this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), 
            this.maxPosY = this.wrapperHeight - this.indicatorHeight, this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY), 
            this.updatePosition();
        },
        updatePosition: function() {
            var a = this.options.listenX && c.round(this.sizeRatioX * this.scroller.x) || 0, b = this.options.listenY && c.round(this.sizeRatioY * this.scroller.y) || 0;
            this.options.ignoreBoundaries || (a < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = c.max(this.indicatorWidth + a, 8), 
            this.indicatorStyle.width = this.width + "px"), a = this.minBoundaryX) : a > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = c.max(this.indicatorWidth - (a - this.maxPosX), 8), 
            this.indicatorStyle.width = this.width + "px", a = this.maxPosX + this.indicatorWidth - this.width) : a = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, 
            this.indicatorStyle.width = this.width + "px"), b < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = c.max(this.indicatorHeight + 3 * b, 8), 
            this.indicatorStyle.height = this.height + "px"), b = this.minBoundaryY) : b > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = c.max(this.indicatorHeight - 3 * (b - this.maxPosY), 8), 
            this.indicatorStyle.height = this.height + "px", b = this.maxPosY + this.indicatorHeight - this.height) : b = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, 
            this.indicatorStyle.height = this.height + "px")), this.x = a, this.y = b, this.scroller.options.useTransform ? this.indicatorStyle[h.style.transform] = "translate(" + a + "px," + b + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = a + "px", 
            this.indicatorStyle.top = b + "px");
        },
        _pos: function(a, b) {
            0 > a ? a = 0 : a > this.maxPosX && (a = this.maxPosX), 0 > b ? b = 0 : b > this.maxPosY && (b = this.maxPosY), 
            a = this.options.listenX ? c.round(a / this.sizeRatioX) : this.scroller.x, b = this.options.listenY ? c.round(b / this.sizeRatioY) : this.scroller.y, 
            this.scroller.scrollTo(a, b);
        },
        fade: function(a, b) {
            if (!b || this.visible) {
                clearTimeout(this.fadeTimeout), this.fadeTimeout = null;
                var c = a ? 250 : 500, d = a ? 0 : 300;
                a = a ? "1" : "0", this.wrapperStyle[h.style.transitionDuration] = c + "ms", this.fadeTimeout = setTimeout(function(a) {
                    this.wrapperStyle.opacity = a, this.visible = +a;
                }.bind(this, a), d);
            }
        }
    }, d.utils = h, "function" == typeof define && define("pub/iscroll/iscroll", [], function() {
        return d;
    });
}(window, document, Math);