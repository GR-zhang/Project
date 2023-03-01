<template>
  <div class="recom-network-diagram-container">
    <div class="table_card">
      <el-select
        size="mini" style="width: 100px;margin-right: 5px;"
        v-model="queryParams.type" placeholder="搜索类型"
      >
        <el-option v-for="item in options_type" :key="item.key"
          :label="item.label" :value="item.key" />
      </el-select>
      <el-input
        size="mini" style="width: 180px;margin-right: 10px;"
        v-model="queryParams.title" placeholder="请输入完整信息"
        clearable
        @keyup.enter.native="_getList" />
      <el-button size="mini" type="primary" icon="el-icon-search" @click="_getList">
        搜索
      </el-button>
      <el-button size="mini" icon="el-icon-refresh" type="info" @click="resetQuery">
        重置
      </el-button>
    </div>
    <div class="table_card" v-loading="loading_echart" style="min-height: 200px;">
      <div
        v-show="Object.keys(dataList).length"
        id="container"
        style="width: 100%; height: 500px; overflow: hidden" />
      <div 
        v-show="!Object.keys(dataList).length"
        style="width:100%;height: 500px;line-height: 500px;text-align:center;color: #909399;">暂无数据</div>
      <div class="form_control_tip">注意: 此处分页的目标是 树型数据第二层</div>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
  </div>
</template>

<script>
import imgSrc from "@/../public/images/headPortrait/default.png";
import echarts from "echarts";
import { sharedPageParams } from '@/mixins'

// 初始化查询参数
let initQueryParams = {
  type: "nickName",
  title: ""
}

export default {
  name: 'RecomNetworkDiagram',

  data() {
    return {
      // 表单
      pageParams: { ...sharedPageParams },
      queryParams: { ...initQueryParams },
      options_type: [
        
        {
          key: "nickName",
          label: "会员昵称",
        },
        {
          key: "userName",
          label: "手机号码",
        },
        {
          key: "uid",
          label: "会员ID",
        }
      ],
      // 树状图
      loading_echart: false,
      dataList: [],
      total: 0,
      myChart: null,
      chartData: [],
    };
  },

  mounted() {
    this._getList();
  },

  methods: {
    /**获取推荐网络图数据*/
    _getList() {
      if (!this.loading_echart) {
        this.loading_echart = true;
        const param = JSON.parse(JSON.stringify(this.queryParams));
        let data = {};
        if (param.type && param.title !== "") {
          if (['userId', 'userName'].includes(param.type) && isNaN(param.title)) {
            this.$message.error("请输入数字");
            this.loading_echart = false;
            return;
          } else {
            data[param.type] = param.title;
          }
        }
        this.$api.get_RecomNetworkDiagram_data({ params: this.pageParams, data })
          .then((res) => {
            console.log('res', res);
            this.dataList = res.data || {};
            this.total = res.data.totalNum || 0;
            this.loading_echart = false;
            this.$nextTick(() => {
              this.initEchart();
            });
          })
          .catch((res) => {
            this.loading_echart = false;
          });
      }
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initQueryParams };

      this._getList();
    },

    initEchart() {
      this.chartData = this.dataEChart(this.dataList);
      const dom = document.getElementById("container");
      this.myChart = echarts.init(dom);
      this.myChart.setOption(this.getOption());
    },
    dataEChart(list) {
      const retList = {
        nickName: list.nickName,
        userName: list.userName,
        uid: list.uid,
      };
      const childList = [];

      if (list.children && list.children.length > 0) {
        for (var i = 0; i < list.children.length; i++) {
          childList.push(this.dataEChart(list.children[i]));
        }
      }
      retList.children = childList;
      return retList;
    },
    getOption() {
      const option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: function (param) {
            let data =
                        '会员昵称: ' + (param.data.nickName||'') + '<br>' +
                        '手机号码: ' + (param.data.userName||'') + '<br>' +
                        '会员ID: ' + (param.data.uid||'') + '<br>'     
            return data;
          },
        },
        series: [
          {
            type: "tree",
            roam: true,
            data: [this.chartData],
            left: "0%",
            right: "0%",
            top: "8%",
            bottom: "20%",
            symbol: `image://${imgSrc}`,
            symbolSize: 16,
            orient: "vertical",
            expandAndCollapse: true,
            initialTreeDepth: 10, //展开层级
            label: {
              position: "top",
              rotate: 0,
              offset: [10, 10],
              verticalAlign: "middle",
              align: "center",
              fontSize: 9,
              /*文字内容显示设置*/
               formatter: function (param) {
                // console.log(param);
                let data = '名称: ' + (param.data.nickName||'') + '\n' 
                return data;
              },
            },

            leaves: {
              label: {
                position: "bottom",
                rotate: 0,
                verticalAlign: "middle",
                align: "center",
                fontSize: 12,
              },
            },

            animationDurationUpdate: 750,
          },
        ],
      };
      return option;
    },
  }
}
</script>

<style lang="scss" scoped>

</style>