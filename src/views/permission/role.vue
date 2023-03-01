<template>
  <div class="role-container">
    <!-- 查询表单 -->
    <div class="table_card">
      <el-button type="primary" size="mini" @click="openAddOrEditDialog('add')">添加角色组</el-button>
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        @switch-change="row => _toggleStatus(row)"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.roleId != '1'"
            type="text" 
            @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button
            v-if="row.roleId != '1'"
            type="text" 
            class="text_red" @click="handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框 -->
    <role-add-or-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-topic="角色组" :dialog-type="dialogType"
      :rowData="rowData"
      
      @refresh-table="resetQuery" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'

import { RoleAddOrEditDialog } from './components'

export default {
  name: 'Role',
  mixins: [commonMixins],
  components: {
    RoleAddOrEditDialog
  },

  data() {
    return {
      // 查询表单
      pageParams: { ...sharedPageParams },
      // 表格
      tableColumns: [
        {label: '角色组ID', prop: 'roleId', minWidth: 150},
        {label: '角色组名称', prop: 'roleName', minWidth: 150},
        {
          type: 'switch',
          label: '状态', 
          prop: 'roleStatus', 
          minWidth: 90
        },
        {
          type: 'timestamp',
          label: '创建时间', 
          prop: 'createTime', 
          minWidth: 140
        },
      ]
    }
  },

  methods: {
    /**获取角色列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_role_list(this.pageParams);
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
          roleId: undefined,
          roleStatus: 1//默认状态：开启
        }
      }else {
        this.rowData = { ...row }
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    /**删除*/
    handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该角色组【${row.roleName}】？`,
        callback: async () => {
          return this.$api.del_one_role(row.roleId)
        }
      })
    },

    /**状态切换*/
    async _toggleStatus(row) {
      if(row.roleId == 1) {// 第一个角色编辑后端权限会出问题，不可被编辑
        this.$message.error(`角色【${row.roleName}】不可关闭!`)
        row.roleStatus = 1;
        return 
      }

      try{
        await this.$api.toggle_one_role({
          roleId: row.roleId,
          roleStatus: row.roleStatus
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

<style>

</style>