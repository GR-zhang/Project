<template>
  <div class="protocol-container">
    <!-- 表格 -->
    <div class="table_card">
      <div class="flex_row_sb_center">
        <div v-show="title" class="page_title">{{ title }}</div>
        <RadioLang v-model="activeLang"/>
      </div>
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"
      >
        <template v-slot="{ row }">
          <el-button type="text" @click="openEditDialog(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="rowData_detail = { ...row }; dialogVisible_detail = true;">查看详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框【编辑】 -->
    <gb-add-and-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-custom-title="编辑协议"
      :row-data="rowData"
      :modal-form-items="modalFormItems"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"
      
      width="800px" />
    <!-- 对话框【查看详情】 -->
    <view-protocol-detail-dialog
      :dialog-visible.sync="dialogVisible_detail"
      dialog-title="协议详情"
      :rowData="rowData_detail" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { getLocale, getValue } from '@/utils/lang-data-hanlde'

import viewProtocolDetailDialog from './viewProtocolDetailDialog'
import RadioLang from '../RadioLang.vue'

export default {
  name: 'ProtocolPage',
  mixins: [commonMixins],
  components: { viewProtocolDetailDialog, RadioLang },

  props: {
    title: {
      type: String,
      default: ''
    },
    // 协议接口函数
    apiFunc: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      pageParams: { ...sharedPageParams },
      activeLang: getLocale(),

      // 表格
      tableColumns: [
        {label: '编号', prop: 'serialNum', minWidth: 130},
        {label: '协议标题', prop: 'title', minWidth: 200},
        {
          type: 'timestamp',
          label: '更新时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 对话框【编辑】
      modalFormItems: [
        {label: '协议标题', prop: 'title', required: true},
        {
          type: 'rich-text',
          label: '协议内容',
          prop: 'content',
          required: true
        }
      ],
      // 对话框【查看详情】
      dialogVisible_detail: false,
      rowData_detail: {}
    }
  },

  methods: {
    /**获取公告列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.apiFunc(this.pageParams);
        res.data.rows = (res.data.rows || []).map((item, index) => ({...item, 'serialNum': index + 1}));
        return res;
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };

      this._getList();
    },
    /**打开对话框*/
    async openEditDialog(row) {
      this.dialogType = 'edit';
      this.rowData = { ...row };

      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        // ps: 添加接口占位
        apiFuncs: [function() {}, this.$api.edit_one_protocol],
        data: {
          ...this.rowData,
          langId: Number.parseInt(getValue())
        }
      })
    }
  }  
}
</script>

<style lang="scss" scoped>

</style>