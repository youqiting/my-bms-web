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
            this.$router.push("/bPage/list/info/detail/123")
        }
        
    }
}
</script>
<style lang="scss" scoped>

</style>