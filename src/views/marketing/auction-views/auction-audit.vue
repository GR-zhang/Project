<template>
  <div class="auction-audit-container">
    <!-- 表单 -->
    <div class="form_card">
      <!-- TODO: 接口未出 -->
      <!-- <div class="mb_10">
        <el-button size="mini" type="primary" :loading="loading_export" @click="_handleExport">导出</el-button>
      </div> -->
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

        :operation-column-width="120"
      >
        <template v-slot="{ row }">
          <!-- 审核中显示 -->
          <el-button v-if="row.auditStatus == 1" type="text" 
            @click="rowData_audit = { ...row };dialogVisible_audit = true;">审核</el-button>
          <!-- 已拒绝显示 -->
          <el-button v-if="row.auditStatus == 3" type="text"
            @click="reason = row.auditReason;dialogVisible_reason = true;">拒绝理由</el-button>        
          <el-button type="text" @click="openAddOrEditDialog('detail', row)">详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 对话框【添加与编辑】 -->
      <auction-add-or-edit-dialog 
        :dialog-visible.sync="dialogVisible"
        :dialog-type="dialogType" dialog-topic="竞拍"
        :row-data="rowData"
        :submit-loading="loading_submit" />
      <!-- 对话框【审核】 -->
      <auction-audit-dialog
        :dialog-visible.sync="dialogVisible_audit"
        dialog-title="竞拍审核"
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
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { 
  auctionTypeMap, 
  companyApplyStatusMap,
  generateOptionsByMap, 
  multiTagInfo
} from '@/config'
import { parseTime } from '@/utils'
import precisionCalc from '@/utils/precision-calc'
 
import { AuctionAddOrEditDialog, AuctionAuditDialog } from './components'
import { RefuseReasonDialog } from '@/components/business'

// 初始查询参数
const initialQueryParams = {
  nickName: '',
  userName: '',
  colName: '',
  activityMode: undefined,
  auditStatus: undefined,
  datetimeRange_apply: [],
  createStartTime: undefined,
  createEndTime: undefined,
  datetimeRange_audit: [],
  updateStartTime: undefined,
  updateEndTime: undefined
}

export default {
  name: 'AuctionAudit',
  mixins: [commonMixins],
  components: { AuctionAddOrEditDialog, AuctionAuditDialog, RefuseReasonDialog },

  data() {
    return {
      // 表单
      loading_export: false,
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员昵称', prop: 'nickName'},
        {label: '手机号码', prop: 'userName'},
        {label: '藏品标题', prop: 'colName'},
        {
          type: 'select',
          label: '竞拍类型',
          prop: 'activityMode',

          options: generateOptionsByMap(auctionTypeMap)
        },
        {
          type: 'select',
          label: '审核状态',
          prop: 'auditStatus',

          options: generateOptionsByMap(companyApplyStatusMap)
        },
        {
          type: 'datetime-range',
          label: '申请时间',
          prop: 'datetimeRange_apply',

          assignFields: ['createStartTime', 'createEndTime']
        },
        {
          type: 'datetime-range',
          label: '审核时间',
          prop: 'datetimeRange_audit',

          assignFields: ['updateStartTime', 'updateEndTime']
        }
      ],
      // 表格
      tableColumns: [
        {label: '会员昵称', prop: 'nickName', minWidth: 110},
        {label: '手机号码', prop: 'userName', minWidth: 110},
        {
          type: 'multi-tag',
          label: '竞拍类型',
          prop: 'activityMode', 
          minWidth: 90,

          multiTagInfo: {
            1: {tagText: '英式竞拍', tagType: 'warning'},
            2: {tagText: '荷兰式竞拍', tagType: 'info'}
          }
        },
        {label: '藏品标题', prop: 'colName', minWidth: 140},
        {
          type: 'img',
          label: '藏品图片',
          prop: 'picture', 
          minWidth: 110
        },
        {label: '藏品编号', prop: 'goodsId', minWidth: 100},
        {
          type: 'multi-tag',
          label: '审核状态',
          prop: 'auditStatus',
          minWidth: 90,

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
          prop: 'updateTime',
          minWidth: 140
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

  methods: {
    /**获取竞拍审核列表*/
    async _getList() {
      tools.setData(this, async () => {
        return this.$api.get_auctionAudit_list({
          params: this.pageParams,
          data: this.queryParams,
        });
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**打开对话框【添加与编辑】*/
    async openAddOrEditDialog(type, row) {
      // if(type == 'add') {
      //   this.rowData = {
      //     // 不传表单验证失效
      //     goodsId: '',
      //     // 默认竞拍类型: 英式竞拍
      //     activityMode: 1
      //   };
      // }else {// 编辑与详情
        this.rowData = { 
          ...row,
          // 时间处理
          'datetimeRange_deposit': [parseTime(row.depositStartTime * 1000), parseTime(row.depositEndTime * 1000)],
          'datetimeRange_auction': [parseTime(row.startTime * 1000), parseTime(row.endTime * 1000)],
          /**将竞拍参数放到对象第一层,有的需要处理单位*/
          startingPrice: (row.activityAuctionParamDTO || {}).startingPrice,
          // 英式竞拍
          feeRatio: precisionCalc.mul(row.feeRatio || 0, 100),
          markupRange: precisionCalc.mul((row.activityAuctionParamDTO || {}).markupRange || 0, 100),
          delayCycle: precisionCalc.div((row.activityAuctionParamDTO || {}).delayCycle || 0, 60),
          // 荷兰式竞拍
          lowestPrice: (row.activityAuctionParamDTO || {}).lowestPrice,
          priceReduction: precisionCalc.mul((row.activityAuctionParamDTO || {}).priceReduction || 0, 100),
          reductionCycle: precisionCalc.div((row.activityAuctionParamDTO || {}).reductionCycle || 0, 60)
        };
      // }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    /**导出*/
    // async _handleExport() {
    //   tools.exportExcel(this, {
    //     apiFunc: this.$api.export_action_list,
    //     params: this.pageParams,
    //     data: this.queryParams,
    //     fileName: '竞拍列表'
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>