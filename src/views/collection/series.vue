<template>
  <div class="series-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">创建系列</el-button>
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
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button class="text_red" type="text" @click="_handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框 -->
    <SeriesAddOrEditDialog
      ref="seriesRef"

      :dialog-visible.sync="dialogVisible"
      dialog-topic="系列" :dialog-type="dialogType"
      :edit-id="editId"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { multiTagInfo } from '@/config'
import { submitDataConvert } from '@/utils/lang-data-hanlde'

import { SeriesAddOrEditDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  seriesName: '',
  userName: ''
}

export default {
  name: 'Series',
  mixins: [commonMixins],
  components: { SeriesAddOrEditDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '系列名称', prop: 'seriesName'},
        {label: '所属创作者', prop: 'userName'}
      ],
      loading_export: false,
      // 表格
      tableColumns: [
        {label: '系列名称', prop: 'seriesName', minWidth: 150},
        {
          type: 'img',
          label: '系列logo', 
          prop: 'logoUrl', 
          minWidth: 110
        },
        {
          type: 'multi-tag',
          label: '热门系列', 
          prop: 'isHot', 
          minWidth: 80,

          multiTagInfo: multiTagInfo.booleanStatus
        },
        {label: '所属创作者', prop: 'userName', minWidth: 150},
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 对话框
      editId: ''
    }
  },

  methods: {
    /**获取系列列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_series_list({
          params: this.pageParams,
          data: this.queryParams
        });
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'edit') {
        this.editId = row.seriesId;
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_one_series, this.$api.edit_one_series],
        data: { 
          ...this.$refs['seriesRef'].detailInfo,
          langDTOS: submitDataConvert(this.$refs['seriesRef'].detailInfo.seriesLangPOS_convert)
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该系列【${row.seriesName}】？`,
        callback: async () => {
          return this.$api.del_one_series(row.seriesId);
        }
      })
    },
    /**导出*/
    _handleExport() {
      tools.exportExcel(this, {
        apiFunc: this.$api.export_series,
        data: this.queryParams,
        fileName: '系列管理'
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>