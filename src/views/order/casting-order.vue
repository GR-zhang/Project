<template>
  <div class="casting-order-container">
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
        :has-operation-column="false" />
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { paymentTypeMap, castingAuditStatusMap, generateOptionsByMap } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  orderId: undefined,
  orderSn: '',
  applyStatus: undefined,
  dateTimeRange: [],
  startTime: '',
  endTime: '',
}

export default {
  name: 'CastingOrder',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '订单ID', prop: 'orderId', inputType: 'id-19-bit'},
        {label: '铸造订单号', prop: 'orderSn'},
        {
          type: 'select',
          label: '审核状态',
          prop: 'applyStatus',
          options: generateOptionsByMap(castingAuditStatusMap)
        },
        {
          type: 'datetime-range',
          label: '创建时间',
          prop: 'dateTimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '订单ID', prop: 'orderId', minWidth: 80},
        {label: '铸造订单号', prop: 'orderSn', minWidth: 110},
        {label: '所有者ID', prop: 'ownerId', minWidth: 100},
        {label: '铸造藏品ID', prop: 'colId', minWidth: 100},
        {label: '铸造数量', prop: 'mintCnt', minWidth: 80},
        {label: '发行批次', prop: 'issueSn', minWidth: 80},
        {label: '支付类型',prop: 'paymentTypeTag', minWidth: 100},
        {label: '铸造手续费', prop: 'fee', minWidth: 90},
        {
          type: 'multi-tag',
          label: '支付状态',
          prop: 'payStatus',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '未付款', tagType: 'primary'},
            2: {tagText: '已付款', tagType: 'success'}
          }
        },
        {
          type: 'multi-tag',
          label: '审核状态',
          prop: 'applyStatus',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '未审核', tagType: 'info'},
            2: {tagText: '审核中', tagType: 'primary'},
            3: {tagText: '已通过', tagType: 'success'},
            4: {tagText: '已拒绝', tagType: 'danger'}
          }
        },
        {
          type: 'multi-tag',
          label: '铸造状态',
          prop: 'mintStatus',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '未铸造', tagType: 'info'},
            2: {tagText: '铸造中', tagType: 'primary'},
            2: {tagText: '铸造完成', tagType: 'success'},
          }
        },
        {label: '审核理由', prop: 'applyComment', minWidth: 120},
        {label: '铸造状态描述', prop: 'mintComment', minWidth: 120},
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '审核时间',
          prop: 'applyTime',
          minWidth: 140
        },
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取铸造订单列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_castingOrder_list({
          params: this.pageParams,
          data: this.queryParams
        });
        
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'paymentTypeTag': paymentTypeMap.get(item.paymentType)
        }));
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