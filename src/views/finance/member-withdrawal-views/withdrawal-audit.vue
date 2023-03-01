<template>
  <div class="withdrawal-audit-container">
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        :tabOptions="tabOptions"
        @tab-change="val => {queryParams.auditStatus = val; _getList()}"
      >
        <template v-slot:slot-column="{ row }">
          <withdrawal-method-info :row="row" />
        </template>
        <template v-slot="{ row }">
          <!-- 审核中显示 -->
          <el-button v-if="row.auditStatus == 1" type="text" 
            @click="rowData_audit = { ...row };dialogVisible_audit = true;">审核</el-button>
          <!-- 已拒绝显示 -->
          <el-button v-if="row.auditStatus == 3" type="text"
            @click="reason = row.accountQrcode;dialogVisible_reason = true;">拒绝理由</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 对话框【审核】 -->
      <withdrawal-audit-dialog
        :dialog-visible.sync="dialogVisible_audit"
        dialog-title="提现审批"
        :row-data="rowData_audit"
        
        @refresh="_getList()" />
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

import { WithdrawalAuditDialog, WithdrawalMethodInfo } from './components'
import { RefuseReasonDialog } from '@/components/business'

// 初始化查询参数
const initialQueryParams = {
  auditStatus: undefined  
}

export default {
  name: 'WithdrawalAudit',
  components: { WithdrawalAuditDialog, WithdrawalMethodInfo, RefuseReasonDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      // 表格
      tabOptions: generateOptionsByMap(companyApplyStatusMap),
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '会员ID', prop: 'userId', minWidth: 100},
        {label: '会员昵称', prop: 'userNickName', minWidth: 130},
        {label: '提现金额', prop: 'val', minWidth: 100},
        {label: '手续费', prop: 'fee', minWidth: 100},
        {label: '实得金额', prop: 'realizeMoney', minWidth: 100},
        {
          type: 'multi-tag',
          label: '提现方式',
          prop: 'method',
          minWidth: 90,

          multiTagInfo: multiTagInfo.paymentMethod
        },
        {
          type: 'slot-column',
          label: '提现方式信息',
          minWidth: 200
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
        {
          type: 'multi-tag',
          label: '审核状态',
          prop: 'auditStatus',
          minWidth: 90,

          multiTagInfo: multiTagInfo.auditStatus
        }
      ],
      // 对话框【审核】
      dialogVisible_audit: false,
      rowData_audit: {},
      // 对话框【拒绝理由】
      dialogVisible_reason: false,
      reason: ''
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取 提现审批 列表*/
    async _getList() {
      tools.setData(this, async () => {
        return this.$api.get_withdrawalAudit_list({
          ...this.pageParams,
          ...this.queryParams
        });
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
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>