<template>
    <div>
        bPage

       <p class="color-warn" @click="toNext()">二级的list</p>

    </div>
</template>
<script>
export default {
    name: "dataSource",
    data(){
        return{
            
        }
    },
    methods:{
        toNext(){
            this.$router.push("/bPage/list/123")
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
.line{
    border-top: 4px dotted $color-border;
    margin-bottom: 20px;
}
.back-posi{
    position: absolute;
    left: 20px;
    bottom: 0;
    color: $color-blue;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
}
</style>