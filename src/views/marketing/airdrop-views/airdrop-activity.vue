<template>
  <div class="airdrop-activity-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加空投</el-button>
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

        :operation-column-width="200"
      >
        <template v-slot="{ row }">
          <el-button type="text" @click="startAirdrop(row)" :disabled="row.activityStatus != 1">开始投放</el-button>
          <el-button type="text" @click="openAddOrEditDialog('edit', row)" :disabled="row.activityStatus != 1">编辑</el-button>
          <el-button type="text" @click="viewDetail(row)">查看详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 抽屉【添加或编辑】 -->
      <airdrop-add-or-edit-drawer
        :drawer-visible.sync="dialogVisible"
        drawer-topic="空投" :drawer-type="dialogType"
        :row-data="rowData"
        :submit-loading.sync="loading_submit"
        @submit="_handleSubmit" />
      <!-- 抽屉【查看详情】 -->
      <airdrop-detail-drawer
        :visible.sync="drawerVisible_detail"
        title="查看详情"
        :row-data="rowData_detail" />
    </div>
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { addPlaceholderData, submitDataConvert } from '@/utils/lang-data-hanlde'

import { AirdropAddOrEditDrawer, AirdropDetailDrawer } from './components'

// 初始化查询参数
const initialQueryParams = {
  activityName: '',
  activitySeries: '',
  collectionName: ''
}

export default {
  name: 'AirdropActivity',
  mixins: [commonMixins],
  components: {AirdropAddOrEditDrawer, AirdropDetailDrawer}, 

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '空投名称', prop: 'activityName'},
        {label: '空投系列名称', prop: 'activitySeries'},
        {label: '空投藏品名称', prop: 'collectionName'},
      ],
      // loading_export: false,
      // 表格
      tableColumns: [
        {label: 'ID', prop: 'activityId', minWidth: 100},
        {label: '空投名称', prop: 'activityName', minWidth: 150},
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
        },
      ],
      // 抽屉【添加或编辑】
      rowData: {
        collectionDTOList: [],
        activityAirdropLangPOList_convert: addPlaceholderData({activityName: ''})
      },
      // 抽屉【查看详情】
      drawerVisible_detail: false,
      rowData_detail: {}
    }
  },

  methods: {
    /**获取空投列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_airdrop_list({
          params: this.pageParams,
          data: this.queryParams
        });
        
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          collectionDTOList: item.collectionDTOList || []
        }));
        return res;
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**开始投放*/
    startAirdrop(row) {
      this.$confirm(`确定要开始投放这个空投【${row.activityName}】?开始后藏品将按照活动设置投放给对应会员，不可撤销，请确认是否开始投放`,
        '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.start_one_airdrop(row.activityId);
        
        // 刷新列表
        this._getList();
        this.$message.success('投放成功!');
      }).catch((e) => {
        throw e;
      })
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          activityMode: 1,//默认空投方式: 全部
          collectionDTOList: [],
          activityAirdropLangPOList_convert: addPlaceholderData({activityName: ''})
        };
      }else {
        // ps: 在airdrop-add-or-edit-drawer组件中查询详情数据this.rowData
        this.rowData = { 
          ...JSON.parse(JSON.stringify(row)),
          activityAirdropLangPOList_convert: addPlaceholderData({activityName: ''})
        };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_airdrop, this.$api.add_or_edit_one_airdrop],
        data: { 
          activityId: this.rowData.activityId,
          activityName: this.rowData.activityName,
          activityMode: this.rowData.activityMode,
          userLevel: this.rowData.activityMode == 2 ? this.rowData.userLevel : undefined,
          whiteId: this.rowData.activityMode == 3 ? this.rowData.whiteId : undefined,
          collectionDTOList: this.rowData.collectionDTOList.map(item => ({
            colId: item.colId,
            colName: item.colName,
            num: item.num,
            stock: item.stock
          })),
          activityAirdropLangVOList: submitDataConvert(this.rowData.activityAirdropLangPOList_convert)
        }
      })
    },
    /**查看详情*/
    viewDetail(row) {
      this.rowData_detail = { ...row };
      this.drawerVisible_detail = true;
    },
    /**导出*/
    // _handleExport() {
    //   tools.exportExcel(this, {
    //     apiFunc: this.$api.export_airdrop,
    //     data: this.queryParams,
    //     fileName: '空投管理'
    //   })
    // }
  }
  
}
</script>

<style lang="scss" scoped>

</style>