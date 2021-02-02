<template>
    <div>
        bPage

        <p class="color-warn" @click="toNext()">二级的list</p>
        <p></p>
        <p class="color-warn" @click="toOrder()">一级的order</p>

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
            this.$router.push("/bPage/b/list/123")
        },
        toOrder(){
            this.$router.push("/bPage/order")
        },
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