<template>
  <div class="presale-calendar-container">
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
import { presaleTypeMap, generateOptionsByMap } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  type: undefined,
  name: '',
  dateTimeRange: [],
  startTime: '',
  endTime: '',
}

export default {
  name: 'PresaleCalendar',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {
          type: 'select',
          label: '预售类型',
          prop: 'type',

          options: generateOptionsByMap(presaleTypeMap)
        },
        {label: '盲盒/藏品标题', prop: 'name'},
        {
          type: 'datetime-range',
          label: '预售时间',
          prop: 'dateTimeRange',

          assignFields: ['startTime', 'endTime']
        }
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: 'ID', prop: 'id', minWidth: 100},
        {
          type: 'multi-tag',
          label: '预售类型',
          prop: 'type',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '普通藏品', tagType: 'info'},
            2: {tagText: '盲盒藏品', tagType: 'warning'}
          }
        },
        {
          type: 'img',
          label: '盲盒/藏品主图',
          prop: 'thumb',
          minWidth: 110
        },
        {label: '盲盒/藏品标题', prop: 'name', minWidth: 140},
        {
          type: 'timestamp',
          label: '预售时间',
          prop: 'preSaleTime',
          minWidth: 140
        },
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取预售日历列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_presaleCalendar_list({
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