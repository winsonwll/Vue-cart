/**
 * Created by linlinwang on 2017/5/11 0011.
 */
import 'base-css';
import 'checkout-css';
import 'modal-css';

import Vue from 'vue';
//import VueResource from 'vue-resource';
import reqwest from "reqwest";

//import bootPage from '../components/BootPage.vue'

new Vue({
    el: '#app',
    data: {
        lenArr: [10,50,100],
        pageLen: 5,
        lists: [
            {num: 1, author: 'luozh', contents: 'BootPage是一款支持静态数据和服务器数据的表格分页组件', remark: 'dsds'},
            {num: 2, author: 'luozh', contents: '支持调整每页显示行数和页码显示个数，样式基于bootstrap', remark: 'dsds'},
            {num: 3, author: 'luozh', contents: '<boot-page>标签中async指是否从服务器端获取数据，false为否', remark: 'dsds'},
            {num: 4, author: 'luozh', contents: 'data为静态的表格数据数组；', remark: 'dsds'},
            {num: 5, author: 'luozh', contents: 'lens为每页显示行数的数组', remark: 'dsds'},
            {num: 6, author: 'luozh', contents: 'page-len为可显示的页码数', remark: 'dsds'},
            {num: 7, author: 'luozh', contents: '服务器回传参数为{data:[], page_num: 6}, 其中data为表格数据，page_num为总页数', remark: 'dsds'},
            {num: 8, author: 'luozh', contents: '可以调用this.$refs.page.refresh()刷新表格数据', remark: 'dsds'}
        ], // 表格原始数据，使用服务器数据时无需使用
        tableList: []
    },
    components: {
        bootPage
    },
    events: {
        'data' (data) {
            this.tableList=data
        }
    }
})