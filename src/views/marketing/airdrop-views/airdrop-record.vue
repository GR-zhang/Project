<template>
  <div class="airdrop-record-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <!-- <el-button size="mini" type="primary" :loading="loading_export" @click="_handleExport">导出</el-button> -->
      </div>
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
  activityName: '',
  userPhone: '',
  collectionName: '',
  datetimeRang: [],
  startTime: undefined,
  endTime: undefined
}

export default {
  name: 'AirdropRecord',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '空投名称', prop: 'activityName'},
        {label: '接收会员手机号码', prop: 'userPhone'},
        {label: '接收藏品名称', prop: 'collectionName'},
        {
          type: 'datetime-range',
          label: '空投完成时间',
          prop: 'datetimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // loading_export: false,
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: 'ID', prop: 'activityId', minWidth: 100},
        {label: '空投名称', prop: 'goodsName', minWidth: 150},
        {label: '接收会员手机号码', prop: 'userName', minWidth: 120},
        {label: '接收会员昵称', prop: 'nickName', minWidth: 130},
        {label: '接收藏品名称', prop: 'colName', minWidth: 130},
        {label: '接收藏品版号', prop: 'goodsSn', minWidth: 130},
        {label: '接收钱包地址', prop: 'toAddress', minWidth: 150},
        {
          type: 'timestamp',
          label: '空投完成时间',
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
    /**获取空投记录列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_airdropRecord_list({
          params: this.pageParams,
          data: this.queryParams
        });
        
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          collectionDTOList: item.collectionDTOList || []
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
    },
    /**导出*/
    // _handleExport() {
    //   tools.exportExcel(this, {
    //     apiFunc: this.$api.export_airdrop,
    //     data: this.queryParams,
    //     fileName: '空投管理'
    //   })
    // }
  }
  
}
</script>

<style lang="scss" scoped>

</style>