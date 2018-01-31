<template>
    <div id="left">
        <h1>{{ CurrentPath }}</h1>
        <button @click="clickMe">电我</button>
    </div>
</template>
<script>
    export default {
        data () {           //es6写法
            return {
                CurrentPath: "123",
                msg: 'hello world father'
            }
        },
        methods: {
            clickMe: function(){
                this.$emit('child-tell-me', this.msg);
            }
        }
    }
</script>
<style>
  #left {
    background-color: #324057;
    width: 13%;
    height: 100%;
    position: fixed;
  }

  .left-headers {
    background-color: #7586a0;
    height: 60px;
  }
</style>