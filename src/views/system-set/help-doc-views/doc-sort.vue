<template>
  <div class="doc-sort-container">
    <div class="table_card flex_row_sb_center">
      <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加分类</el-button>
      <RadioLang v-model="activeLang"/>
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
    <gb-add-and-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-topic="分类" :dialog-type="dialogType"
      :row-data="rowData"
      :modal-form-items="modalFormItems"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"
      
      width="500px" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { getLocale, getValue } from '@/utils/lang-data-hanlde'

import { RadioLang } from '@/components/business'

export default {
  name: 'DocSort',
  mixins: [commonMixins],
  components: { RadioLang },

  data() {
    return {
      pageParams: { ...sharedPageParams },
      activeLang: getLocale(),
      // 表格
      tableColumns: [
        {label: '权重', prop: 'weight', minWidth: 100},
        {label: '分类名称', prop: 'title', minWidth: 140},
        {label: '文档数量', prop: 'docNum', minWidth: 140},
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'updateTime',
          minWidth: 140
        }
      ],
      // 对话框
      modalFormItems: [
        {label: '分类名称', prop: 'title', required: true},
        {
          type: 'gb-input-number',
          label: '权重',
          prop: 'weight',
          required: true,
          tip: '权重越大，排序越前',

          limitType: 'integer'
        }
      ]
    }
  },

  methods: {
    /**获取分类列表*/
    async _getList() {
      tools.setData(this, async () => {
        return this.$api.get_docSort_list(this.pageParams);
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      
      this._getList();
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {};
      }else {
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_docSort, this.$api.add_or_edit_one_docSort],
        data: {
          ...this.rowData,
          langId: Number.parseInt(getValue())
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该分类【${row.title}】？`,
        callback: async () => {
          return this.$api.del_one_docSort(row.id);
        }
      })
    }
  }  
}
</script>

<style lang="scss" scoped>

</style>