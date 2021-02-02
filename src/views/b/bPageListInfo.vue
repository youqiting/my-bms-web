<template>
    <div>
        bPageListInfo

        <div>
            {{route}}
        </div>
        <p class="color-warn" @click="toNext()">二级的list-info-detail</p>
    </div>
</template>
<script>
export default {
    name:"bPageListInfo",
    data(){
        return{
            route: JSON.stringify(this.$route.params)
        }
    },
    created(){
        
    },
    methods:{
        toNext(){
            this.$router.push({path:"/bPage/b/list/info/detail/123",query:{
                infoId: 11111
            }})
        }
        
    }
}
</script>
<style lang="scss" scoped>

</style>