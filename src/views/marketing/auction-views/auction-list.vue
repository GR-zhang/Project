<template>
  <div class="auction-list-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" :loading="loading_export" @click="_handleExport">导出</el-button>
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加竞拍</el-button>
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

        :operation-column-width="120"
      >
        <template v-slot="{ row }">
          <!-- 保证金状态为: 待开始显示 -->
          <el-button v-if="row.depositStatus == 1" type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          
          <el-button class="text_grey" type="text" @click="viewId_margin = row.activityId; dialogVisible_margin = true;">保证金记录</el-button>
          <el-button type="text" @click="openAddOrEditDialog('detail', row)">详情</el-button>
          <el-button class="text_grey" type="text" @click="viewId_bid = row.activityId; dialogVisible_bid = true;">出价记录</el-button>
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
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
    <!-- 对话框【保证金记录】 -->
    <margin-record-dialog 
      :dialog-visible.sync="dialogVisible_margin"
      dialog-title="保证金记录"
      :id="viewId_margin" />
    <!-- 对话框【出价记录】 -->
    <bid-record-dialog
      :dialog-visible.sync="dialogVisible_bid"
      dialog-title="出价记录"
      :id="viewId_bid" />
    </div>
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { 
  initiatorTypeMap,
  auctionTypeMap, 
  marginStatusMap, 
  initiatorStatusMap,
  generateOptionsByMap 
} from '@/config'
import { parseTime } from '@/utils'
import precisionCalc from '@/utils/precision-calc'
 
import { AuctionAddOrEditDialog, MarginRecordDialog, BidRecordDialog } from './components'

// 初始查询参数
const initialQueryParams = {
  nickName: '',
  userName: '',
  colName: '',
  marketType: undefined,
  activityMode: undefined,
  depositStatus: undefined,
  activityStatus: undefined,
  datetimeRange_apply: [],
  createStartTime: undefined,
  createEndTime: undefined,
  datetimeRange_audit: [],
  updateStartTime: undefined,
  updateEndTime: undefined
}

export default {
  name: 'AuctionList',
  mixins: [commonMixins],
  components: { AuctionAddOrEditDialog, MarginRecordDialog, BidRecordDialog },

  data() {
    return {
      // 表单
      loading_export: false,
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '发起者昵称', prop: 'nickName'},
        {label: '发起者手机号码', prop: 'userName'},
        {label: '藏品标题', prop: 'colName'},
        {
          type: 'select',
          label: '发起方',
          prop: 'marketType',

          options: generateOptionsByMap(initiatorTypeMap)
        },
        {
          type: 'select',
          label: '竞拍类型',
          prop: 'activityMode',

          options: generateOptionsByMap(auctionTypeMap)
        },
        {
          type: 'select',
          label: '保证金状态',
          prop: 'depositStatus',

          options: generateOptionsByMap(marginStatusMap)
        },
        {
          type: 'select',
          label: '竞拍状态',
          prop: 'activityStatus',

          options: generateOptionsByMap(initiatorStatusMap)
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
        {
          type: 'multi-tag',
          label: '发起方',
          prop: 'marketType',
          minWidth: 90,

          multiTagInfo: {
            1: {tagText: '平台发起', tagType: 'warning'},
            2: {tagText: '用户发起', tagType: 'info'}
          }
        },
        {label: '发起者昵称', prop: 'nickName', minWidth: 110},
        {label: '发起者手机号码', prop: 'userName', minWidth: 110},
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
        {label: '藏品标题', prop: 'activityName', minWidth: 140},
        {
          type: 'img',
          label: '藏品图片',
          prop: 'picture', 
          minWidth: 110
        },
        {label: '藏品编号', prop: 'goodsId', minWidth: 100},
        {
          type: 'multi-tag',
          label: '保证金状态',
          prop: 'depositStatus', 
          minWidth: 90,

          multiTagInfo: {
            1: {tagText: '待开始', tagType: 'info'},
            2: {tagText: '进行中', tagType: 'primary'},
            3: {tagText: '已结束', tagType: 'danger'}
          }
        },
        {
          type: 'multi-tag',
          label: '竞拍状态',
          prop: 'activityStatus', 
          minWidth: 90,

          multiTagInfo: {
            1: {tagText: '未开始', tagType: 'info'},
            2: {tagText: '竞拍中', tagType: 'primary'},
            3: {tagText: '竞拍结束', tagType: 'danger'}
          }
        },
        {
          type: 'mixins',
          label: '保证金缴纳时间', 
          minWidth: 170,
          children: [
            {label: '开始', prop: 'depositStartTime', timestamp: true},
            {label: '结束', prop: 'depositEndTime',  timestamp: true}
          ]
        },
        {
          type: 'mixins',
          label: '竞拍时间', 
          minWidth: 170,
          children: [
            {label: '开始', prop: 'startTime', timestamp: true},
            {label: '结束', prop: 'endTime',  timestamp: true}
          ]
        },
        {
          type: 'timestamp',
          label: '创建时间', 
          prop: 'createTime',
          minWidth: 140
        },
        {label: '成交手续费', prop: 'feeRatio', minWidth: 100},
      ],
      // 对话框【保证金记录】
      dialogVisible_margin: false,
      viewId_margin: '',
      // 对话框【出价记录】
      dialogVisible_bid: false,
      viewId_bid: '',
    }
  },

  methods: {
    /**获取竞拍列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_auction_list({
          params: this.pageParams,
          data: this.queryParams,
        });
        res.data.rows = (res.data.rows || []).map(item => {
          let activityName = item.colName;

          return {
            ...item,
            activityName,
            'colName': (activityName || '').split(' #')[0],
            'itemSn': (activityName || '').split(' #')[1]
          }
        });

        return res;
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**打开对话框【添加与编辑】*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          // 不传表单验证失效
          goodsId: '',
          // 默认竞拍类型: 英式竞拍
          activityMode: 1
        };
      }else {// 编辑与详情
        this.rowData = { 
          ...row,
          // 时间处理
          'datetimeRange_deposit': [parseTime(row.depositStartTime * 1000), parseTime(row.depositEndTime * 1000)],
          'datetimeRange_auction': [parseTime(row.startTime * 1000), parseTime(row.endTime * 1000)],
          /**将竞拍参数放到对象第一层,有的需要处理单位*/
          startingPrice: row.activityAuctionParamDTO.startingPrice,
          // 英式竞拍
          feeRatio: precisionCalc.mul(row.feeRatio || 0, 100),
          markupRange: precisionCalc.mul(row.activityAuctionParamDTO.markupRange || 0, 100),
          delayCycle: precisionCalc.div(row.activityAuctionParamDTO.delayCycle || 0, 60),
          // 荷兰式竞拍
          lowestPrice: row.activityAuctionParamDTO.lowestPrice,
          priceReduction: row.activityAuctionParamDTO.priceReduction,
          reductionCycle: precisionCalc.div(row.activityAuctionParamDTO.reductionCycle || 0, 60)
        };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    // 提交
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_auction, this.$api.add_or_edit_one_auction],
        data: {
          activityId: this.rowData.activityId,
          activityMode: this.rowData.activityMode,
          colId: this.rowData.colId,
          goodsId: this.rowData.goodsId,
          deposit: this.rowData.deposit,
          feeRatio: precisionCalc.div(this.rowData.feeRatio || 0, 100),
          activityAuctionParamDTO: {
            startingPrice: this.rowData.startingPrice,
            // 英式竞拍
            markupRange: precisionCalc.div(this.rowData.markupRange || 0, 100),
            delayCycle: precisionCalc.mul(this.rowData.delayCycle || 0, 60),
            // 荷兰式竞拍
            lowestPrice: this.rowData.lowestPrice,
            priceReduction: this.rowData.priceReduction,
            reductionCycle: precisionCalc.mul(this.rowData.reductionCycle || 0, 60)
          },
          datetimeRange_deposit: this.rowData.datetimeRange_deposit,
          depositStartTime: this.rowData.depositStartTime,
          depositEndTime: this.rowData.depositEndTime,
          datetimeRange_auction: this.rowData.datetimeRange_auction,
          startTime: this.rowData.startTime,
          endTime: this.rowData.endTime,
          // 接口参数不统一
          colName: this.rowData.colName,
          itemSn: this.rowData.itemSn,
          picture: this.rowData.thumb,
          thumb: this.rowData.thumb,
        }
      })
    },
    /**导出*/
    async _handleExport() {
      tools.exportExcel(this, {
        apiFunc: this.$api.export_action_list,
        params: this.pageParams,
        data: this.queryParams,
        fileName: '竞拍列表'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>