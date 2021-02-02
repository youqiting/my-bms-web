<template>
    <div ref="chartLine" :style="{width: width || '100%', height: height+'px'}"></div>
    <!-- width+'px' -->
</template>

<script>
export default {
    name: "EchartLine",
    props: {
        chartId: {
            default: "myChart",
            type: String,
        },
        width: {
            default: "",
        },
        height: {
            default: 350,
        },
        ecData: {
            type: Object,
            default: function () {
                return {
                    // xAxis:[],
                    // serData:[],
                };
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
            this.$nextTick(()=>{
                this.myChart.setOption(this.chartOption(opt));
            })
        },
    },
    mounted() {
        this.initChart();
        this.$nextTick(()=>{
            window.addEventListener("resize", this.initChart,200);
        })
    },
    methods: {
        initChart() {
            var that = this;
            that.$nextTick(()=>{
                // 基于准备好的dom，初始化echarts实例 document.getElementById(this.chartId)
                that.myChart = that.$echarts.init(that.$refs.chartLine);
                // 绘制图表
                that.myChart.setOption(that.chartOption());
                that.myChart.resize();
            })
        },
        chartOption() {
            var { xAxis, series, unit} = this.ecData;
            var legData = [],
                serData = [];
            if(series){
                series.map((item) => {
                    legData.push(this.$util.isEmpty(item.name) ? "": item.name);
                    var data = [];
                    if(!this.$util.isEmpty(unit)){
                        data = item.data.map(data_=>{
                            return {value:data_, unit: unit}
                        })
                    }else{
                        data = [...item.data]
                    }                    
                    let serDataItem = {
                        name: this.$util.isEmpty(item.name) ? "": item.name,
                        type: "line",
                        // data: item.data,
                        data: data,
                        smooth: true, //光滑曲线
                        splitNumber: 4                 
                    }
                    serData.push(serDataItem);
                });
            }
            var obj = {
                dataZoom: {
                    type: "inside",
                    orient: "horizontal", //水平显示
                    start : 0,
                    end : 100,
                },
                tooltip: {
                    trigger: "axis",
                    backgroundColor: "#fff",
                    borderColor: "#DBDBDB",
                    borderWidth: 1,
                    textStyle: {
                        color: "#999",
                    },
                    position: function (point, params, dom, rect, size) {
                        // 固定位置
                        // if(params[0].dataIndex == (xAxis.length - 1)){
                        //     return [point[0] -20,point[1]+20]
                        // }
                        return [point[0] - 20, point[1] + 40];
                    },
                },
                grid: { x: 60, y: 70, x2: 20, y2: 50 },
                xAxis: {
                    data: xAxis,
                    type: "category",
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#999999",
                        }
                    },
                    axisLabel: {
                        margin: 20,
                        color: "#999999",
                        formatter: function(value){
                            return (series[0].name == "day" || series[0].name == "week")? value.substr(5) : value;
                        }
                    },
                },
                yAxis: {
                    type: "value",
                    nameGap: 20,
                    splitNumber: 4,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: "#999999",
                    },
                },
                series: serData,
                // series: [
                //     {
                //         data: [820, 932, 901, 934, 1290, 1330, 1320],
                //         type: "line",
                //         smooth: true, //光滑曲线
                //         splitNumber: 4,
                //         lineStyle: {
                //             color: "#58B0EF",
                //             normal: {
                //                 width: 2,
                //                 color: "#58B0EF",
                //             },
                //         },
                //         itemStyle: {
                //             normal: {
                //                 color: "#58B0EF",
                //             },
                //         },
                //     },
                // ],
                formatter: function (params) {
                    //处理自定义展示的数值
                    if (params[0].seriesName == "week") {
                        var dayArr = ["日", "一", "二", "三", "四", "五", "六"];
                        return (
                            params[0].axisValue +
                            " 周" +
                            dayArr[new Date(params[0].axisValue).getDay()] +
                            ' <br> <span style="color:#006EFF;">' +
                            params[0].value + (params[0].data.unit || "元") +
                            "</span>"
                        );
                    } else {
                        return (
                            params[0].axisValue +
                            ' <br> <span style="color:#006EFF;">' +
                            params[0].value + (params[0].data.unit || "元") +
                            "</span>"
                        );
                    }
                },
            };
            if(this.ecData.color){
                obj.color = this.ecData.color;
            }else{
                obj.color = ["#58B0EF"];
            }
            return obj;
        },
    },
    destroyed () {
        var that = this;
        window.removeEventListener('resize', that.initChart, 200)
    },
};
</script>

<style lang="scss" scoped>
</style>