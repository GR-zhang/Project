<template>
  <div class="company-list-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
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

        :tab-options="tabOptions" :tab-val="queryParams.auditState"
        @tab-change="val => { queryParams.auditState = val;_getList(); }"
      >
        <template v-slot="{ row }">
          <!-- 审核中显示 -->
          <el-button v-if="row.applyStatus == 1" type="text" 
            @click="isDetail = false; rowData_audit = { ...row };dialogVisible_audit = true;">审核</el-button>
          <el-button v-else type="text" class="text_grey"
            @click="isDetail = true; rowData_audit = { ...row };dialogVisible_audit = true;">详情</el-button>
          <!-- 已拒绝显示 -->
          <el-button v-if="row.applyStatus == 3 || row.aiAuditStatus == 4" type="text"
            @click="reason = row.applyComment;dialogVisible_reason = true;">拒绝理由</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 对话框【审核 || 详情】 -->
      <company-audit-dialog
        :dialog-visible.sync="dialogVisible_audit"
        :dialog-title="isDetail ? '详情' : '企业入驻审核'"
        :row-data="rowData_audit"
        
        :is-detail="isDetail"
        @refresh="_getList()"
        
        v-if="dialogVisible_audit" />
      <!-- 对话框【拒绝理由】 -->
      <refuse-reason-dialog
        :dialog-visible.sync="dialogVisible_reason"
        dialog-title="拒绝理由"
        :reason="reason" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { companyApplyStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { CompanyAuditDialog } from './components'
import { RefuseReasonDialog } from '@/components/business'

// 初始化查询参数
const initialQueryParams = {
  companyName: '',
  applyStatus: undefined,
  datetimeRange_apply: [],
  createBeginDate: undefined,
  createEndDate: undefined,
  datetimeRange_audit: [],
  auditBeginDate: undefined,
  auditEndDate: undefined,
  auditState: undefined
}

export default {
  name: 'CompanyList',
  components: {CompanyAuditDialog, RefuseReasonDialog},

  data() {
    return {
      // 表单
      loading_export: false,
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '企业名称', prop: 'companyName'},
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
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '企业名称', prop: 'companyName', minWidth: 150},
        {label: '法人名称', prop: 'legalPersonName', minWidth: 150},
        {label: '法人身份证', prop: 'legalPersonIdentityCard', minWidth: 145},
        {
          type: 'img-arr',
          label: '身份证图片',
          prop: 'identityPics',
          minWidth: 110
        },
        {label: '联系人姓名', prop: 'linkmanName', minWidth: 120},
        {label: '手机号码', prop: 'linkmanPhone', minWidth: 100},
        {
          type: 'img',
          label: '营业执照', 
          prop: 'licenceUrl', 
          minWidth: 110
        },
        {label: '开户行名称', prop: 'bankName', minWidth: 150},
        {label: '开户户名', prop: 'cardName', minWidth: 100},
        {
          type: 'img',
          label: '银行许可证件照',
          prop: 'bankOpeningPermit',
          minWidth: 110
        },
        {label: '银行卡号', prop: 'cardNo', minWidth: 100},
        {
          type: 'multi-tag',
          label: '第三方审核状态',
          prop: 'aiAuditStatus',
          minWidth: 110,

          multiTagInfo: multiTagInfo.thirdPartyAuditStatus
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
          prop: 'modifyTime',
          minWidth: 140
        }
      ],
      // 对话框【审核 || 详情】
      dialogVisible_audit: false,
      rowData_audit: {},
      isDetail: false,
      // 对话框【拒绝理由】
      dialogVisible_reason: false,
      reason: ''
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取企业列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res =  await this.$api.get_company_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          identityPics: [item.identityFrontUrl, item.identityBackUrl]
        }))

        return res;
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
    /**导出*/
    async _handleExport() {
      tools.exportExcel(this, {
        apiFunc: this.$api.export_company_list,
        data: this.queryParams,
        fileName: '企业列表'
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>