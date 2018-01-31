<template>
    <div>
        <LeftMenu CurrentPath="/home" v-on:child-tell-me="listenToMyChild"></LeftMenu>
        <p>告诉我的内容：{{ childWords }}</p>
        <div id="right">
            <h1>{{ msg }}</h1>
        </div>
    </div>
</template>

<script>
    //相当于
    //var LeftMenu = require('../components/a.vue');

    import LeftMenu from '../components/a.vue'

    //相当于
    //module.export = {}

    export default {
        data: function(){
            return {
                childWords: ''
            }
        },
        props: ['msg'],
        components: {LeftMenu},
        methods: {
            //子组件向父组件传递
            /*listenToMyChild: function(message){
                this.childWords = message;
            }*/
            listenToMyChild(message){
                this.childWords = message;
            }
        }
    }
</script>
<style>
  #right {
    width: 87%;
    float: right;
  }
</style>