<template>
  <div class="whitelist-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加白名单</el-button>
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

        :operation-column-width="150"
      >
        <template v-slot="{ row }">
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button type="text" @click="viewDetail(row)">查看详情</el-button>
          <el-button class="text_red" type="text" @click="_handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 抽屉【添加或编辑】 -->
      <whitelist-add-or-edit-drawer
        :drawer-visible.sync="dialogVisible"
        drawer-topic="白名单" :drawer-type="dialogType"
        :row-data="rowData"
        :submit-loading.sync="loading_submit"
        @submit="_handleSubmit" />
      <!-- 抽屉【查看详情】 -->
      <whitelist-detail-drawer
        :visible.sync="drawerVisible_detail"
        title="查看详情"
        :row-data="rowData_detail" />
    </div>
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'

import { WhitelistAddOrEditDrawer, WhitelistDetailDrawer } from './components'

// 初始化查询参数
const initialQueryParams = {
  name: '',
  nickName: '',
  phone: ''
}

export default {
  name: 'Whitelist',
  mixins: [commonMixins],
  components: {WhitelistAddOrEditDrawer, WhitelistDetailDrawer},

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '白名单名称', prop: 'name'},
        {label: '用户昵称', prop: 'nickName'},
        {label: '用户手机号', prop: 'phone'},
      ],
      loading_export: false,
      // 表格
      tableColumns: [
        {label: 'ID', prop: 'id', minWidth: 100},
        {label: '白名单名称', prop: 'name', minWidth: 150},
        {label: '白名单会员数', prop: 'userCnt', minWidth: 100},
        {label: '白名单描述', prop: 'description', minWidth: 150},
        {
          type: 'timestamp',
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 140
        },
      ],
      // 抽屉【添加或编辑】
      rowData: {
        userInfoVOS: []
      },
      // 抽屉【查看详情】
      drawerVisible_detail: false,
      rowData_detail: {}
    }
  },

  methods: {
    /**获取白名单列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_whitelist_list({
          params: this.pageParams,
          data: this.queryParams
        });
        
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          userInfoVOS: item.userInfoVOS || []
        }));
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
      if(type == 'add') {
        this.rowData = {
          userInfoVOS: [],
        };
      }else {
        this.rowData = JSON.parse(JSON.stringify(row));
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_one_whitelist, this.$api.edit_one_whitelist],
        data: { 
          id: this.rowData.id,
          name: this.rowData.name,
          description: this.rowData.description,
          userIds: this.rowData.userInfoVOS.map(item => item.uid)
        }
      })
    },
    /**查看详情*/
    viewDetail(row) {
      this.rowData_detail = { ...row };
      this.drawerVisible_detail = true;
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该白名单【${row.name}】？`,
        callback: async () => {
          return this.$api.del_one_whitelist(row.id);
        }
      })
    },
    /**导出*/
    _handleExport() {
      tools.exportExcel(this, {
        apiFunc: this.$api.export_whitelist,
        data: this.queryParams,
        fileName: '白名单管理'
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>