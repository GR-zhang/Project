<template>
  <div class="wgt-set-container">
    <div class="table_card">
      <el-button type="primary" size="mini" @click="openAddOrEditDialog('add')">添加补丁</el-button>
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button type="text" class="text_red" @click="_handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框 -->
    <wgt-add-and-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialogTopic="补丁" :dialog-type="dialogType"
      :row-data="rowData"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"

      width="500px"
      form-label-width="120px" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams,tools } from '@/mixins'
import { multiTagInfo } from '@/config'

import { WgtAddAndEditDialog } from './components'

export default {
  name: 'WgtSet',
  mixins: [commonMixins],
  components: { WgtAddAndEditDialog },

  data() {
    return {
      // 查询表单
      pageParams: { ...sharedPageParams },
      // 表格
      tableColumns: [
        {label: '版本号', prop: 'versionNum', minWidth: 100},
        {label: 'APP补丁路径', prop: 'patchUrl', minWidth: 200},
        {
          type: 'multi-tag',
          label: '强制更新',
          prop: 'mandatoryUpdate',
          minWidth: 90,

          multiTagInfo: multiTagInfo.isMandatory
        },
        {
          type: 'multi-tag',
          label: '设备',
          prop: 'device',
          minWidth: 90,

          multiTagInfo: multiTagInfo.deviceType
        },
        {label: '备注', prop: 'remark', minWidth: 150},
        {
          type: 'timestamp',
          label: '创建时间', 
          prop: 'createTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '修改时间', 
          prop: 'updateTime',
          minWidth: 140
        }
      ],
      // 对话框
    }
  },

  methods: {
    /**获取补丁列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_wgt_list(this.pageParams);
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this._getList();
    },
    /**添加或编辑*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          remark: '',
          patchUrl: '',
          device: 1, //默认设备：Android
          mandatoryUpdate: 1 //默认强制更新：是
        };
      }else {
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    // 提交
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_wgt, this.$api.add_or_edit_one_wgt],
        data: this.rowData
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该补丁【${row.versionNum}】？`,
        callback: async () => {
          return this.$api.del_one_wgt(row)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>