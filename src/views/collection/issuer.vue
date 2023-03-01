<template>
  <div class="issuer-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">创建发行方</el-button>
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
    <IssuerAddOrEditDialog
      ref="issuerRef"
      :dialog-visible.sync="dialogVisible"
      dialog-topic="发行方" :dialog-type="dialogType"
      :edit-id="editId"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { submitDataConvert } from '@/utils/lang-data-hanlde'
import precisionCalc from '@/utils/precision-calc'

import { IssuerAddOrEditDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  companyName: '',
}

export default {
  name: 'Issuer',
  mixins: [commonMixins],
  components: { IssuerAddOrEditDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '发行方名称', prop: 'companyName'}
      ],
      // loading_export: false,
      // 表格
      tableColumns: [
        {label: '权重', prop: 'weight', minWidth: 100},
        {label: '发行方名称', prop: 'companyName', minWidth: 150},
        {
          type: 'img',
          label: '发行方logo', 
          prop: 'logo', 
          minWidth: 110
        },
        {label: '发行方介绍', prop: 'description', minWidth: 200},
        {label: '发行方比例', prop: 'feeRatioFormat', minWidth: 100},
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 140
        }
      ],
      // 对话框
      editId: ''
    }
  },

  methods: {
    /**获取发行方列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_issuer_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'feeRatioFormat': precisionCalc.mul(item.feeRatio || 0, 100) + '%'
        }))
        return res;
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
        this.editId = row.id;
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_issuer, this.$api.add_or_edit_one_issuer],
        data: { 
          ...this.$refs['issuerRef'].detailInfo,
          feeRatio: precisionCalc.div(this.$refs['issuerRef'].detailInfo.feeRatio || 0, 100),// 百分比 => 小数
          distributionCompanyLangPOList: submitDataConvert(this.$refs['issuerRef'].detailInfo.distributionCompanyLangPOList_convert)
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该发行方【${row.companyName}】？`,
        callback: async () => {
          return this.$api.del_one_issuer(row.id);
        }
      })
    },
    /**导出*/
    // _handleExport() {
    //   tools.exportExcel(this, {
    //     apiFunc: this.$api.export_series,
    //     data: this.queryParams,
    //     fileName: '发行方管理'
    //   })
    // }
  }
  
}
</script>

<style lang="scss" scoped>

</style>