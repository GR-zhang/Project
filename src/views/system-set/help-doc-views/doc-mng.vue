<template>
  <div class="doc-mng-container">
    <div class="table_card flex_row_sb_center">
      <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加文档</el-button>
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
      dialog-topic="文档" :dialog-type="dialogType"
      :row-data="rowData"
      :modal-form-items="modalFormItems"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"
      
      width="800px" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { switchStatusMap, generateOptionsByMap } from '@/config'
import { getLocale, getValue } from '@/utils/lang-data-hanlde'

import { RadioLang } from '@/components/business'

export default {
  name: 'DocMng',
  mixins: [commonMixins],
  components: { RadioLang },

  data() {
    return {
      pageParams: { ...sharedPageParams },
      activeLang: getLocale(),
      // 表格
      tableColumns: [
        {label: '权重', prop: 'weight', minWidth: 130},
        {label: '文档标题', prop: 'title', minWidth: 200},
        {label: '所属分类', prop: 'title', minWidth: 200},
        {
          type: 'timestamp',
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 140
        }
      ],
      // 对话框
      modalFormItems: [
        {label: '文档标题', prop: 'title', required: true},
        {
          type: 'gb-select-api',
          label: '文档分类',
          prop: 'categoryId',
          required: true,

          apiFunc: this.$api.get_docSort_list,
          props: {label: 'title', value: 'id'}
        },
        {
          type: 'rich-text',
          label: '文档内容',
          prop: 'content',
          required: true
        },
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
    /**获取文档列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_docMng_list(this.pageParams);
        res.data.rows = (res.data.rows || []).map((item, index) => ({...item, 'serialNum': index + 1}));
        return res;
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
        apiFuncs: [this.$api.add_or_edit_one_docMng, this.$api.add_or_edit_one_docMng],
        data: {
          ...this.rowData,
          langId: Number.parseInt(getValue())
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该文档【${row.title}】？`,
        callback: async () => {
          return this.$api.del_one_docMng(row.id);
        }
      })
    }
  }  
}
</script>

<style lang="scss" scoped>

</style>