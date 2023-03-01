<template>
  <div class="admin-container">
    <div class="table_card">
      <el-button type="primary" size="mini" @click="openAddOrEditDialog('add')">添加管理员</el-button>
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
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button type="text" class="text_red" @click="_handleDel(row)" v-if="row.id != 1">删除</el-button>
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
      dialogTopic="管理员" :dialog-type="dialogType"
      :row-data="rowData"
      :modal-form-items="cpt_modalFormItems"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"

      width="500px"
      form-label-width="120px" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams,tools } from '@/mixins'

export default {
  name: 'Admin',
  mixins: [commonMixins],

  data() {
    return {
      // 查询表单
      pageParams: { ...sharedPageParams },
      // 表格
      tableColumns: [
        {label: '管理员ID', prop: 'id', minWidth: 150},
        {label: '用户名', prop: 'adminName', minWidth: 150},
        {label: '昵称', prop: 'nickName', minWidth: 150},
        {label: '所属组别', prop: 'roleName',minWidth: 170},
        {label: '手机号码', prop: 'mobile', minWidth: 130},
        {
          type: 'switch',
          label: '状态', 
          prop: 'adminStatus',
          minWidth: 90
        },
        {
          type: 'timestamp',
          label: '最后登录时间',
          prop: 'loginTime',
          minWidth: 140
        }
      ],
      // 对话框
      modalFormItems: [
        {
          label: '所属角色组', 
          prop: 'roleId',
          type: 'select',
          options: [],
          required: true
        },
        {label: '用户名', prop: 'adminName', required: true},
        {label: '昵称', prop: 'nickName', required: true},
        {label: '手机号码', prop: 'mobile', required: true, regExp: 'phone'},
        {label: '密码', prop: 'pwd', isPwdInput: true},
        {
          type: 'switch',
          label: '状态',
          prop: 'adminStatus'
        }
      ]
    }
  },
  computed: {
    cpt_modalFormItems() {
      console.log('cpt_modalFormItems');

      let copy = JSON.parse(JSON.stringify(this.modalFormItems));
      copy[4] = {label: '密码', prop: 'pwd', required: this.dialogType == 'add', isPwdInput: true}
      return copy;
    }
  },

  created() {
    this._setRoleOptions();
  },

  methods: {
    /**设置角色options*/
    async _setRoleOptions() {
      let res = await this.$api.get_role_list({
        pageNum: 1,
        pageSize: 99999
      });
      this.modalFormItems[0].options = (res.data.rows || []).map(item => ({
        label: item.roleName,
        value: item.roleId
      }))
    },

    /**获取管理员列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_admin_list(this.pageParams);
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
          adminStatus: 1 //默认状态：开启
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
        apiFuncs: [this.$api.add_one_admin, this.$api.edit_one_admin],
        data: this.rowData
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除管理员【${row.adminName}】？`,
        callback: async () => {
          return this.$api.del_one_admin(row.id)
        }
      })
    },
    /**切换状态*/
    async _toggleStatus(row) {
      try{
        await this.$api.edit_one_admin({ ...row });
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