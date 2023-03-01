<template>
  <div class="rank-change-history">
    <!-- 表格 -->
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
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'

export default {
  name: 'RankChangeHistory',

  data() {
    return {
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '会员名称', prop: 'userName', minWidth: 140},
        {label: '等级变动前', prop: 'beforeLevel', minWidth: 140},
        {label: '等级变动后', prop: 'afterLevel', minWidth: 140},
        {
          type: 'timestamp',
          label: '变动时间', 
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
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_rankChangeHistory_list({ ...this.pageParams });
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>