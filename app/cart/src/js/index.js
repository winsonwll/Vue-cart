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

//import VueResource from 'vue-resource';
//Vue.use(VueResource);

//全局过滤器   全局可以调用
Vue.filter("money", function (value,type) {
    return "￥ "+value.toFixed(2)+type;
});

new Vue({
    el: '#app',
    data: {
        totalMoney: 0,
        proList: [],
        checkAllFlag:false,
        delFlag:false,
        pindex: 0,
        searchString: '',
        msgs: [
            {
                title:'hello world aaa',
                author:'谢灿勇'
            },
            {
                title:'hello vue bbb',
                author:'谢灿勇'
            },
            {
                title:'i love this way ccc',
                author:"司徒正美"
            }
        ]
    },
    filters: {
        //局部过滤器  当前实例才能调用
        formatMoney(value){
            return "￥ "+value.toFixed(2);
        }
    },
    computed:{
        //计算属性方式来求总和 更加方便 不需要此calcTotalPrice（）方法计算 修改和删除相关项都会自动更新
        Money: function () {
            let money = 0;      //let 块级作用域（{}、for、if）  不用担心临时变量污染到外层的变量
            this.proList.forEach(function (item,index) {
                if(item.checked) {
                    money += item.productPrice*item.productQuantity;
                }
            });
            return "￥ "+money.toFixed(2)+"元";
        },
        searchFor: function(){
            let that = this;
            //搜索下拉框
            if(!that.searchString){
                return;
            }

            that.searchString=that.searchString.trim().toLocaleLowerCase();
            let res = [];

            this.msgs.forEach(function (item,index) {
                if(item.title.toLocaleLowerCase().indexOf(that.searchString) !== -1){
                    res.push(item)
                }
            });

            return res;
        }
    },
    //2.0 替换ready
    //为了确保vue的实例完全编译，完全插入文档流 使用Vue.nextTick / vm.$nextTick
    mounted: function () {
        this.$nextTick(function () {
            //保证dom完全插入文档
            this.cartView();
        })
    },
    methods: {
        cartView: function () {
            //vue-resource方式
            /*_this.$http.jsonp('http://www.dajiao99.com/data/cartData.json',{'id':1234})
            .then(function(res){
                console.log(res);
            })*/

            //reqwest方式
            /*reqwest({
                url: 'http://game.g.pptv.com/api/action/zt/api_index.php?action=gameInfo&act_id=1000221',
                type: 'jsonp',
                jsonpCallback : 'cb',
                success: function (resp) {
                    console.log(resp);
                    console.log(1);
                    //qwery('#content').html(resp.content)
                },
                complete: function (resp) {
                    console.log(resp);
                    console.log(2);
                    //qwery('#hide-this').hide()
                }
            })*/

            reqwest({
                url: 'http://game.g.pptv.com/api/action/zt/api_index.php?action=gameInfo&act_id=1000221',
                type: 'jsonp',
                jsonpCallback : 'cb'
            })
            .then( res=>{
                //es6 箭头函数 this已经指向外层的this了
                let res2 = {
                    "status":1,
                    "result":{
                        "totalMoney":109,
                        "list":[
                            {
                                "productId":"600100002115",
                                "productName":"黄鹤楼香烟",
                                "productPrice":19,
                                "productQuantity":1,
                                "productImage":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg",
                                "parts":[
                                    {
                                        "partsId":"10001",
                                        "partsName":"打火机",
                                        "imgSrc":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg"
                                    }
                                ]
                            },
                            {
                                "productId":"600100002120",
                                "productName":"加多宝",
                                "productPrice":8,
                                "productQuantity":5,
                                "productImage":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg",
                                "parts":[
                                    {
                                        "partsId":"20001",
                                        "partsName":"吸管",
                                        "imgSrc":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg"
                                    }
                                ]
                            },
                            {
                                "productId":"600100002117",
                                "productName":"金装黄鹤楼",
                                "productPrice":25,
                                "productQuantity":2,
                                "productImage":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg",
                                "parts":[
                                    {
                                        "partsId":"10001",
                                        "partsName":"打火机-1",
                                        "imgSrc":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg"
                                    },
                                    {
                                        "partsId":"10002",
                                        "partsName":"打火机-2",
                                        "imgSrc":"http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg"
                                    }
                                ]
                            }
                        ]
                    },
                    "message":""
                };

                //this.totalMoney = res2.result.totalMoney;
                this.proList = res2.result.list;
            } )
            .fail( (err, msg)=>{
                console.log(err);
                console.log(msg);
            } )
        },
        changeMoney: function (pro,way) {
            if(way>0){
                pro.productQuantity++;
            }else{
                pro.productQuantity--;
                if(pro.productQuantity<1){
                    pro.productQuantity=1;
                }
            }

            //this.calcTotalPrice();
        },
        selectedPro: function (item) {
            if(typeof item.checked == 'undefined'){ //判断某个对象中是否存在某个属性
                //vm.$set(obj,key.val)
                //如果data里面没有设置a属性，那么使用set设置a属性让vue监听
                //Vue.set(item,'checked',true);   //全局注册
                this.$set(item,'checked',true); //局部注册 (对象，变量，值)
            }else{
                item.checked=!item.checked;
            }

            //解决一个一个点击全选的问题
            //方法1
            /*let isAll = this.proList.every(function (item,index) {
                return item.checked === true;
            })
            this.checkAllFlag = isAll ? true : false;*/

            //方法2
            let checkAllFlag = true;
            this.proList.forEach(function(item,index){
                checkAllFlag = checkAllFlag && item.checked;
            });
            this.checkAllFlag = checkAllFlag;

            //this.calcTotalPrice();
        },
        checkAll: function (flag) {
            this.checkAllFlag=flag;
            let _this=this;
            
            this.proList.forEach(function (item,index) {
                if(typeof item.checked == 'undefined'){
                    _this.$set(item,'checked',_this.checkAllFlag);
                }else{
                    item.checked=_this.checkAllFlag;
                }
            })

            //this.calcTotalPrice();
        },
        /*calcTotalPrice: function () {
            //使用过滤器方式处理总和时的计算方法
            let _this = this;
            _this.totalMoney = 0;
            this.proList.forEach(function (item,index) {
                if(item.checked){
                    _this.totalMoney += item.productPrice*item.productQuantity;
                }
            })
        },*/
        delPro: function () {
            this.proList.splice(this.pindex,1);   //数组删除 原数组发生了改变
            this.delFlag=false;

            //this.calcTotalPrice();
        }
    }
});
