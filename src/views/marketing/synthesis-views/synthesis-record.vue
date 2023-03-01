<template>
  <div class="airdrop-record-container">
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
      >
        <template v-slot="{ row }">
          <el-button type="text" @click="rowData_detail = { ...row }; dialogVisible_detail = true;">查看详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 对话框【查看详情】 -->
      <synthesis-record-detail-dialog
        :dialog-visible.sync="dialogVisible_detail"
        dialog-title="查看详情"
        :row-data="rowData_detail" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { SynthesisRecordDetailDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  nickname: '',
  activityName: '',
  datetimeRang: [],
  timeStart: undefined,
  timeEnd: undefined
}

export default {
  name: 'SynthesisRecord',
  components: { SynthesisRecordDetailDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '合成用户昵称', prop: 'nickname'},
        {label: '合成标题', prop: 'activityName'},
        {
          type: 'datetime-range',
          label: '合成时间',
          prop: 'datetimeRange',

          assignFields: ['timeStart', 'timeEnd']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: 'ID', prop: 'recordId', minWidth: 100},
        {label: '合成用户昵称', prop: 'nickName', minWidth: 140},
        {label: '合成标题', prop: 'activityName', minWidth: 140},
        {
          type: 'img',
          label: '合成目标主图',
          prop: 'activityImage', 
          minWidth: 110
        },
        {label: '合成份数', prop: 'num', minWidth: 100},
        {
          type: 'timestamp',
          label: '合成时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 对话框【查看详情】
      dialogVisible_detail: false,
      rowData_detail: {}
    }
  },
  
  created() {
    this._getList();
  },

  methods: {
    /**获取合成记录列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_systhesisRecord_list({
          ...this.pageParams,
          ...this.queryParams
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
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>