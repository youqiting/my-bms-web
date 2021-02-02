<template>
  <div ref="chartBar" :style="{width: width+'px', height: height+'px'}"></div>
</template>

<script>
export default {
  name: "EchartBar",
  props: {
    chartId:{
        default:'myChart',
        type:String
    },
    width: {
        default:300
    },
    height: {
        default:300
    },
    ecData:{
        type:Object,
        default: function () {
            return {}
        }
    },
  },
  data() {
    return {
        myChart:null
    };
  },
  watch:{
    ecData(opt){
        this.myChart.setOption(this.chartOption(opt))
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.chartBar);
      // 绘制图表
      this.myChart.setOption(this.chartOption());
    },
    chartOption(){
        var {xAxis,series} = this.ecData
        var legData = [],serData = [];
        series.map((item)=>{
            legData.push(item.name);
            serData.push({
                name: item.name,
                type: "bar",
                label: {
                    show: true,
                    position: 'top'
                },
                data: item.data
            })
        })
        return {
            tooltip: {},
            legend: {
                data: legData
            },
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {},
            series: serData
      }
    }
  }
};
</script>

<style scoped>
</style>