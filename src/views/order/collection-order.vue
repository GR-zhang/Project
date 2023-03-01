<template>
  <div class="collection-order-container">
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
      <radio-tab
        class="mb_10"
        :tab-val="queryParams.itemType" 
        @tab-change="val => { queryParams.itemType = val; _getList() }"
        :options="cpt_tabOptions" />
      <el-table 
        v-loading="loading_table" :data="tableList"
        border size="mini" 
      >
        <el-table-column label="订单编号" prop="orderId" min-width="100px" />
        <el-table-column label="订单类型" min-width="100px">
          <template v-slot="{ row }">{{ collectionOrderTypeMap.get(row.itemType) }}</template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="350px">
          <template v-slot="{ row }">
            <div
              class="flex_row_start_center"
              v-for="(item, index) in row.goodsQueryItemVOList" :key="index"
            >
              <div class="mr_10">
                <el-image
                  style="width: 45px;height: 45px"
                  :src="item.thumb" fit="contain"
                  :preview-src-list="[item.thumb]"
                >
                  <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                    <i class="el-icon-picture-outline" style="font-size: 30px;" />
                  </div>
                </el-image>
              </div>
              <div style="flex: 1;">
                <div>
                  <span class="mr_10">藏品名称 #版号: {{ `${item.colName} #${item.itemSn}` }}</span>
                </div>
                <div>
                  <span class="mr_10">藏品ID: {{ item.colId }}</span>
                  <span class="mr_10">
                    <template v-if="multiTagInfo_collectionType[item.colType]">
                      <el-tag :type="multiTagInfo_collectionType[item.colType].tagType" size="mini">
                        {{ multiTagInfo_collectionType[item.colType].tagText }}
                      </el-tag>
                    </template>
                    <template v-else>
                      <el-tag type="danger">- -</el-tag>
                    </template>
                  </span>
                  <span class="mr_10">{{ item.nickName }}</span>
                </div>
              </div>
              <div style="margin-left: 5px;">
                <div>&yen;{{ item.salePrice }}</div>
                <div style="text-align: right;">x{{ item.num }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="买家手机号码" prop="buyerPhone" min-width="100px" />
        <el-table-column label="卖家手机号码" prop="sellerPhone" min-width="100px" />
        <el-table-column label="手续费" prop="fee" min-width="100px" />
        <el-table-column label="订单金额" prop="paymentPrice" min-width="100px" /> 
        <el-table-column label="订单状态" prop="orderStatus" min-width="100px">
          <template v-slot="{ row }">
            <template v-if="multiTagInfo_collectionOrderStatus[row['orderStatus']]">
              <el-tag :type="multiTagInfo_collectionOrderStatus[row['orderStatus']].tagType" size="mini">
                {{ multiTagInfo_collectionOrderStatus[row['orderStatus']].tagText }}
              </el-tag>
            </template>
            <template v-else>
              <el-tag type="danger">- -</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="140px">
          <template v-slot="{ row }">{{ row.createTime * 1000 | parseTime }}</template>
        </el-table-column>
        <el-table-column label="支付时间" min-width="140px">
          <template v-slot="{ row }">{{ row.paymentTime * 1000 | parseTime }}</template>
        </el-table-column>
        <el-table-column label="完成时间" min-width="140px">
          <template v-slot="{ row }">{{ row.finishTime * 1000 | parseTime }}</template>
        </el-table-column>
        <el-table-column label="取消时间" min-width="140px">
          <template v-slot="{ row }">{{ row.cancelTime * 1000 | parseTime }}</template>
        </el-table-column>
      </el-table>
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
import { collectionOrderTypeMap, collectionOrderStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'

import RadioTab from '@/components/global/GbTableDisplay/RadioTab.vue'

// 初始化查询参数
const initialQueryParams = {
  orderId: undefined,
  colName: '',
  buyerPhone: '',
  sellerPhone: '',
  orderStatus: undefined,
  dateTimeRange: [],
  startTime: '',
  endTime: '',
  itemType: undefined
}

export default {
  name: 'CollectionOrder',
  components: { RadioTab },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '订单编号', prop: 'orderId', inputType: 'id-19-bit'},
        {label: '藏品名称', prop: 'colName'},
        {label: '买家手机号码', prop: 'buyerPhone'},
        {label: '卖家手机号码', prop: 'sellerPhone'},
        {
          type: 'select',
          label: '订单状态',
          prop: 'orderStatus',
          options: generateOptionsByMap(collectionOrderStatusMap)
        },
        {
          type: 'datetime-range',
          label: '创建时间',
          prop: 'dateTimeRange',

          assignFields: ['startTime', 'endTime']
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      collectionOrderTypeMap,
      multiTagInfo_collectionType: multiTagInfo.collectionType,
      multiTagInfo_collectionOrderStatus: {
        1: {tagText: '待付款', tagType: 'info'},
        2: {tagText: '已完成', tagType: 'success'},
        3: {tagText: '已取消', tagType: 'danger'},
      }
    }
  },
  computed: {
    cpt_tabOptions() {
      let options = generateOptionsByMap(collectionOrderTypeMap);
      options.unshift({label: '全部', value: undefined});
      return options
    },
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取藏品订单列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_collectionOrder_list({
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
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>