<template>
    <ol>
        <li v-for="news of list">
            <p class="title">{{ news.title }}</p>
            <p class="date">{{ news.create_at }}</p>
            <p class="author">By: {{ news.author.loginname }}</p>
        </li>
    </ol>
</template>

<style scoped>
    ol {
        margin-left: 2rem;
        list-style: outside decimal;
    }
    li {
        line-height: 1.5;
        padding: 1rem;
        border-bottom: 1px solid #b6b6b6;
    }
    .title {
        font-weight: bold;
        font-size: 1.3rem;
    }
    .date {
        font-size: .8rem;
        color: #d6d6d6;
    }
</style>

<script>
    import reqwest from "reqwest";

    export default{
        data(){
            return{
                list: [],
                limit: 10
            }
        },
        props: {
            page: {
                type: Number,
                default: 1
            },
            trigger: {
              type: Boolean,
              default: true
            }
        },
        mounted: function(){
            this.$nextTick(function () {
                this.get();
            })
        },
        watch: {
            page(val) {
                this.get();
            }
        },
        methods: {
            get: function(){
                let self = this;
                reqwest({
                    url: 'https://cnodejs.org/api/v1/topics',
                    data: {
                        page: self.page,
                        limit: self.limit
                    }
                })
                .then( res=>{
                    res.data.forEach((data)=>{
                        const d = new Date(data.create_at)
                        data.create_at = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
                    })
                    //self.list=self.list.concat(res.data)
                    self.list = res.data
                    setTimeout(function(){
                        self.$emit('update:trigger', true)
                        //self.$nextTick(function () { })
                    },50)

                } )
                .fail( (err, msg)=>{
                    console.log(err);
                    console.log(msg);
                } )
            }
        }
    }
</script>
