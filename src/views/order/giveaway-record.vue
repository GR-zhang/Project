<template>
  <div class="giveaway-record-container">
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
        :has-operation-column="false"
        
        :tab-options="tabOptions" :tab-val="queryParams.orderStatus"
        @tab-change="val => { queryParams.orderStatus = val; _getList() }" />
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
import { giveawayStatusMap, generateOptionsByMap } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  colName: '',
  itemSn: '',
  dateTimeRange: [],
  beginTime: '',
  endTime: '',
  fromName: '',
  toName: '',
  orderStatus: undefined
}

export default {
  name: 'GiveawayRecord',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '藏品名称', prop: 'colName'},
        {label: '藏品版号', prop: 'itemSn', inputType: 'id-19-bit'},
        {
          type: 'datetime-range',
          label: '赠与时间',
          prop: 'dateTimeRange',

          assignFields: ['beginTime', 'endTime']
        },
        {label: '转出会员昵称', prop: 'fromName'},
        {label: '接收会员昵称', prop: 'toName'}
      ],
      // 表格
      tabOptions: generateOptionsByMap(giveawayStatusMap),
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品名称', prop: 'colName', minWidth: 100},
        {label: '藏品版号', prop: 'itemSn', minWidth: 100},
        {label: '转出会员昵称', prop: 'fromName', minWidth: 100},
        {label: '接收会员昵称', prop: 'toName', minWidth: 100},
        {label: '手续费', prop: 'fee', minWidth: 80},
        {
          type: 'multi-tag',
          label: '转赠状态',
          prop: 'orderStatus',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '待付款', tagType: 'info'},
            2: {tagText: '转赠中', tagType: 'primary'},
            3: {tagText: '转赠成功', tagType: 'success'},
            4: {tagText: '转赠失败', tagType: 'danger'},
            5: {tagText: '取消订单', tagType: 'danger'}
          }
        },
        {
          type: 'timestamp',
          label: '发出互转时间',
          prop: 'createTime',
          minWidth: 140
        },
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取转赠记录列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_giveawayRecord_list({
          params: this.pageParams,
          data: this.queryParams
        });
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