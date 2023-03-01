<template>
  <div class="creator-audit-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
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

        :tab-options="tabOptions" :tab-val="queryParams.auditState"
        @tab-change="val => { queryParams.auditState = val;_getList(); }"
      >
        <template v-slot="{ row }">
           <!-- 审核中显示 -->
          <el-button v-if="row.applyStatus == 1" type="text" 
            @click="sel_id = row.designerId;dialogVisible_audit = true;">审核</el-button>
          <!-- 已拒绝显示 -->
          <el-button v-if="row.applyStatus == 3" type="text"
            @click="reason = row.applyComment;dialogVisible_reason = true;">拒绝理由</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框【审核】 -->
    <creator-detail-dialog
      :dialog-visible.sync="dialogVisible_audit"
      dialog-title="创作者审核"
      :id="sel_id" can-audit
      @refresh="_getList()" />
    <refuse-reason-dialog
      :dialog-visible.sync="dialogVisible_reason"
      dialog-title="拒绝理由"
      :reason="reason" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { companyApplyStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { CreatorDetailDialog } from './components'
import { RefuseReasonDialog } from '@/components/business'

// 初始化查询参数
const initialQueryParams = {
  nickName: '',
  contactInfo: '',
  datetimeRange_apply: [],//申请时间
  createBeginDate: '',
  createEndDate: '',
  datetimeRange_audit: [],//审核时间
  auditBeginDate: '',
  auditEndDate: '',
  auditState: undefined
}

export default {
  name: 'CreatorAudit',
  mixins: [commonMixins],
  components: {CreatorDetailDialog, RefuseReasonDialog},

  data() {
    return {
      // 表单
      loading_export: false,
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员昵称', prop: 'nickName'},
        {label: '手机号码', prop: 'contactInfo'},
        {
          type: 'datetime-range',
          label: '申请时间',
          prop: 'datetimeRange_apply',

          assignFields: ['createBeginDate', 'createEndDate']
        },
        {
          type: 'datetime-range',
          label: '审核时间',
          prop: 'datetimeRange_audit',

          assignFields: ['auditBeginDate', 'auditEndDate']
        },
      ],
      // 表格
      tabOptions: generateOptionsByMap(companyApplyStatusMap),
      tableColumns: [
        {label: '会员昵称', prop: 'nickName', minWidth: 150},
        {label: '手机号码', prop: 'contactInfo', minWidth: 100},
        {
          type: 'img',
          label: '会员头像', 
          prop: 'head', 
          minWidth: 110
        },
        {
          type: 'multi-tag',
          label: '创作者类型',
          prop: 'designerType',
          minWidth: 100,

          multiTagInfo: multiTagInfo.creatorType
        },
        {
          type: 'multi-tag',
          label: '审核状态',
          prop: 'applyStatus',
          minWidth: 100,

          multiTagInfo: multiTagInfo.auditStatus
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
          prop: 'applyTime',
          minWidth: 140
        }
      ],
      // 对话框【审核】
      dialogVisible_audit: false,
      sel_id: '',
      // 对话框【拒绝理由】
      dialogVisible_reason: false,
      reason: ''
    }
  },

  methods: {
    /**获取创作者列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_creatorAudit_list({
          params: this.pageParams,
          data: this.queryParams
        });
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**导出*/
    // async _handleExport() {
    //   tools.exportExcel(this, {
    //     apiFunc: this.$api.export_creatorAudit_list,
    //     data: { ...this.queryParams },
    //     fileName: '创作者审核'
    //   })
    // }
  }
  
}
</script>

<style lang="scss" scoped>

</style>