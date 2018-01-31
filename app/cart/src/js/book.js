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

new Vue({
    el: '#app',
    data: {
        books: books,
        blance: 5000
    },
    computed:{
        wishList: function () {
            return this.books.filter(function (book) {
                return !book.purchased;
            })
        },
        myBooks: function () {
            return this.books.filter(function (book) {
                return book.purchased;
            })
        },
        //`computed`里面的方法会进行缓存，只要方法依赖的数据源不改变，它们就不会被执行
        myBalance: function () {
            let sum = 0;
            this.books.forEach(function (item,index) {
                sum += item.price;
            })
            return this.blance=sum;
        }
    },
    methods: {
        buyBook: function (id) {
            this.books[id].purchased = true;
        }
    }
});
