<template>
    <div class="ui-dialog" v-bind:class='dialogStyles'>
        <div class="ui-dialog-cnt">
            <div class="ui-dialog-bd">
                <h4>{{ dialogOptions.title }}</h4>
                <div class="ui-txt-tips">{{ dialogOptions.content }}</div>
            </div>
            <div class="ui-dialog-ft">
                <button type="button" data-role="button">我知道了</button>
            </div>
        </div>
    </div>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    export default{
        props : {
            dialogOptions : {
                type : Object,
                default : false
            }
        },
        data(){
            return{
                msg:'hello vue'
            }
        },
        computed : {
            dialogStyles(){
                return {
                    show : this.dialogOptions.show
                }
            }
        }
    }
</script>
