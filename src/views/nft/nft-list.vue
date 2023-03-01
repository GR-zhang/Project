<template>
  <div class="nft-list-container">
     <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" :loading="loading_export" @click="_handleExport">导出</el-button>
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
      >
        <template v-slot="{ row }">
          <el-button type="text" @click="rowData = { ...row };dialogVisible = true;">流转记录</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 对话框【流转记录】 -->
      <nft-flow-record-dialog 
        :dialog-visible.sync="dialogVisible"
        dialog-title="NFT流转记录"
        :row-data="rowData" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'

import NftFlowRecordDialog from './components/NftFlowRecordDialog'

// 初始化查询参数
const initialQueryParams = {
  tokenId: '',
  colName: '',
  ownerName: '',
  datetimeRange: [],
  startTime: undefined,
  endTime: undefined,
}


export default {
  name: 'NftList',
  components: {NftFlowRecordDialog},

  data() {
    return {
      // 表单
      loading_export: false,
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: 'TokenID', prop: 'tokenId'},
        {label: '藏品名称', prop: 'colName'},
        {label: '所在账户', prop: 'ownerName'},
        {
          type: 'datetime-range',
          label: '更新时间',
          prop: 'datetimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品ID', prop: 'colId', minWidth: 130},
        {label: '藏品版号', prop: 'itemSn', minWidth: 130},
        {label: '合约地址', prop: 'contractAddress', minWidth: 130},
        {label: 'TokenID', prop: 'tokenId', minWidth: 130},
        {
          type: 'img',
          label: '藏品主图', 
          prop: 'picture', 
          minWidth: 80
        },
        {label: '藏品名称', prop: 'colName', minWidth: 120},
        {label: '所属创作者', prop: 'itemCreator', minWidth: 120},
        {label: '所在账户', prop: 'ownerName', minWidth: 120},
        {
          type: 'timestamp',
          label: '更新时间',
          prop: 'updateTime', 
          minWidth: 140
        }
      ],
      // 对话框【流转记录】
      dialogVisible: false,
      rowData: {}
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取创作者列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_nft_list({
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
    },
    /**导出*/
    async _handleExport() {
      tools.exportExcel(this, {
        apiFunc: this.$api.export_nft_list,
        params: this.pageParams,
        data: this.queryParams,
        fileName: 'NFT列表'
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>