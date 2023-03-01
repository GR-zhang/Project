<template>
  <div class="publish-audit-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <!-- <el-button size="mini" type="primary">导出</el-button> -->
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

        :tab-options="tabOptions" :tab-val="queryParams.auditStatus"
        @tab-change="val => { queryParams.auditStatus = val;_getList(); }"
      >
        <template v-slot="{ row }">
          <!-- 审核中显示 -->
          <el-button v-if="row.auditStatus == 3" type="text" 
            @click="rowData_audit = { ...row };dialogVisible_audit = true;">审核</el-button>
          <!-- 已拒绝显示 -->
          <el-button v-if="row.auditStatus == 2" type="text"
            @click="reason = row.auditReason;dialogVisible_reason = true;">拒绝理由</el-button>
          <el-button type="text" @click="openAddOrEditDrawer('edit', row)">详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框【审核】 -->
    <collection-audit-dialog
      :dialog-visible.sync="dialogVisible_audit"
      dialog-title="藏品审核"
      :row-data="rowData_audit"
      
      @refresh="_getList()" />
    <!-- 对话框【拒绝理由】 -->
    <refuse-reason-dialog
      :dialog-visible.sync="dialogVisible_reason"
      dialog-title="拒绝理由"
      :reason="reason" />
    <!-- 抽屉【添加与编辑 == 详情】 -->
    <collection-add-or-edit-drawer 
      :drawer-visible.sync="drawerVisible"
      drawer-topic="藏品" :drawer-type="drawerType"
      
      :id="collectionId"
      @refresh="drawerType => drawerType == 'add' ? resetQuery() : _getList()"
      noSubmit />
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { collectionTypeMap, collectionAuditStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { CollectionAddOrEditDrawer, CollectionAuditDialog } from './components'
import { RefuseReasonDialog } from '@/components/business'

// 初始化查询参数
const initialQueryParams = {
  id: '',
  colName: '',
  userName: '',
  colType: undefined,
  datetimeRange_apply: [],
  beginCreateTime: undefined,
  endCreateTime: undefined,
  datetimeRange_audit: [],
  beginAuditTime: undefined,
  endAuditTime: undefined,
  auditStatus: undefined,
  belongTo: 2, //1-平台，2-个人
}

export default {
  name: 'PublishAudit',
  components: { CollectionAddOrEditDrawer, CollectionAuditDialog, RefuseReasonDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '藏品ID', prop: 'colId', inputType: 'id-19-bit'},
        {label: '藏品名称', prop: 'colName'},
        {label: '所属创作者', prop: 'userName'},
        {
          type: 'select',
          label: '藏品类型',
          prop: 'colType',

          options: generateOptionsByMap(collectionTypeMap)
        },
        {
          type: 'datetime-range',
          label: '申请时间',
          prop: 'datetimeRange_apply',

          assignFields: ['beginCreateTime', 'endAuditTime']
        },
        {
          type: 'datetime-range',
          label: '审核时间',
          prop: 'datetimeRange_audit',

          assignFields: ['beginAuditTime', 'endAuditTime']
        },
      ],
      // 表格
      tabOptions: generateOptionsByMap(collectionAuditStatusMap),
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品ID', prop: 'colId', minWidth: 150},
        {label: '藏品名称', prop: 'colName', minWidth: 150},
        {
          type: 'img',
          label: '藏品主图', 
          prop: 'thumb', 
          minWidth: 110
        },
        {
          type: 'multi-tag',
          label: '藏品类型',
          prop: 'colType', 
          minWidth: 90,
          
          multiTagInfo: multiTagInfo.collectionType
        },
        {label: '所属创作者', prop: 'userName', minWidth: 130},
        {
          type: 'multi-tag',
          label: '第三方审核状态',
          prop: 'aiAuditStatus',
          minWidth: 100,

          multiTagInfo: multiTagInfo.thirdPartyAuditStatus
        },
        {
          type: 'multi-tag',
          label: '平台审核状态',
          prop: 'auditStatus',
          minWidth: 100,

          multiTagInfo: {
            4: {tagText: '待支付', tagType: 'info'},
            3: {tagText: '审核中', tagType: 'primary'},
            1: {tagText: '已通过', tagType: 'success'},
            2: {tagText: '已拒绝', tagType: 'danger'}
          }
        },
        {
          type: 'timestamp',
          label: '申请时间',
          prop: 'createTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '审核时间',
          prop: 'auditTime',
          minWidth: 140
        },
      ],
      // 对话框【审核】
      dialogVisible_audit: false,
      rowData_audit: {},
      // 对话框【拒绝理由】
      dialogVisible_reason: false,
      reason: '',
      // 抽屉【添加与编辑 == 详情】
      drawerVisible: false,
      drawerType: 'add',
      collectionId: '',
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取藏品列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_collection_list({
          params: this.pageParams,
          data: this.queryParams
        })
      })
    },
    filterQuery() {
      this.pageParams.pageNum = 1;
      this._getList();
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**打开抽屉*/
    async openAddOrEditDrawer(type, row) {
      // ps: 上架审核与藏品信息共用一个drawer,此处【详情】等同于【编辑】

      // 赋值藏品id
      // if(type == 'add') {
      //   this.collectionId = '';
      // }else {
        this.collectionId = row.colId
      // };

      this.drawerType = type;
      await this.$nextTick();
      this.drawerVisible = true;
    },
  }
  
}
</script>

<style lang="scss" scoped>

</style>