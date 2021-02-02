<template>
    <div ref="chartFunnel" :style="{width: width+'px', height: height+'px'}"></div>
</template>

<script>
export default {
    name: "EchartFunnel",
    props: {
        chartId: {
            default: "myChart",
            type: String,
        },
        width: {
            default: 300,
        },
        height: {
            default: 350,
        },
        ecData: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            myChart: null,
            isHour: false,
        };
    },
    watch: {
        ecData(opt) {
            this.myChart.setOption(this.chartOption(opt));
        },
    },
    mounted() {
        var that = this;
        window.addEventListener("resize", that.initChart,200);
        that.$nextTick(()=>{
            that.initChart();
        })
    },
    methods: {
        initChart() {
            // 基于准备好的dom，初始化echarts实例 document.getElementById(this.chartId)
            this.$nextTick(()=>{
                this.myChart = this.$echarts.init(this.$refs.chartFunnel);
                // 绘制图表
                this.myChart.setOption(this.chartOption());
                this.myChart.resize();
            })
        },
        chartOption() {
            var { title, color, series } = this.ecData;
            var legData = [],
                serData = [];
            if(series){
            series.map((item) => {
                legData.push(item.name);
                serData.push({
                    name: item.name,
                    data: item.data,
                    type: "funnel",
                    left: item.left || "-15%",
                    top: item.top || "10%",
                    //x2: 80,
                    bottom: 20,
                    width: item.width ||"100%",
                    height: item.height ||"80%", //{totalHeight} - y - y2
                    min: 0,
                    max: 100,
                    minSize: "0%",
                    maxSize: "100%",
                    sort: "descending",
                    label: item.label || {
                        show: true,
                        position: "inside",
                        fontSize: 16,
                    },
                    labelLine: item.labelLine || {},
                    itemStyle: {
                        borderColor: "#fff",
                        borderWidth: 5,
                    },
                });
            });
            }
            var options = {
                title: title || {text:""},
                series: serData,
                // title: {
                //     text: "流量转化率",
                //     left: "left",
                //     padding: [30, 0, 0, 30],
                // },
                // padding:[],
                // grid: { x: 60, y: 50, x2: 180, y2: 50 },
                // color: ["#FA6400", "#4CAF50", "#F7B500"],
                // series: [
                //     {
                //         name: "漏斗图",
                //         type: "funnel",
                //         left: "-5%",
                //         top: "30%",
                //         //x2: 80,
                //         bottom: 20,
                //         width: "80%",
                //         height: "60%",
                //         // height: {totalHeight} - y - y2,
                //         min: 0,
                //         max: 100,
                //         minSize: "0%",
                //         maxSize: "100%",
                //         sort: "descending",
                //         label: {
                //             show: true,
                //             position: "inside",
                //             fontSize: 16,
                //         },
                //         itemStyle: {
                //             borderColor: "#fff",
                //             borderWidth: 5,
                //         },

                //         data: [
                //             { value: 60, name: "访问小程序" },
                //             { value: 40, name: "浏览操作" },
                //             {
                //                 value: 20,
                //                 name: "下单成功",
                //                 label: {
                //                     // position:"leftTop",
                //                     padding: [-40, 4, 0, 0],
                //                 },
                //             },
                //         ],
                //     },
                // ],
            };
            if(color){
                options.color = color
            }
            return options;
        },
    },
    destroyed () {
        var that = this;
        window.removeEventListener('resize', that.initChart, 20)
    },
};
</script>

<style lang="scss" scoped>
</style>