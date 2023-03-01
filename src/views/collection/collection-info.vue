<template>
  <div class="collection-info-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDrawer('add')">添加藏品</el-button>
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
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        :operation-column-width="150"
      >
        <template v-slot="{ row }">
          <!-- 已下架显示 -->
          <el-button
            v-if="row.listedStatus != 2"
            type="text" class="text_green" @click="_upOrDownOne(row, 2)">上架</el-button>
          <!-- 已上架显示 -->
          <el-button
            v-if="row.listedStatus != 1"
            type="text" class="text_red" @click="_upOrDownOne(row, 1)">下架</el-button>
          <!-- 售罄：否 显示 -->
          <el-button
            v-if="row.isSellOut == 2"
            type="text" class="text_red" @click="_collectionSoldOut(row, 1)">售罄</el-button>
          <el-button
            v-if="row.isSellOut == 1"
            type="text" class="text_green" @click="_collectionSoldOut(row, 2)">开卖</el-button>

          <el-button type="text" @click="openAddOrEditDrawer('edit', row)">编辑</el-button>
          <el-button type="text" @click="collectionId_goods = row.colId;dialogVisible_goods = true;">商品列表</el-button>
          <el-button type="text" @click="rowData_publish = { ...row };dialogVisible_publish = true;">发行</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 抽屉【添加与编辑】 -->
    <collection-add-or-edit-drawer 
      :drawer-visible.sync="drawerVisible"
      drawer-topic="藏品" :drawer-type="drawerType"
      
      :id="collectionId"
      @refresh="drawerType => drawerType == 'add' ? resetQuery() : _getList()" />
    <!-- 对话框【发行】 -->
    <collection-publish-dialog 
      :dialog-visible.sync="dialogVisible_publish"
      dialog-title="发行"
      :row-data="rowData_publish"
      
      @refresh="_getList()" />
    <!-- 对话框【商品列表】 -->
    <goods-list-dialog
      :dialog-visible.sync="dialogVisible_goods"
      dialog-title="商品列表"
      
      :id="collectionId_goods" />
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'
import { collectionTypeMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { CollectionAddOrEditDrawer, CollectionPublishDialog, GoodsListDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  id: '',
  colName: '',
  userName: '',
  colType: undefined,
  auditStatus: 1,//已通过
}

export default {
  name: 'CollectionInfo',
  components: { CollectionAddOrEditDrawer, CollectionPublishDialog, GoodsListDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '藏品ID', prop: 'colId', inputType: 'id-19-bit'},
        {label: '藏品名称', prop: 'colName'},
        {label: '所属创作者', prop: 'userName'},
        {
          type: 'select',
          label: '藏品类型',
          prop: 'colType',

          options: generateOptionsByMap(collectionTypeMap)
        }
      ],
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品ID', prop: 'colId', minWidth: 150},
        {label: '藏品名称', prop: 'colName', minWidth: 150},
        {
          type: 'img',
          label: '藏品主图', 
          prop: 'thumb', 
          minWidth: 110
        },
        {
          type: 'multi-tag',
          label: '藏品类型',
          prop: 'colType', 
          minWidth: 90,
          
          multiTagInfo: multiTagInfo.collectionType
        },
        {label: '所属创作者', prop: 'userName', minWidth: 130},
        {label: '所属系列', prop: 'seriesName', minWidth: 130},
        {
          type: 'multi-tag',
          label: '推荐商品', 
          prop: 'recommend', 
          minWidth: 90,

          multiTagInfo: multiTagInfo.booleanStatus
        },
        {
          type: 'multi-tag',
          label: '上架状态', 
          prop: 'listedStatus', 
          minWidth: 90,

          multiTagInfo: multiTagInfo.publishStatus
        },
        {
          type: 'multi-tag',
          label: '售罄', 
          prop: 'isSellOut', 
          minWidth: 90,

          multiTagInfo: multiTagInfo.booleanStatus
        },
        {label: '发行数量', prop: 'issueAmount', minWidth: 120},
        {label: '当前剩余总库存', prop: 'surplusTotalStock', minWidth: 120},
        {label: '活动库存', prop: 'activityStock', minWidth: 120},
        {label: '首发库存', prop: 'stock', minWidth: 120},
        {label: '已售数量', prop: 'saleAmount', minWidth: 120},
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 抽屉【添加与编辑】
      drawerVisible: false,
      drawerType: 'add',
      collectionId: '',
      // 对话框【发行】
      dialogVisible_publish: false,
      rowData_publish: {},
      // 对话框【商品列表】
      dialogVisible_goods: false,
      collectionId_goods: '',
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取藏品列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_collection_list({
          params: this.pageParams,
          data: this.queryParams
        })
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
    /**打开抽屉*/
    async openAddOrEditDrawer(type, row) {
      // 赋值藏品id
      if(type == 'add') {
        this.collectionId = '';
      }else {
        this.collectionId = row.colId
      };

      this.drawerType = type;
      await this.$nextTick();
      this.drawerVisible = true;
    },
    /**上架或下架藏品*/
    _upOrDownOne(row, publishStatus) {
      if(publishStatus == 2) {//上架
        tools.upOne(this, {
          comfirmInfo: `是否上架该藏品【${row.colName}】？`,
          callback: async () => {
            return this.$api.up_or_down_one_collection({
              colId: row.colId,
              listedStatus: publishStatus
            })
          }
        })
      }else if(publishStatus == 1) {//下架
        tools.downOne(this, {
          apiFunc: this.$api.up_or_down_one_collection,
          params: {
            colId: row.colId,
            listedStatus: publishStatus
          },
          reasonField: 'listedReason'
        })
      }
    },
    _collectionSoldOut(row, status) {
      let confirmMsg = status == 1 ? 
        `您确定要将该藏品【${row.colName}】设置为"售罄"吗？`
        :
        `您确定要将该藏品【${row.colName}】设置为"开卖"吗？`
      let tipMsg = status == 1 ? '藏品已售罄！' : '藏品已开卖'

      this.$confirm(confirmMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$api.collection_soldOut({
            colId: row.colId,
            isSellOut: status
          })

          this._getList();
          this.$message.success(tipMsg);
        }).catch((e) => {
          throw e;
        }) 
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>