<template>
    <div>
        bPageOrder

       <p class="color-warn" @click="toNext()">一级的list</p>
    </div>
</template>
<script>
export default {
    name:"",
    data(){
        return{
            
        }
    },
    methods:{        
        toNext(){
            this.$router.push("/bPage/b")
        }
    }
}
</script>
<style lang="scss" scoped>

</style>