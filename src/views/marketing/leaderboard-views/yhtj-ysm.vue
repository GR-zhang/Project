<template>
  <div class="yhtj-ysm-container">
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
  nickname: '',
  phone: ''
}

export default {
  name: 'YhtjYsm',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '用户昵称', prop: 'nickname'},
        {label: '手机号码', prop: 'phone'}
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '排名', prop: 'rankNo', minWidth: 100},
        {label: '用户昵称', prop: 'nickName', minWidth: 100},
        {label: '手机号码', prop: 'phone', minWidth: 100},
        {label: '推荐总人数', prop: 'recommendNum', minWidth: 100},
        {label: '推荐已实名人数', prop: 'recommendAuthNum', minWidth: 100},
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取 用户推荐已实名排行 列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_YhtjYsm_list({
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