<template>
  <div class="pending-delivery-collection-container">
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

// 初始化查询参数
const initialQueryParams = {
  colName: '',
  phone: ''
}

export default {
  name: 'PendingDeliveryCollection',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '藏品名称', prop: 'colName'},
        {label: '所属会员手机号码', prop: 'phone'}
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品ID', prop: 'colId', minWidth: 100},
        {label: '藏品名称 #版号', prop: 'colNameAndItemSn', minWidth: 150},
        {
          type: 'img',
          label: '藏品主图',
          prop: 'picture',
          minWidth: 110
        },
        {label: '藏品所属会员', prop: 'userName', minWidth: 140},
        {
          type: 'timestamp',
          label: '生成时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取待提货藏品列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_pendingDeliveryCollection_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'colNameAndItemSn': `${item.colName} #${item.itemSn || ''}`
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