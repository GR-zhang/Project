<template>
  <div class="goods-list-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <!-- <el-button size="mini" type="primary">导出</el-button> -->
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
        ref="tableDisplayRef"
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        :operation-column-width="140"
        @trasfer-sort-change="handleSortChange"
      >
        <template v-slot="{ row }">
          <el-button type="text" @click="rowData_edit = { ...row };dialogVisible_edit = true;">编辑</el-button>
          <el-button type="text" @click="rowData = { ...row };dialogVisible = true;">商品流转记录</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    <!-- 对话框【编辑】 -->
    <goods-edit-dialog
      :dialog-visible.sync="dialogVisible_edit"
      dialog-title="商品信息编辑"
      :row-data="rowData_edit"
      
      @refresh="_getList()" />
    </div>
    <!-- 对话框【商品流转记录】 -->
    <goods-flow-record-dialog 
      :dialog-visible.sync="dialogVisible"
      dialog-title="商品流转记录"
      :row-data="rowData" />
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { goodsFrozenStatusMap, goodsStatusMap, marketTypeMap, generateOptionsByMap } from '@/config'

import { GoodsEditDialog, GoodsFlowRecordDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  id: '',
  colName: '',
  frozenState: undefined,
  listedStatus: undefined,
  marketType: undefined,
  sort: undefined
}

export default {
  name: 'GoodsList',
  components: { GoodsEditDialog, GoodsFlowRecordDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '藏品ID', prop: 'colId', inputType: 'id-19-bit'},
        {label: '藏品名称', prop: 'colName'},
        {
          type: 'select',
          label: '冻结状态',
          prop: 'frozenState',

          options: generateOptionsByMap(goodsFrozenStatusMap)
        },
        {
          type: 'select',
          label: '商品状态',
          prop: 'listedStatus',

          options: generateOptionsByMap(goodsStatusMap)
        },
        {
          type: 'select',
          label: '市场类型',
          prop: 'marketType',

          options: generateOptionsByMap(marketTypeMap)
        },
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '商品ID', prop: 'goodsId', minWidth: 130, sortable: 'custom'},
        {label: '藏品ID', prop: 'colId', minWidth: 130},
        {label: '藏品名称 #版号', prop: 'colNameAndItemSn', minWidth: 150},
        {
          type: 'img',
          label: '藏品主图', 
          prop: 'thumb', 
          minWidth: 110
        },
        {label: '所属会员', prop: 'ownerName', minWidth: 130},
        {label: '销售价格', prop: 'salePrice', minWidth: 130, sortable: 'custom'},
        {
          type: 'multi-tag',
          label: '发行状态',
          prop: 'nftIssueStatus',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '待发行', tagType: 'info'},
            2: {tagText: '发行中', tagType: 'primary'},
            3: {tagText: '已发行', tagType: 'success'},
            4: {tagText: '发行失败', tagType: 'danger'}
          }
        },
        {label: '冻结状态', prop: 'frozenStateTag', minWidth: 100},
        {
          type: 'timestamp',
          label: '冻结结束时间',
          prop: 'frozenTime',
          minWidth: 140
        },
        {
          type: 'multi-tag',
          label: '商品状态',
          prop: 'listedStatus',
          minWidth: 100,

          multiTagInfo: {
            2: {tagText: '已上架', tagType: 'success'},
            1: {tagText: '已下架', tagType: 'danger'},
          }
        },
        {
          type: 'multi-tag',
          label: '市场类型',
          prop: 'marketType',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '首发', tagType: 'warning'},
            2: {tagText: '寄售', tagType: 'info'}
          }
        },
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140,
          sortable: 'custom'
        },
      ],
      // 对话框【编辑】
      dialogVisible_edit: false,
      rowData_edit: {},
      // 对话框【商品流转记录】
      dialogVisible: false,
      rowData: {}
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取商品列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res =  await this.$api.get_goods_list({
          params: this.pageParams,
          data: this.queryParams
        })
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'colNameAndItemSn': `${item.colName} #${item.itemSn}`,
          'frozenStateTag': goodsFrozenStatusMap.get(item.frozenState)
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

      this.$refs['tableDisplayRef'].transfer_clearSort();
      this._getList();
    },
    /**排序*/
    handleSortChange(params) {
      if(params.order) {
        // 排序对象
        let orderObj = {
          goodsId: {ascending: 1, descending: 5},
          salePrice: {ascending: 2, descending: 6},
          createTime: {ascending: 3, descending: 4}
        }
        this.queryParams.sort = orderObj[params.prop][params.order];
      }else {
        this.queryParams.sort = undefined;
      }

      this.filterQuery();
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>