<template>
  <div class="member-recharge-container">
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
          <template v-if="row.auditStatus == 1">
            <el-button type="text" @click="handleAudit(row, 2)">通过</el-button>
            <el-button class="text_red" type="text" @click="handleAudit(row, 3)">拒绝</el-button>
          </template>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { multiTagInfo } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  userId: '',
  userNickName: '',
  datetimeRange: [],
  startTime: undefined,
  endTime: undefined
}

export default {
  name: 'MemberRecharge',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员ID', prop: 'userId', inputType: 'id-19-bit'},
        {label: '会员昵称', prop: 'userNickName'},
        {
          type: 'datetime-range',
          label: '充值时间',
          prop: 'datetimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '会员ID', prop: 'userId', minWidth: 100},
        {label: '会员昵称', prop: 'userNickName', minWidth: 130},
        {
          type: 'multi-tag',
          label: '充值类型',
          prop: 'depositType',
          minWidth: 90,

          multiTagInfo: {
            1: {tagText: '余额', tagType: 'warning'},
            2: {tagText: '积分', tagType: 'info'}
          }
        },
        {
          type: 'multi-tag',
          label: '充值方法',
          prop: 'depositMethod',
          minWidth: 90,

          multiTagInfo: multiTagInfo.paymentMethod
        },
        {label: '充值金额', prop: 'val', minWidth: 100},
        {
          type: 'img',
          label: '充值凭证',
          prop: 'voucher',
          minWidth: 110
        },
        {label: '充值备注', prop: 'comment', minWidth: 150},
        {
          type: 'timestamp',
          label: '充值时间',
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
      ]
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取 会员充值 列表*/
    async _getList() {
      tools.setData(this, async () => {
        return this.$api.get_memberRecharge_list({
          params: this.pageParams,
          data: this.queryParams
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
    },
    /**审核*/
    handleAudit(row, auditStatus) {

      tools.comfirmOne(this, {
        comfirmInfo: `您确定${auditStatus == 2 ? '通过' : '拒绝'}吗？`,
        successTip: '审核成功！',
        callback: async () => {
          return await this.$api.audit_one_memberRecharge({
            id: row.id,
            auditStatus
          })
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>