<template>
    <div>
        bPageListInfoDetail

        {{route}}
    </div>
</template>
<script>
export default {
    name:"bPageListInfoDetail",
    data(){
        return{
            route: JSON.stringify(this.$route.params)
        }
    },
    created(){
        
    },
    methods:{
        
    }
}
</script>
<style lang="scss" scoped>

</style>