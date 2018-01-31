/**
 * Created by linlinwang on 2017/5/9 0009.
 */

import 'base-css';
import 'checkout-css';
import 'modal-css';

import Vue from 'vue';
import reqwest from "reqwest";

new Vue({
    el: '#list',
    data: {
        message: 'hello world',
        sortparam: '',
        book: {
            id: 0,
            author: '',
            name: '',
            price: ''
        },
        books: [{
            id: 1,
            author: '曹雪芹',
            name: '红楼梦',
            price: 32.0
        }, {
            id: 2,
            author: '施耐庵',
            name: '水浒传',
            price: 30.0
        }, {
            id: '3',
            author: '罗贯中',
            name: '三国演义',
            price: 24.0
        }, {
            id: 4,
            author: '吴承恩',
            name: '西游记',
            price: 20.0
        }]
    },

    computed: {
        orderBysortparam: function () {
            var that = this;
            //return this.books.order(this.sortparam, ['desc', 'asc'])
            return that.books.sort(function (a, b) {
                return a[that.sortparam] > b[that.sortparam] ? 1 : -1;
            })
        },
        sum: function () {
            var total = 0;
            this.books.forEach(function (item,index) {
                total += Number(item.price);
            })
            return total;
        }
    },
    methods: {
        addBook: function () {
            this.book.id = this.books.length+1;
            this.books.push(this.book);
            this.book='';
        },
        delBook: function (index) {
            this.books.splice(index,1);
        },
        sortBy: function (sortparam) {
            this.sortparam = sortparam;
        }
    }
})
