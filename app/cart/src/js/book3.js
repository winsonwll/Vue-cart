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

//父组件
Vue.component('page-nav', {
    template: `\
        <div>\
            <div class="btn-group">\
                <a v-for="page in pages" 
                :href="page.hashLink" 
                :class="{\'btn-default\' : !page.selected,\'btn-info\':page.selected }" 
                @click="selectNav(page)">{{ page.name }}</a>\
            </div>\
            <div class="page-detail">\
                <slot></slot>\
            </div>\
        </div>\
    `,
    data: function () {
      return {
          pages: []
      }
    },
    methods: {
        selectNav: function (page) {
            //此方法报错 vue不允许子组件改变父组件的属性 得通过data方法或computed改变
            this.pages.forEach(function (item,index) {
                item.selected=(item.name===page.name)
            })
        }
    },
    created: function () {
        //console.log(this.$children)
        this.pages = this.$children;    //$children  当前实例的直接子组件
    }
})

//子组件
Vue.component('page', {
    template: `\
        <div v-show="selected">\
            <slot></slot>\
        </div>\
    `,
    props: {    //要指定验证规格，需要用对象的形式
        name: {
            type: String,
            required: true
        },
        link: {
            required: true
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            selected: this.active
        }
    },
    computed: {
        hashLink: function () {
            return '#'+this.link;
        }
    }
})

new Vue({
    el: '#app'
});
