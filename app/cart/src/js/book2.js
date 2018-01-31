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

const books = [
    {
        'id'        :0,
        'name'      :'aaa',
        'price'     :160.80,
        'purchased':false
    },{
        'id'        :1,
        'name'      :'bbb',
        'price'     :318.40,
        'purchased':false
    },{
        'id'        :2,
        'name'      :'ccc',
        'price'     :179.22,
        'purchased':false
    },{
        'id'        :3,
        'name'      :'ddd',
        'price'     :111.00,
        'purchased':false
    },{
        'id'        :4,
        'name'      :'eee',
        'price'     :229.22,
        'purchased':false
    }
]


Vue.component('one', {
    template: '<div>这是第一个one</div>'
});
//驼峰标签名  页面上为中划线one-item
Vue.component('oneItem', {
    template: '<div>这是第一个one1-1</div>'
});

//2. 获取动态数据  组件的内容可以从数据获取
Vue.component('two', {
    template: '<div>{{ listItem.name }}</div>',
    data: function(){   //此处data必须是函数
        return {        // 返回的数据类型是对象
            listItem: books[0]
        }
    }
})

//3.1 往slot插入数据 替换slot
Vue.component('three', {
    template: '<div><slot></slot></div>'
})
//3.2 slot默认数据
Vue.component('three-item', {
    template: '<div><slot>此处默认内容</slot></div>'
})

//4 多个slot 往指定slot插入特定内容
Vue.component('four', {
    template: '<div>' +     //vue组件只接收一个root element 所以要在外层包一级
    '<div class="top-nav">' +
    '<slot name="header"></slot>' +
    '</div>' +
    '<div class="main">' +
    '<slot name="content"></slot>' +
    '</div>' +
    '</div>'
})

//5. 组件的自定义属性 组件相当于自定义了一个tag，那可以自定义tag的属性
Vue.component('five', {
    props: ['userName'],  //把自定义属性的值拿过来  （记住是驼峰式）
    template: '<div>{{ upperCaseName }}</div>',
    computed: {
        upperCaseName: function () {
            return this.userName.trim().toUpperCase()
        }
    }
})
//动态的获取自定义属性的值 v-model+v-bind

//6. 组件嵌套使用
Vue.component('six', {
    template:
        `<ul>\
            <three v-for="item in books" :key="item.id">{{ item.name }}</three>\
        </ul>`,
    data: function () {
        return {
            books: books
        }
    }
})


new Vue({
    el: '#app',
    data: {
        userIpt: ''
    }
});
