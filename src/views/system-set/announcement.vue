<template>
  <div class="announcement-container">
    <div class="table_card flex_row_sb_center">
      <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加公告</el-button>
      <RadioLang v-model="activeLang"/>
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        @switch-change="row => _toggleStatus(row)"
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
      dialog-topic="公告" :dialog-type="dialogType"
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
  name: 'Announcement',
  mixins: [commonMixins],
  components: { RadioLang },

  data() {
    return {
      pageParams: { ...sharedPageParams },
      activeLang: getLocale(),
      // 表格
      tableColumns: [
        {label: 'ID', prop: 'id', minWidth: 130},
        {label: '公告标题', prop: 'title', minWidth: 200},
        {
          type: 'switch',
          label: '状态', 
          prop: 'status',
          minWidth: 130
        },
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 对话框
      modalFormItems: [
        {label: '公告标题', prop: 'title', required: true},
        {
          type: 'rich-text',
          label: '公告内容',
          prop: 'content',
          required: true
        },
        {
          type: 'radio',
          label: '状态',
          prop: 'status',

          options: generateOptionsByMap(switchStatusMap)
        }
      ]
    }
  },

  methods: {
    /**获取公告列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_announcement_list(this.pageParams);
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
        this.rowData = {
          status: 1,//默认状态：是
        };
      }else {
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_announcement, this.$api.add_or_edit_one_announcement],
        data: {
          ...this.rowData,
          langId: Number.parseInt(getValue())
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该公告【${row.title}】？`,
        callback: async () => {
          return this.$api.del_one_announcement(row.id);
        }
      })
    },

    /**切换状态*/
    async _toggleStatus(row) {
      try{
        await this.$api.add_or_edit_one_announcement({
          ...row,
          langId: Number.parseInt(getValue())
        });
        this.$message.success('切换成功！');
      }catch(e) {
        this._getList();
        throw e;
      }
    }
  }  
}
</script>

<style lang="scss" scoped>

</style>