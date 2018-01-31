/**
 *
 * @authors xiaoanchen (xiaoanchen@pptv.com)
 * @date    2017-03-30
 * @desc    yaguan
 */
import 'base-css';
import 'checkout-css';
import 'modal-css';

import Vue from 'vue';

var bus = new Vue()

//父组件
Vue.component('toggle-btn', {
    template: `\
        <button @click="emitToggle">点我</button>\
    `,
    methods: {
        emitToggle: function () {   //组件自己的方法
            // 用户点击之后，发布信号
            //this.$emit('toggled')   //虽然监听的是组件的自定义事件，但后面触发的这个`toggleBox`方法，是在Vue实例上的

            bus.$emit('anything-event','one','two')
        }
    }
})

Vue.component('listener', {
    template: '<h5>兄弟组件</h5>',
    mounted: function () {
        bus.$on('anything-event', function (data1,data2) {
            //alert('listening on anything event')
            console.log(data1)
            console.log(data2)
        })
    }
})

new Vue({
    el: '#app',
    data: {
        showBox: true
    },
    methods: {
        toggleBox: function () {
            //接收到信号
            this.showBox = !this.showBox;
        }
    }
});
