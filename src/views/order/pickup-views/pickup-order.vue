<template>
  <div class="pickup-order-collection-container">
    <!-- 表单 -->
    <div class="form_card">
      <gb-form-query
        :queryParams="queryParams"
        :queryFormItems="queryFormItems"
        @search-btn-click="filterQuery"
        @reset-btn-click="resetQuery"
        @text-input-keyup-enter="filterQuery" />
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"
      >
        <template v-slot:slot-column="{ row }">
          <div
            class="flex_row_start_center" style="margin-bottom: 5px;"
            v-for="(item, index) in row.deliveryOrderItemsVOList" :key="index"
          >
            <el-image
              class="mr_10"
              style="width: 45px;height: 45px"
              :src="item.thumb" fit="contain"
              :preview-src-list="[item.thumb]"
            >
              <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                <i class="el-icon-picture-outline" style="font-size: 30px;" />
              </div>
            </el-image>
            <div class="textoverflow_2" style="flex: 1;">{{ item.colName }} #{{ item.itemSn }}</div>
          </div>
        </template>
        <template v-slot="{ row }">
          <el-button type="text" @click="rowData_detail = row; visible_detail = true">查看详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 抽屉【查看详情】 -->
      <pickup-order-detail-drawer 
        :visible.sync="visible_detail"
        title="查看详情"
        :row-data="rowData_detail"
        
        @refresh="_getList()" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { paymentTypeMap_pickup, orderTypeMap_pickup, generateOptionsByMap, multiTagInfo } from '@/config'
import { PickupOrderDetailDrawer } from './components'

// 初始化查询参数
const initialQueryParams = {
  orderId: '',
  colName: '',
  orderStatus: undefined,
  paymentType: undefined,
  datetimeRange_send: [],
  sendStartTime : undefined,
  sendEndTime: undefined,
  datetimeRange_take: [],
  takeStartTime : undefined,
  takeEndTime: undefined
}

export default {
  name: 'PickupOrder',
  components: { PickupOrderDetailDrawer },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '订单ID', prop: 'orderId', inputType: 'id-19-bit'},
        {label: '藏品名称', prop: 'colName'},
        {
          type: 'select',
          label: '订单状态', 
          prop: 'orderStatus',

          options: generateOptionsByMap(orderTypeMap_pickup)
        },
        {
          type: 'select',
          label: '支付类型', 
          prop: 'paymentType',

          options: generateOptionsByMap(paymentTypeMap_pickup)
        },
        {
          type: 'datetime-range',
          label: '发货时间', 
          prop: 'datetimeRange_send',

          assignFields: ['sendStartTime', 'sendEndTime']
        },
        {
          type: 'datetime-range',
          label: '收货时间', 
          prop: 'datetimeRange_take',

          assignFields: ['takeStartTime', 'takeEndTime']
        }
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '订单ID', prop: 'orderId', minWidth: 100},
        {label: '提货单号', prop: 'orderSn', minWidth: 110},
        {
          type: 'slot-column',
          label: '藏品信息',
          minWidth: 200
        },
        {label: '总邮费', prop: 'totalPrice', minWidth: 100},
        {label: '支付方式', prop: 'paymentTypeTag', minWidth: 140},
        {
          type: 'multi-tag',
          label: '订单状态',
          prop: 'orderStatus',
          minWidth: 90,

          multiTagInfo: multiTagInfo.orderTypeMap_pickup
        },
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '发货时间',
          prop: 'freightTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '收货时间',
          prop: 'receiptTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '完成时间',
          prop: 'completeTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '取消时间',
          prop: 'cancelTime',
          minWidth: 140
        }
      ],
      // 抽屉【查看详情】
      visible_detail: false,
      rowData_detail: {}
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取待提货藏品列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_pickupOrder_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'paymentTypeTag': paymentTypeMap_pickup.get(item.paymentType),
          // 时间处理
          'completeTime': item.orderStatus == 4 ? item.updateTime : 0,
          'cancelTime': item.orderStatus == 3 ? item.updateTime : 0
        }))
        return res;
      })
    },
    filterQuery() {
      this.pageParams.pageNum = 1;

      this._getList();
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>