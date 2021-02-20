<template>
    <!-- 旧 滑动条(可能会拿不到某些特殊位置的值)  -->
    <!-- <div class="slider" ref="slider">
        <div class="process" :style="{width}"></div>
        <div class="thunk" ref="trunk" :style="{left}">
            <div class="block"></div>
            <div class="tips">
                {{sliderValue}}{{unit || ''}}
                <i class="fas fa-caret-down"></i>
            </div>
        </div>
    </div> -->
    <!-- 新input 滑动条  -->
    <div class="slider_">
        <input class="range-input" :style="'background-size:'+ bgWidth + '% 100%;'"
                  type="range" v-model="per" :min="min" :max="max" :disabled="disabled || false">
        <div class="tips" :style="'left:'+valueWidth+'px'">
                {{per}}{{unit || ''}}
                <i class="fas fa-caret-down"></i>
            </div>
    </div>
</template>
<script>
/*
 * min 进度条最小值
 * max 进度条最大值
 * v-model 对当前值进行双向绑定实时显示拖拽进度
 * */
export default {
    props: ["min", "max", "value","unit","float","disabled"],
    data() {
        return {
            slider: null, //滚动条DOM元素
            thunk: null, //拖拽DOM元素
            per: this.value, //当前值
        };
    },
    watch:{     //监听value的变化，进行相应的操作即可
        value: function(newValue,oldValue){
            this.per = newValue;
        },
    },
    //渲染到页面的时候
    mounted() {
        // 旧 滑动条 -------------------
        // this.slider = this.$refs.slider;
        // this.thunk = this.$refs.trunk;
        // var _this = this;
        // this.thunk.onmousedown = function (e) {
        //     var width = parseInt(_this.width);
        //     var disX = e.clientX;
        //     document.onmousemove = function (e) {
        //         // value, left, width
        //         // 当value变化的时候，会通过计算属性修改left，width

        //         // 拖拽的时候获取的新width
        //         var newWidth = e.clientX - disX + width;
        //         // 拖拽的时候得到新的百分比
        //         var scale = newWidth / _this.slider.offsetWidth;
        //         _this.per = Math.ceil(
        //             (_this.max - _this.min) * scale + _this.min
        //         );
        //         _this.per = Math.max(_this.per, _this.min);
        //         _this.per = Math.min(_this.per, _this.max);
        //         _this.$emit("input", _this.per);
        //     };
        //     document.onmouseup = function () {
        //         document.onmousemove = document.onmouseup = null;
        //     };
        //     return false;
        // };
    },
    computed: {
        // 新 滑动条 -------------------
        valueWidth(){
            this.$emit("input", this.per);
            return (this.per - this.min)/(this.max - this.min)*(400 - 10);
        },
        bgWidth() {
            let value = (this.per - this.min) / (this.max - this.min)*100;
            return value;
        },
        // 旧 滑动条 -------------------
        // 设置一个百分比，提供计算slider进度宽度和trunk的left值
        // 对应公式为  当前值-最小值/最大值-最小值 = slider进度width / slider总width
        // trunk left =  slider进度width + trunk宽度/2
        // scale() {
        //     let value = (this.per - this.min) / (this.max - this.min);
        //     return value;
        // },
        // sliderValue(){
        //     let value = (this.per - this.min) / (this.max - this.min) *100;
        //     let reg = '', float = this.float || 0;
        //     switch(Number(float)){
        //         // case 0: reg = /^\d*(\.?\d{0,4})/g;break;
        //         // case 1: reg = /^\d*(\.?\d{0,5})/g;break;
        //         // case 2: reg = /^\d*(\.?\d{0,6})/g;break;
        //         case 0: reg = 1;break;
        //         case 1: reg = 10;break;
        //         case 2: reg = 100;break;
        //     }
        //     value = value * reg;
        //     // value = Math.trunc(value.toString().match(reg)[0]);
        //     value = Math.trunc(value* reg)/reg;
        //     return value;
        // },
        // width() {
        //     if (this.slider) {
        //         return this.slider.offsetWidth * this.scale + "px";
        //     } else {
        //         return 0 + "px";
        //     }
        // },
        // left() {
        //     if (this.slider) {
        //         return (
        //             this.slider.offsetWidth * this.scale -
        //             this.thunk.offsetWidth / 2 +
        //             "px"
        //         );
        //     } else {
        //         return 0 + "px";
        //     }
        // },
    },
};
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
//旧进度条样式： @import "@/assets/styles/pageStyle/slider.scss";
.box {
    margin: 100px auto 0;
    width: 80%;
}
.clear:after {
    content: "";
    display: block;
    clear: both;
}
//新进度条： input slider样式
.slider_{
    position: relative;
    input[type="range"]{
        -webkit-appearance: none; /*去除默认样式*/
        margin: 12px 0;
        width: 400px !important;
        -webkit-appearance: none;
        height:5px;
        padding: 0;
        border: 0;  // 去除未选中状态边框
        outline: none; // 去除选中状态边框
        background: -webkit-linear-gradient(#059CFA, #059CFA) no-repeat,#DBDBDB;
        background-size: 0% 100%;
        border-radius: 20px;
    }
        input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;/*去除默认样式*/
        cursor: default;
        top: 0;
        height: 14px;
        width: 14px;
        transform: translateY(0px);
        /*background: none repeat scroll 0 0 #5891f5;*/
        background: #fff;
        border-radius: 15px;
        border: 2px solid $color-btn-blue;
        /*-webkit-box-shadow: 0 -1px 1px #fc7701 inset;*/
    }
    .tips {
        position: absolute;
        left: 0;
        bottom: 30px;
        font-size: 14px;
        line-height: 20px;
        // background: #fff;
        height: 20px;
        color: $color-btn-blue;
        margin-left: -10px;
        width: 40px;
        text-align: center;
    }
}
</style>

