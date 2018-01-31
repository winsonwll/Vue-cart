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
import reqwest from "reqwest";


new Vue({
    el: '#addr',
    data: {
        addrList: [],
        limitNum: 3,
        currentIndex:0,
        shippingWay:1
    },
    //计算属性里面的数据会被缓存
    computed:{
        //v-for 过滤
        filterAddr(){
            return this.addrList.slice(0,this.limitNum);    //截取数组  返回新数组 原数组不变
        }

        /*filterAddr: function () {
            return this.addrList.slice(0,this.limitNum);    //截取数组  返回新数组 原数组不变
        }*/
    },
    //2.0 替换ready 钩子函数 生命周期
    //为了确保vue的实例完全编译，完全插入文档流 使用Vue.nextTick / vm.$nextTick
    mounted: function () {
        this.$nextTick(()=>{
            this.getAddr();
        });
    },
    methods: {
        getAddr: function () {
            reqwest({
                url: 'http://game.g.pptv.com/api/action/zt/api_index.php?action=gameInfo&act_id=1000221',
                type: 'jsonp',
                jsonpCallback : 'cb'
            })
            .then( res=>{
                //es6 箭头函数 箭头函数没有它自己的this值，箭头函数内的this值继承自外围作用域
                //语法大体是这样：([函数的形参，多个参数则以逗号分隔]) => [函数返回的值/表达式]
                //另外，箭头函数也可以使用{}来引入函数块语句

                let res2 = {
                    "status":1,
                    "message":"",
                    "result":[
                        {
                            "addressId":"100001",
                            "userName":"JackBean",
                            "streetName":"北京市朝阳区朝阳公园1",
                            "postCode":"100001",
                            "tel":"12345678901",
                            "isDefault":true
                        },
                        {
                            "addressId":"100002",
                            "userName":"JackBean",
                            "streetName":"北京市朝阳区朝阳公园2",
                            "postCode":"100001",
                            "tel":"12345678901",
                            "isDefault":false
                        },
                        {
                            "addressId":"100003",
                            "userName":"JackBean",
                            "streetName":"北京市朝阳区朝阳公园3",
                            "postCode":"100001",
                            "tel":"12345678901",
                            "isDefault":false
                        },
                        {
                            "addressId":"100004",
                            "userName":"JackBean",
                            "streetName":"北京市朝阳区朝阳公园4",
                            "postCode":"100001",
                            "tel":"12345678901",
                            "isDefault":false
                        },
                        {
                            "addressId":"100005",
                            "userName":"JackBean",
                            "streetName":"北京市朝阳区朝阳公园5",
                            "postCode":"100001",
                            "tel":"12345678901",
                            "isDefault":false
                        }
                    ]
                };
                this.addrList = res2.result;
            } )
            .then( res=>{
                    console.log(111);
                }
            )
            .fail( (err, msg)=>{
                console.log(err);
                console.log(msg);
            } )

        },
        loadMore: function () {
            this.limitNum = (this.limitNum ==3) ? this.addrList.length : 3;
        },
        setDefault: function (item) {
            //方法1
            /*this.addrList.forEach(function (item,index) {
                if(item.addressId==addressId){
                    item.isDefault=true;
                }else{
                    item.isDefault=false;
                }
            })*/

            //方法2
            //箭头函数  语法大体是这样：([函数的形参，多个参数则以逗号分隔]) => [函数返回的值/表达式]
            this.addrList.forEach((value,index)=> value.isDefault=false);
            item.isDefault=true;
        }
    }
})