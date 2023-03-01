<template>
  <div class="after-sale-record-container">
    <!-- 表单 -->
    <div class="form_card">
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
      >
        <template v-slot="{ row }">
          <!-- 审核中显示 -->
          <el-button
            v-if="row.auditStatus == 1"
            type="text" @click="rowData_audit = { ...row }; dialogVisible_audit = true;">审核</el-button>
          <!-- 已拒绝显示 -->
          <el-button v-if="row.auditStatus == 3" type="text"
            @click="reason = row.auditReason;dialogVisible_reason = true;">拒绝理由</el-button>
          <!-- 平台收货状态为[未收货]显示 -->
          <el-button
            v-if="row.receiptStatus == 1"
            type="text" @click="_confirmReceipt(row)">确认收货</el-button>
          <!-- 平台收货状态为[已收货] & 平台发货状态为[未发货]显示 -->
          <el-button
            v-if="row.receiptStatus == 2 && row.sendStatus == 1"
            type="text" @click="openShipDialog(row)">发货</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 对话框【审核】 -->
      <after-sale-audit-dialog
        :dialog-visible.sync="dialogVisible_audit"
        dialog-title="售后申请审核"
        :row-data="rowData_audit"
        
        @refresh="_getList()" />
      <!-- 对话框【拒绝理由】 -->
      <refuse-reason-dialog
        :dialog-visible.sync="dialogVisible_reason"
        dialog-title="拒绝理由"
        :reason="reason" />
      <!-- 对话框【发货】 -->
      <gb-add-and-edit-dialog
        :dialog-visible.sync="dialogVisible_ship"
        dialog-custom-title="发货信息"
        :row-data="rowData_ship"
        :modal-form-items="modalFormItems_ship"
        :submit-loading.sync="loading_submit_ship"
        @submit="_handleSubmit_ship"
        
        width="600px" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { afterSaleTypeMap, companyApplyStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'
import { AfterSaleAuditDialog } from './components'
import { RefuseReasonDialog } from '@/components/business'

// 初始化查询参数
const initialQueryParams = {
  deliveryOrderSn: '',
  colName: '',
  applyType: undefined,
  auditStatus: undefined,
  datetimeRange: [],
  startTime : undefined,
  endTime: undefined
}

export default {
  name: 'AfterSaleRecord',
  components: { AfterSaleAuditDialog, RefuseReasonDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '订单编号', prop: 'deliveryOrderSn'},
        {label: '藏品名称', prop: 'colName'},
        {
          type: 'select',
          label: '售后类型', 
          prop: 'applyType',

          options: generateOptionsByMap(afterSaleTypeMap)
        },
        {
          type: 'select',
          label: '售后状态', 
          prop: 'auditStatus',

          options: generateOptionsByMap(companyApplyStatusMap)
        },
        {
          type: 'datetime-range',
          label: '生成时间', 
          prop: 'datetimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '订单编号', prop: 'deliveryOrderSn', minWidth: 110},
        {
          type: 'img',
          label: '藏品图片',
          prop: 'picture',
          minWidth: 90,
        },
        {label: '藏品名称 #版号', prop: 'colNameAnditemSn', minWidth: 150},
        {label: '售后类型', prop: 'applyTypeTag', minWidth: 110},
        {label: '售后理由', prop: 'applyReason', minWidth: 150},
        {
          type: 'img-arr',
          label: '申请售后补充图片',
          prop: 'applyPictures',
          minWidth: 120,
        },
        {
          type: 'timestamp',
          label: '生成时间',
          prop: 'createTime',
          minWidth: 140
        },
        {
          type: 'multi-tag',
          label: '售后状态',
          prop: 'auditStatus',
          minWidth: 140,

          multiTagInfo: multiTagInfo.auditStatus
        },
        {label: '平台收货状态', prop: 'receiptStatusTag', minWidth: 110},
        {label: '平台发货状态', prop: 'sendStatusTag', minWidth: 110},
        {label: '用户寄回快递单号', prop: 'expressNo', minWidth: 120},
        {label: '平台寄回快递单号', prop: 'sendExpressNo', minWidth: 120},
        {label: '用户收货地址', prop: 'detail', minWidth: 150}
      ],
      // 对话框【审核】
      dialogVisible_audit: false,
      rowData_audit: {},
      // 对话框【拒绝理由】
      dialogVisible_reason: false,
      reason: '',
      // 对话框[发货]
      dialogVisible_ship: false,
      rowData_ship: {},
      modalFormItems_ship: [
        {
          type: 'select-express-company',
          label: '发货公司',
          prop: 'deliveryCompany',
          required: true
        },
        {label: '快递单号', prop: 'trackingBill', required: true}
      ],
      loading_submit_ship: false,
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取售后记录列表*/
    async _getList() {
      const platformShipStatusMap = new Map([
        [1, '待发货'],
        [2, '已发货']
      ]);
      const platformReceiptStatusMap = new Map([
        [1, '未收货'],
        [2, '已收货'],
        [3, '拒收']
      ]);


      tools.setData(this, async () => {
        let res = await this.$api.get_afterSaleRecord_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'applyTypeTag': afterSaleTypeMap.get(item.applyType),
          'sendStatusTag': platformShipStatusMap.get(item.sendStatus),
          'receiptStatusTag': platformReceiptStatusMap.get(item.receiptStatus),
          'applyPictures': item.applyPicture.split(','),
          'colNameAnditemSn': `${item.colName} #${item.itemSn}`
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
    /**打开对话框【发货】*/
    async openShipDialog(row) {
      this.rowData_ship = {
        serviceId: row.serviceId,
        contactInfo: row.phone,
        deliveryCompany: '',
        trackingBill: ''
      }

      await this.$nextTick();
      this.dialogVisible_ship = true;
    },
    async _handleSubmit_ship() {
      try{
        await this.$api.confirm_one_delivery(this.rowData_ship);
        this.loading_submit_ship = false;
        this.dialogVisible_ship = false,
        this.$message.success('发货成功！');
        this._getList();
      }catch(e) {
        this.loading_submit_ship = false;
        throw e;
      }
    },
    /**确认收货*/
    _confirmReceipt(row) {
      tools.comfirmOne(this, {
        comfirmInfo: '您是否确认收货？',
        successTip: '收货成功',
        callback: async () => {
          return this.$api.audit_one_afterSaleRecord({
            serviceId: row.serviceId,
            auditStatus: 4 //4: 确认收货
          })
        }
      })
    }
  },
  
}
</script>

<style lang="scss" scoped>

</style>