<template>
  <div class="recom-leaderboard-container">
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
  dateTimeRange: [],
  createTime: '',
  endTime: '',

  state: 1
}

export default {
  name: 'RecomLeaderboard',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {
          type: 'datetime-range',
          label: '统计时间',
          prop: 'dateTimeRange',

          assignFields: ['createTime', 'endTime']
        }
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '排名', prop: 'rankNo', minWidth: 100},
        {label: '会员ID', prop: 'uid', minWidth: 100},
        {label: '会员昵称', prop: 'nickName', minWidth: 100},
        {label: '会员手机号码', prop: 'userName', minWidth: 100},
        {label: '直推用户量', prop: 'refCnt', minWidth: 100},
        // {label: '实名认证用户数量', prop: '', minWidth: 80},
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取推荐排行榜列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_recomLeaderboard_list({
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