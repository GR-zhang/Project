<template>
  <div class="creator-log-container">
    <!-- 查询表单 -->
    <div class="form_card">
      <gb-form-query
        :query-params="queryParams"
        :queryFormItems="queryFormItems"
        @text-input-keyup-enter="filterQuery"
        @search-btn-click="filterQuery"
        @reset-btn-click="resetQuery" />
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
import { logTypeMap_creator, generateOptionsByMap } from '@/config'

// 查询参数
let initialQueryParams = {
  userName: undefined,
  logType: undefined,
  'datetimeRange': undefined,//临时变量
  operateBeginDate: undefined,
  operateEndDate: undefined
};

export default {
  name: 'CreatorLog',

  data() {
    return {
      // 查询表单
      pageParams: { ...sharedPageParams },
      queryParams: { ...initialQueryParams },
      queryFormItems: [
        {label: '用户名', prop: 'userName'},
        {
          type: 'select',
          label: '日志类型',
          prop: 'logType',

          options: generateOptionsByMap(logTypeMap_creator)
        },
        {
          label: '操作时间',
          prop: 'datetimeRange',
          type: 'datetime-range',
          assignFields: ['operateBeginDate', 'operateEndDate']
        }
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '设计师ID', prop: 'designerId', minWidth: 130},
        {label: '用户ID', prop: 'userId', minWidth: 130},
        {label: '用户名', prop: 'userName', minWidth: 130},
        {label: '日志类型', prop: 'logTypeTag', minWidth: 130},
        {label: '日志说明', prop: 'description', minWidth: 150},
        {label: 'IP', prop: 'srcIp', minWidth: 110},
        {
          type: 'timestamp',
          label: '创建时间', 
          prop: 'createTime',
          minWidth: 140
        }
      ]
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取创作者日志列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_creatorLog_list({
          params: this.pageParams,
          data: this.queryParams,
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'logTypeTag': logTypeMap_creator.get(item.logType)
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

<style>

</style>