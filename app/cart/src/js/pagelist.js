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
import List from '../components/List.vue';

new Vue({
    el: '#app',
    components : {
        List
    },
    data: {
        page: 1,
        finish: true,
        up: false
    },
    watch: {
        finish(val, oldVal) {
            if(!oldVal && val && this.up){
                document.body.scrollTop = document.body.scrollHeight
            }
        }
    },
    methods: {
        prev: function () {
            if(this.page===1){
                alert('已经是第一页了')
            }else{
                this.page--;
                this.finish=false;
                this.up=true;
            }
        },
        next: function () {
            this.page++;
            this.finish = false;
            this.up=false;
            document.body.scrollTop = 0
        }
    }
});
