<template>
    <div>
        bPageList
        
        <div>
            {{route}}
        </div>
        <p class="color-warn" @click="toNext()">二级的list-info</p>
    </div>
</template>
<script>
export default {
    name:"bPageList",
    data(){
        return{
            route: JSON.stringify(this.$route.params)
        }
    },
    created(){
        
    },
    methods:{
        toNext(){
            this.$router.push("/bPage/b/list/info/123")
        }
    }
}
</script>
<style lang="scss" scoped>

</style>