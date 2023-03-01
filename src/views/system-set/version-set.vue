<template>
  <div class="version-set-container">
    <!-- 表单 -->
    <div class="table_card">
      <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加版本</el-button>
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
      dialog-topic="版本" :dialog-type="dialogType"
      :row-data="rowData"
      :modal-form-items="modalFormItems"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"
      
      width="700px"
      form-label-width="100px" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { deviceTypeMap, isMandatoryMap, generateOptionsByMap, multiTagInfo } from '@/config'

export default {
  name: 'VersionSet',
  mixins: [commonMixins],

  data() {
    return {
      // 表单
      pageParams: { ...sharedPageParams },
      // 表格
      tableColumns: [
        {label: '版本号', prop: 'versionNum', minWidth: 100},
        {label: 'APP补丁路径', prop: 'versionUrl', minWidth: 200},
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
      modalFormItems: [
        {label: '版本号', prop: 'versionNum', required: true},
        {label: '版本路径', prop: 'versionUrl', required: true},
        {
          type: 'radio',
          label: '设备',
          prop: 'device',
          
          options: generateOptionsByMap(deviceTypeMap)
        },
        {
          type: 'radio',
          label: '强制更新',
          prop: 'mandatoryUpdate',
          
          options: generateOptionsByMap(isMandatoryMap)
        },
        {
          type: 'textarea',
          label: '备注',
          prop: 'remark'
        },
      ]
    }
  },

  methods: {
    /**获取版本列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_version_list(this.pageParams);
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
          remark: '',
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
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_version, this.$api.add_or_edit_one_version],
        data: this.rowData
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该版本【${row.versionNum}】？`,
        callback: async () => {
          return this.$api.del_one_version(row);
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>