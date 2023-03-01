<template>
  <div class="table_card">
    <!-- 表头 -->
    <div class="head">
      <div class="head__title">{{ title }}</div>
      <div class="head__time-select">
        <div
          class="head__time-select-item"
          v-for="item in options_time" :key="item.value"
          :class="{ active: time === item.value}"
          @click="handleTimeSelect(item.value)"
        >{{ item.label }}</div>
      </div>
      <div class="head__chart-select">
        <div 
          class="head__chart-select-item"
          v-for="item in echartTypes" :key="item"
          @click="handleChartselect(item)"
        >
          <svg-icon :icon-class="item" font-size="25px" :class="{ active : chartType == item}" />
        </div>
      </div>
    </div>
    <!-- 图表 -->
    <div :id="containerId" style="width: 100%; height: 350px" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'CollectionSaleChart',
  
  props: {
    // 容器id
    containerId: {
      type: String,
      required: true
    },
    // 标题
    title: {
      type: String,
      default: '[ 标题 ]'
    },
    tooltipLabel: {// tooltip提示label
      type: String,
      required: true
    },
    // 接口函数
    apiFunc: {
      type: Function,
      require: true
    },
    // 接口数据label与value的别名
    props: {
      type: Object,// 格式{label: '别名', value: '别名'}
      required: true
    }
  },
  data () {
    return {
      // 表头筛选条件
      time: 1, // 七天
      options_time: [
        {label: '七天', value: 1},
        {label: '一个月', value: 2},
        {label: '半年', value: 3}
      ],
      chartType: 'line',// 折线
      echartTypes: ['line', 'bar'],

      // 图表
      chartIns: null,
      chartData: {
        xData: [],
        yData: []
      }
    }
  },

  mounted () {
    this._getData()
  },

  methods: {
    // 获取数据
    _getData () {
      this.apiFunc(this.time).then((res) => {
        this.chartData.xData = res.data[this.props.label];
        this.chartData.yData = res.data[this.props.value];
        this.$nextTick(() => {
          this.initEchart();
        })
      })
    },
    // 初始化图表
    initEchart () {
      const dom = document.getElementById(this.containerId);
      this.chartIns = echarts.init(dom);
      this.chartIns.setOption(this.getOption());
      window.addEventListener('resize', () => {
        this.chartIns.resize();
      })
    },
    // 图表配置项
    getOption () {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData.xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              // show:false,
              interval: 0,
              // rotate: -90,
              formatter: function (value) {
                const str1 = value.substring(0, 4)
                const str2 = value.substring(5)
                return str1 + '\n' + str2
              }
            },
            axisLine: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.tooltipLabel,
            type: this.chartType,
            barWidth: '30%',
            data: this.chartData.yData,
            itemStyle: {
              normal: {
                color: '#409EFF'
              }
            }
          }
        ]
      }
      return option
    },
    
    // 时间选择
    handleTimeSelect(time) {
      this.time = time;
      this._getData();
    },
    // 图表类型选择
    handleChartselect(chartType) {
      this.chartType = chartType;

      this.$nextTick(() => {
        this.initEchart();
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;

  &__title {
    flex: 1;
    color: #606266;
    font-weight: bold;
  }
  &__time-select, &__chart-select{
    padding-right: 60px;
  }
  &__time-select-item, &__chart-select-item {
    display: inline-block;
    padding: 0 10px;
    cursor: pointer;
  }
}

.active {
  color: #36E4EB;
}
</style>
