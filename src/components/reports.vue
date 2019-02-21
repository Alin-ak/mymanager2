<template>
  <el-card class="box">
    <CurBread lve1="数据统计" lve2="数据报表" class="mt"></CurBread>
    <div id="main" style="width: 900px;height:500px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
  // 可以操作dom元素 页面加载完
  mounted() {
    this.initEcharts();
  },
  data() {
    return {};
  },
  methods: {
    // 初始化
   async initEcharts() {
      const res = await this.$http.get(`reports/type/1`)
      const obj = res.data
    //   console.log(data);
      
      const myChart = echarts.init(document.getElementById("main"));
      const option1 = {
        title: {
          text: "数据列表"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      const option = {...obj,...option1}
      myChart.setOption(option);  
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.mt {
    margin-bottom:  20px
}
</style>
