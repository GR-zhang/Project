<template>
  <div class="dashboard-container" >
    <!-- 交易订单 -->
    <el-row :gutter="15">
      <el-col :sm="24" :md="12">
        <card-horizontal-data 
          title="一级交易订单" 
          :api-func="$api.get_tradeOrder_data"
          :api-params="{orderType: 1}"
          :configs.sync="configs_firstTrade" />
      </el-col>
      <el-col :sm="24" :md="12">
        <card-horizontal-data 
          title="二级交易订单" 
          :api-func="$api.get_tradeOrder_data"
          :api-params="{orderType: 2}"
          :configs.sync="configs_secTrade" />
      </el-col>
    </el-row>
    <!-- 概况 -->
    <el-row :gutter="15">
      <el-col :sm="24" :md="12">
        <card-grid-data 
          title="会员概况" 
          :api-func="$api.get_profile_data"
          :api-params="{profileType: 1}"
          :configs.sync="configs_member" />
      </el-col>
      <el-col :sm="24" :md="12">
        <card-grid-data 
          title="创作者概况" 
          :api-func="$api.get_profile_data"
          :api-params="{profileType: 2}"
          :configs.sync="configs_creator" />
      </el-col>
    </el-row>    
    <!-- 藏品销售 -->
    <el-row :gutter="15">
      <el-col :sm="24" :md="7">
        <card-vertical-data 
          title="藏品销售额"
          :api-func="$api.get_collectionSaleNum_data"
          :configs.sync="configs_collection" />
      </el-col>
      <el-col :sm="24" :md="17">
        <card-chart-line-and-bar
          container-id='collection-saleNum-trend-echart'
          title="藏品销售额趋势" tooltip-label="销售额"
          :api-func="$api.get_collectionSaleNumTrend_data"
          :props="{label: 'dateTimes', value: 'tradeAmounts'}" />
      </el-col>
    </el-row>
    <!-- 订单 -->
    <el-row :gutter="15">
      <el-col :sm="24" :md="7">
        <card-vertical-data 
          title="订单数量" 
          :api-func="$api.get_orderAmount_data"
          :configs.sync="configs_order" />
      </el-col>
      <el-col :sm="24" :md="17">
        <card-chart-line-and-bar
          container-id='order-sale-trend-echart'
          title="订单数量趋势" tooltip-label="订单数量"
          :api-func="$api.get_orderSaleTrend_data"
          :props="{label: 'dateTimes', value: 'tradeNums'}" />
      </el-col>
    </el-row>
    <!-- 返回顶部 -->
    <gb-back-top />
  </div>
</template>

<script>
import { CardHorizontalData, CardGridData, CardVerticalData, CardChartLineAndBar } from './components'
import { GbBackTop } from '@/components/global'

export default {
  name: 'Dashboard',
  components: {
    CardHorizontalData,
    CardGridData,
    CardVerticalData,
    CardChartLineAndBar,
    GbBackTop 
  },

  data() {
    return {
      // configs: 一级交易
      configs_firstTrade: [
        { label: '已完成订单', prop: 'completedOrder', value: 0 },
        { label: '已取消订单', prop: 'cancelOrder', value: 0 }
      ],
      // configs: 二级交易
      configs_secTrade: [
        { label: '已完成订单', prop: 'completedOrder', value: 0 },
        { label: '已取消订单', prop: 'cancelOrder', value: 0 }
      ],
      // configs: 会员概况
      configs_member: [
        { label: '今日新增', prop: 'todayNew', value: 0 },
        { label: '本周新增', prop: 'weekNew', value: 0 },
        { label: '本月新增', prop: 'monthNew', value: 0 },
        { label: '会员总数', prop: 'memberTotal', value: 0 }
      ],
      // configs: 创作者概况
      configs_creator: [
        { label: '今日新增', prop: 'todayNew', value: 0 },
        { label: '本周新增', prop: 'weekNew', value: 0 },
        { label: '本月新增', prop: 'monthNew', value: 0 },
        { label: '创作者总数', prop: 'memberTotal', value: 0 }
      ],
      // configs: 藏品销售额
      configs_collection: [
        { label: '今日销售', prop: 'todayValue', value: 0 },
        { label: '昨日销售', prop: 'lastDayValue', value: 0 },
        { label: '本周销售', prop: 'weekValue', value: 0 }
      ],
      // configs: 订单数量
      configs_order: [
        { label: '今日成交量', prop: 'todayValue', value: 0 },
        { label: '昨日成交量', prop: 'lastDayValue', value: 0 },
        { label: '本周成交量', prop: 'weekValue', value: 0 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>