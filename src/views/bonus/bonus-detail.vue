<template>
  <div class="bonus-detail-container">
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

        :has-operation-column="false" />
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
import { bonusTypeMap, generateOptionsByMap } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  nickName: '',
  userName: '',
  changeType: undefined,
  datetimeRange: [],
  startTime: undefined,
  endTime: undefined
}

export default {
  name: 'BonusDetail',

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员昵称', prop: 'nickName'},
        {label: '手机号码', prop: 'userName'},
        {
          type: 'select',
          label: '奖金类型', 
          prop: 'changeType',

          options: generateOptionsByMap(bonusTypeMap)
        },
        {
          type: 'datetime-range',
          label: '结算发放时间', 
          prop: 'datetimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '会员昵称', prop: 'nickName', minWidth: 100},
        {label: '手机号码', prop: 'userName', minWidth: 100},
        {label: '会员等级', prop: 'levelName', minWidth: 100},
        {label: '奖金类型', prop: 'changeTypeTag', minWidth: 100},
        {label: '奖金金额', prop: 'changeAmount', minWidth: 100},
        {label: '奖金说明', prop: 'description', minWidth: 150},
        {
          type: 'timestamp',
          label: '结算发放时间', 
          prop: 'createTime', 
          minWidth: 140
        }
      ]
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取奖金明细列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_bonusDetail_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = res.data.rows.map((item, index) => ({
          ...item,
          'changeTypeTag': bonusTypeMap.get(item.changeType)
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
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>