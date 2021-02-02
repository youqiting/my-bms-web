<template>
    <div ref="chartPie" :style="{width: width, height: height+'px'}"></div>
</template>

<script>
export default {
    name: "EchartPie",
    props: {
        width: {
            default: "300px",
        },
        height: {
            default: 300,
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
        };
    },
    watch: {
        ecData(opt) {
            this.$nextTick(()=>{
                this.myChart.setOption(this.chartOption(opt));
            })
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
            // 基于准备好的dom，初始化echarts实例
            this.$nextTick(()=>{
                this.myChart = this.$echarts.init(this.$refs.chartPie);
                // 绘制图表
                this.myChart.setOption(this.chartOption());
                this.myChart.resize();
            })
        },
        chartOption() {
            var { serData, serName ,title} = this.ecData,
                legData = [];
            if(serData){
            serData.map((item) => {
                legData.push(item.name);
            });
            }
            return {
                // legend: {
                //     orient: 'vertical',
                //     //  right: 10,
                //     // top: 20,
                //     // bottom: 20,
                //     data: legData
                // },
                // tooltip: {
                //     trigger: 'item',
                //     formatter: '{b} : {c} ({d}%)'
                // },
                // series: {
                //     name: serName,
                //     radius: '55%',
                //     type: "pie",
                //     center: ['40%', '50%'],
                //     data: serData,
                // }
                title: {
                    text: title,
                    left: "left",
                    padding: [30,0,0,30]
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                color: ["#E8684A", "#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16"],
                series: [
                    {
                        name: serName,
                        type: "pie",
                        avoidLabelOverlap: false,
                        radius: ["30%", "65%"],
                        center: ["50%", "60%"],
                        data: serData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    // position: 'inside',//数据在中间显示
                                    formatter: " {b}  {d}%",
                                    //百分比显示，模板变量有 {a}、{b}、{c}、{d}，分别表示系列名
                                    //数据名，数据值，百分比。{d}数据会根据value值计算百分比
                                },
                            },
                        },
                    },
                ],
            };
        },
    },
    destroyed () {
        var that = this;
        window.removeEventListener('resize', that.initChart, 20)
    },
};
</script>

<style scoped>
</style>