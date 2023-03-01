<template>
  <div class="withdrawal-record-container">
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        :has-operation-column="false"
      >
        <template v-slot:slot-column="{ row }">
          <withdrawal-method-info :row="row" />
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
import { companyApplyStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { WithdrawalMethodInfo } from './components'

// 初始化查询参数
const initialQueryParams = {
  auditStatus: 2 //审核通过 
}

export default {
  name: 'WithdrawalRecord',
  components: { WithdrawalMethodInfo },

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
          label: '审核通过时间',
          prop: 'auditTime',
          minWidth: 140
        }
      ]
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