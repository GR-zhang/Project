<template>
  <div class="account-detail-container">
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

        :has-operation-column="false"
      >
        <template v-slot:slot-column="{ row }">
          <span :class="is_amountReduce(row) ? 'text_red' : 'text_green'">
            {{ is_amountReduce(row) ?  row.changeAmount : `+${row.changeAmount}`}}
          </span>
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
import { accountDetailChangeTypeMap } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  nickName: '',
  userPhone: '',
  datetimeRange: [],
  startTime: undefined,
  endTime: undefined
}

export default {
  name: 'AccountDetail',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员昵称', prop: 'nickName'},
        {label: '手机号码', prop: 'userPhone'},
        {
          type: 'datetime-range',
          label: '变动时间',
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
        {label: '会员昵称', prop: 'nickName', minWidth: 130},
        {label: '手机号码', prop: 'userName', minWidth: 100},
        {label: '会员等级', prop: 'levelName', minWidth: 100},
        {
          type: 'slot-column',
          label: '变动数量',
          minWidth: 100
        },
        {
          type: 'mixins',
          label: '剩余余额数量', 
          minWidth: 150,
          children: [
            {label: '变动前', prop: 'balance'},
            {label: '变动后', prop: 'balanceAfter'}
          ]
        },
        {label: '变动说明', prop: 'description', minWidth: 150},
        {label: '变动类型', prop: 'changeTypeTag', minWidth: 120},
        {
          type: 'timestamp',
          label: '变动时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取 账户明细 列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_accountDetail_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = res.data.rows.map((item, index) => ({
          ...item,
          'changeTypeTag': accountDetailChangeTypeMap.get(item.changeType),
          'balanceAfter': item.balance + item.changeAmount //变动后余额
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
    // 数量是否增加
    is_amountReduce(row) {
      return row.changeAmount < 0;
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>