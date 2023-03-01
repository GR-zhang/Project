<template>
  <div class="admin-log-container">
    <!-- 查询表单 -->
    <div class="form_card">
      <gb-form-query
        :query-params="queryParams"
        :queryFormItems="queryFormItems"
        @text-input-keyup-enter="filterQuery"
        @search-btn-click="filterQuery"
        @reset-btn-click="resetQuery"
        
        :keyword-field.sync="keywordField"
        :keyword.sync="keyword" />
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

// 查询参数
let initialQueryParams = {
  operate: undefined,
  userName: undefined,
  'datetimeRange': undefined,//临时变量
  operateBeginDate: undefined,
  operateEndDate: undefined
};

export default {
  name: 'AdminLog',

  data() {
    return {
      // 查询表单
      pageParams: { ...sharedPageParams },
      queryParams: { ...initialQueryParams },
      queryFormItems: [
        {
          dropDownBoxOptions: [
            {label: '操作模块', value: 'operate'},
            {label: '管理员名称', value: 'userName'},
          ]
        },
        {
          label: '操作时间',
          prop: 'datetimeRange',
          type: 'datetime-range',
          assignFields: ['operateBeginDate', 'operateEndDate']
        }
      ],
      keywordField: 'operate',
      keyword: undefined,
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '编号', prop: 'id', minWidth: 100},
        {label: '管理员名称', prop: 'userName', minWidth: 130},
        {label: '操作模块', prop: 'operate', minWidth: 130},
        {label: '操作页面', prop: 'description', minWidth: 130},
        {label: 'IP', prop: 'srcIp', minWidth: 110},
        {
          type: 'timestamp',
          label: '操作时间', 
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
    /**获取管理员日志列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_adminLog_list({
          params: this.pageParams,
          data: this.queryParams,
        })
      })
    },
    filterQuery() {
      this.pageParams.pageNum = 1;
      this._getList();
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };
      this.keywordField = 'operate';
      this.keyword = undefined;

      this._getList();
    }
  }
}
</script>

<style>

</style>